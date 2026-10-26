import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  CropRecommendationDto,
  RecommendationResponse,
  RecommendationHistoryItem,
  CropSeason,
  SoilType,
  Farm,
  SoilTest,
} from '../types';
import { VERIFIED_CROP_CATALOG } from './cropService';
import { apiClient } from './apiClient';

export interface GenerateRecommendationParams {
  farmId: string;
  farm: Farm;
  soilTest?: SoilTest;
  season?: CropSeason;
  soilType?: SoilType;
  phLevel?: number;
  nitrogenLevel?: number;
  phosphorusLevel?: number;
  potassiumLevel?: number;
  temperatureCelsius?: number;
  rainfallMm?: number;
  irrigationMethod?: string;
  previousCrop?: string;
  sustainabilityPreference?: 'BALANCED' | 'WATER_CONSERVATION' | 'SOIL_HEALTH' | 'PROFIT_FOCUSED';
}

export const recommendationService = {
  async generateRecommendations(
    userId: string,
    params: GenerateRecommendationParams
  ): Promise<RecommendationResponse> {
    // 1. Try Java Backend endpoint first
    try {
      const payload = {
        farmId: params.farmId,
        soilTestId: params.soilTest?.id,
        season: params.season || 'KHARIF',
        soilType: params.soilType || params.farm.soilType,
        phLevel: params.phLevel !== undefined ? params.phLevel : params.soilTest?.phLevel,
        nitrogenLevel: params.nitrogenLevel !== undefined ? params.nitrogenLevel : params.soilTest?.nitrogenLevel,
        phosphorusLevel: params.phosphorusLevel !== undefined ? params.phosphorusLevel : params.soilTest?.phosphorusLevel,
        potassiumLevel: params.potassiumLevel !== undefined ? params.potassiumLevel : params.soilTest?.potassiumLevel,
        temperatureCelsius: params.temperatureCelsius,
        rainfallMm: params.rainfallMm,
        irrigationMethod: params.irrigationMethod || params.farm.irrigationSource,
        previousCrop: params.previousCrop || 'None',
        sustainabilityPreference: params.sustainabilityPreference || 'BALANCED',
      };

      const res = await apiClient.post<RecommendationResponse>('recommendations/generate', payload);
      if (res && res.data && res.data.topRecommendations) {
        return res.data;
      }
    } catch {
      // Backend unavailable or error: fall through to client-side deterministic agronomic engine
    }

    // 2. Client-side agronomic engine (Identical mathematical logic to Java 8 CropRecommendationService)
    const effectiveSoilType = (params.soilType || params.farm.soilType || 'LOAMY').toUpperCase();
    const effectivePh = params.phLevel !== undefined ? params.phLevel : params.soilTest?.phLevel;
    const effectiveN = params.nitrogenLevel !== undefined ? params.nitrogenLevel : params.soilTest?.nitrogenLevel;
    const effectiveP = params.phosphorusLevel !== undefined ? params.phosphorusLevel : params.soilTest?.phosphorusLevel;
    const effectiveK = params.potassiumLevel !== undefined ? params.potassiumLevel : params.soilTest?.potassiumLevel;
    const effectiveSeason = (params.season || 'KHARIF') as CropSeason;
    const effectiveIrrigation = (params.irrigationMethod || params.farm.irrigationSource || 'CANAL').toUpperCase();
    const effectivePreviousCrop = (params.previousCrop || 'None').trim();

    const missingNotices: string[] = [];
    if (effectivePh === undefined) missingNotices.push('Laboratory soil pH assay missing; using standard loam assumption.');
    if (effectiveN === undefined) missingNotices.push('Soil available macronutrients (N-P-K) missing; recommend laboratory test.');
    if (params.temperatureCelsius === undefined) missingNotices.push('Ambient temperature estimate missing; defaulted to regional seasonal mean.');
    if (params.rainfallMm === undefined) missingNotices.push('Seasonal rainfall telemetry missing; calculations assume irrigation reliance.');

    let completeness: 'COMPLETE' | 'PARTIAL' | 'MINIMAL' = 'COMPLETE';
    if (missingNotices.length >= 3) completeness = 'MINIMAL';
    else if (missingNotices.length > 0) completeness = 'PARTIAL';

    const climateMissing = params.temperatureCelsius === undefined && params.rainfallMm === undefined;

    const candidates: CropRecommendationDto[] = VERIFIED_CROP_CATALOG.map((crop) => {
      // A. Soil Compatibility Evaluation (0-100)
      let soilScore = 75;
      const reasons: string[] = [];
      const warnings: string[] = [];
      let criticalSoilFail = false;
      let soilFailReason = '';

      if (crop.suitableSoilTypes.includes(effectiveSoilType)) {
        soilScore += 15;
        reasons.push(`Optimal texture: ${effectiveSoilType} provides ideal drainage and root aeration for ${crop.cropName}.`);
      } else {
        soilScore -= 30;
        warnings.push(`Sub-optimal soil texture: ${effectiveSoilType} is outside the primary preferred classes for ${crop.cropName}.`);
      }

      if (effectivePh !== undefined) {
        if (effectivePh >= crop.minimumSuitablePH && effectivePh <= crop.maximumSuitablePH) {
          soilScore += 10;
          reasons.push(`Soil pH (${effectivePh.toFixed(1)}) is within the optimal physiological band (${crop.minimumSuitablePH} - ${crop.maximumSuitablePH}).`);
        } else if (effectivePh < crop.minimumSuitablePH - 1.2 || effectivePh > crop.maximumSuitablePH + 1.2) {
          criticalSoilFail = true;
          soilFailReason = `Severe pH stress: Field pH (${effectivePh.toFixed(1)}) induces toxicities or nutrient lockout for ${crop.cropName}.`;
          warnings.push(soilFailReason);
          soilScore = 15;
        } else {
          soilScore -= 20;
          warnings.push(`Marginal soil pH (${effectivePh.toFixed(1)}); requires lime or gypsum amendment.`);
        }
      }

      // NPK evaluation
      if (effectiveN !== undefined && crop.minNitrogenKgPerHa) {
        if (effectiveN < crop.minNitrogenKgPerHa * 0.7) {
          soilScore -= 10;
          warnings.push(`Available Nitrogen (${effectiveN} kg/ha) is below required ${crop.minNitrogenKgPerHa} kg/ha; basal starter N needed.`);
        } else {
          soilScore += 5;
        }
      }

      soilScore = Math.max(10, Math.min(100, soilScore));

      // B. Climate Compatibility (0-100)
      let climateScore = 80;
      let criticalClimateFail = false;
      let climateFailReason = '';
      if (params.temperatureCelsius !== undefined && crop.minTemperatureCelsius && crop.maxTemperatureCelsius) {
        const temp = params.temperatureCelsius;
        if (temp >= crop.minTemperatureCelsius && temp <= crop.maxTemperatureCelsius) {
          climateScore += 15;
          reasons.push(`Temperature (${temp}°C) matches thermal comfort window (${crop.minTemperatureCelsius}-${crop.maxTemperatureCelsius}°C).`);
        } else if (temp < crop.minTemperatureCelsius - 5 || temp > crop.maxTemperatureCelsius + 5) {
          criticalClimateFail = true;
          climateFailReason = `Extreme temperature (${temp}°C) exceeds thermal thresholds for ${crop.cropName}.`;
          warnings.push(climateFailReason);
          climateScore = 15;
        } else {
          climateScore -= 25;
          warnings.push(`Temperature (${temp}°C) is borderline for ${crop.cropName}.`);
        }
      }
      climateScore = Math.max(10, Math.min(100, climateScore));

      // C. Water Compatibility (0-100)
      let waterScore = 75;
      let criticalWaterFail = false;
      let waterFailReason = '';
      const reqWater = crop.waterRequirementMm || 500;

      if (effectiveIrrigation === 'DRIP') {
        waterScore = 95;
        reasons.push(`High precision drip irrigation guarantees 90% water application efficiency for ${crop.cropName}.`);
      } else if (effectiveIrrigation === 'SPRINKLER') {
        waterScore = 85;
        reasons.push(`Sprinkler system delivers consistent moisture canopy suitable for ${crop.cropName}.`);
      } else if (effectiveIrrigation === 'RAIN_FED') {
        if (reqWater > 700) {
          criticalWaterFail = true;
          waterFailReason = `High-demand crop (${reqWater} mm) cannot be sustained reliably under rain-fed conditions without assured irrigation.`;
          warnings.push(waterFailReason);
          waterScore = 20;
        } else {
          waterScore = 65;
          warnings.push(`Rain-fed cultivation carries yield risks during unexpected dry spells.`);
        }
      } else {
        // Canal / Borewell
        if (reqWater > 1000 && effectiveIrrigation === 'CANAL') {
          waterScore = 85;
          reasons.push(`Canal surface water supply adequately satisfies heavy water demand (${reqWater} mm).`);
        } else {
          waterScore = 75;
        }
      }
      waterScore = Math.max(10, Math.min(100, waterScore));

      // D. Season Compatibility (0-100)
      let seasonScore = 50;
      if (crop.suitableSeasons.includes(effectiveSeason) || crop.suitableSeasons.includes('ALL_SEASON')) {
        seasonScore = 95;
        reasons.push(`Synchronized sowing season: ${effectiveSeason} aligns with standard phenological cycle.`);
      } else {
        seasonScore = 30;
        warnings.push(`${crop.cropName} is not customarily recommended for the ${effectiveSeason} agro-climatic window.`);
      }

      // E. Crop Rotation Evaluation (0-100)
      let rotationScore = 75;
      const prev = effectivePreviousCrop.toLowerCase();
      const candFamily = (crop.botanicalFamily || '').toLowerCase();

      if (prev && prev !== 'none') {
        if (candFamily === 'solanaceae' && (prev.includes('tomato') || prev.includes('potato') || prev.includes('eggplant'))) {
          rotationScore = 35;
          warnings.push(`High disease risk: ${crop.cropName} follows another Solanaceous crop (${effectivePreviousCrop}), elevating fungal wilt and nematode pressure.`);
        } else if (candFamily === 'poaceae' && (prev.includes('rice') || prev.includes('wheat') || prev.includes('maize'))) {
          rotationScore = 60;
          warnings.push(`Continuous cereal sequence (${crop.cropName} after ${effectivePreviousCrop}) depletes identical nutrient strata.`);
        } else if (crop.goodFollowers && crop.goodFollowers.some((f) => prev.includes(f.toLowerCase()))) {
          rotationScore = 95;
          reasons.push(`Documented synergistic rotation following ${effectivePreviousCrop}.`);
        } else {
          rotationScore = 80;
          reasons.push(`Botanical family diversification breaking pest cycles.`);
        }

        if (prev.includes('chickpea') || prev.includes('pulse') || prev.includes('soybean') || prev.includes('groundnut')) {
          if (candFamily === 'poaceae') {
            rotationScore = Math.min(100, rotationScore + 20);
            reasons.push(`Legume-cereal alternation: ${crop.cropName} capitalizes on residual biological nitrogen fixed by ${effectivePreviousCrop}.`);
          }
        }
      }

      // F. Sustainability Scoring (0-100)
      let sustWater = effectiveIrrigation === 'DRIP' ? 95 : effectiveIrrigation === 'SPRINKLER' ? 80 : 60;
      let sustSoil = crop.isNitrogenFixer ? 95 : crop.isDeepRooted ? 85 : 70;
      let sustBio = rotationScore;
      let sustOrg = crop.dataConfidence === 'HIGH' ? 85 : 75;
      let overallSust = Math.round((sustWater * 0.35 + sustSoil * 0.35 + sustBio * 0.2 + sustOrg * 0.1));

      const practiceNotes: string[] = [];
      if (crop.isNitrogenFixer) practiceNotes.push('Enhances soil biological nitrogen reserves, decreasing synthetic urea reliance.');
      if (crop.isDeepRooted) practiceNotes.push('Deep root architecture breaks subsurface hardpan and captures subsoil moisture.');
      if (effectiveIrrigation === 'DRIP') practiceNotes.push('Micro-irrigation achieves 30-40% water savings over flood methods.');

      // Weighted Total Suitability
      // Base weights: Soil 35%, Water 25%, Season 20%, Climate 10%, Rotation 10%
      let wSoil = 0.35;
      let wWater = 0.25;
      let wSeason = 0.20;
      let wClimate = climateMissing ? 0.0 : 0.10;
      let wRotation = 0.10;

      if (params.sustainabilityPreference === 'WATER_CONSERVATION') {
        wWater = 0.35;
        wSoil = 0.25;
      } else if (params.sustainabilityPreference === 'SOIL_HEALTH') {
        wSoil = 0.40;
        wRotation = 0.15;
      }

      const totalWeight = wSoil + wWater + wSeason + wClimate + wRotation;
      const rawScore =
        (soilScore * wSoil +
          waterScore * wWater +
          seasonScore * wSeason +
          climateScore * wClimate +
          rotationScore * wRotation) /
        totalWeight;

      const criticalFailed = criticalSoilFail || criticalClimateFail || criticalWaterFail;
      const failureReason = criticalSoilFail
        ? soilFailReason
        : criticalClimateFail
        ? climateFailReason
        : criticalWaterFail
        ? waterFailReason
        : undefined;

      const finalScore = criticalFailed ? Math.min(35, Math.round(rawScore)) : Math.round(rawScore);

      return {
        cropId: crop.cropId,
        cropName: crop.cropName,
        scientificName: crop.scientificName,
        category: crop.category,
        suitabilityScore: finalScore,
        rank: 0,
        componentScores: {
          soilScore,
          climateScore,
          waterScore,
          seasonScore,
          rotationScore,
        },
        sustainability: {
          overallScore: overallSust,
          waterEfficiencyScore: sustWater,
          soilConservationScore: sustSoil,
          biodiversityScore: sustBio,
          organicCompatibilityScore: sustOrg,
          practiceNotes,
        },
        reasons,
        warnings,
        criticalConstraintFailed: criticalFailed,
        failureReason,
        estimatedWaterNeedMm: crop.waterRequirementMm,
        estimatedDurationDays: crop.growingDurationDaysMax,
        sourceReferences: crop.sourceReferences,
        dataConfidence: crop.dataConfidence,
        dataCompleteness: completeness,
      };
    });

    // Rank candidates
    candidates.sort((a, b) => {
      if (a.criticalConstraintFailed !== b.criticalConstraintFailed) {
        return a.criticalConstraintFailed ? 1 : -1;
      }
      return b.suitabilityScore - a.suitabilityScore;
    });

    candidates.forEach((c, idx) => {
      c.rank = idx + 1;
    });

    const topRecommendations = candidates.filter((c) => !c.criticalConstraintFailed && c.suitabilityScore >= 60).slice(0, 3);
    const otherCandidates = candidates.filter((c) => !topRecommendations.includes(c));

    const recId = 'rec-' + Date.now();
    const result: RecommendationResponse = {
      id: recId,
      farmId: params.farm.id,
      farmName: params.farm.name,
      season: effectiveSeason,
      scoreVersion: '2.0',
      topRecommendations,
      otherCandidates,
      missingDataNotices: missingNotices,
      globalWarnings: [],
      scoreMethodologyExplanation:
        'Overall Suitability is a multi-criteria weighted synthesis: Soil Compatibility (35%), Water Availability (25%), Seasonal Synchronization (20%), Climate Boundaries (10%), and Crop Rotation Synergy (10%). Missing measurements are dynamically re-normalized rather than rewarded.',
      createdAt: new Date().toISOString(),
    };

    // Save snapshot in Firestore
    try {
      const historyItem: RecommendationHistoryItem = {
        id: recId,
        farmId: params.farm.id,
        userId,
        season: effectiveSeason,
        scoreVersion: '2.0',
        soilType: effectiveSoilType,
        phLevel: effectivePh,
        nitrogenLevel: effectiveN,
        phosphorusLevel: effectiveP,
        potassiumLevel: effectiveK,
        temperature: params.temperatureCelsius,
        rainfall: params.rainfallMm,
        irrigationMethod: effectiveIrrigation,
        previousCrop: effectivePreviousCrop,
        createdAt: result.createdAt,
      };
      await setDoc(doc(db, 'recommendations', recId), {
        ...historyItem,
        resultPayload: JSON.stringify(result),
      });
    } catch {
      // Local storage fallback
      try {
        const local = JSON.parse(localStorage.getItem(`recs_${userId}`) || '[]');
        local.unshift(result);
        localStorage.setItem(`recs_${userId}`, JSON.stringify(local.slice(0, 20)));
      } catch {
        // Ignore
      }
    }

    return result;
  },

  async getRecommendationHistory(userId: string): Promise<RecommendationHistoryItem[]> {
    try {
      const q = query(collection(db, 'recommendations'), where('userId', '==', userId));
      const snaps = await getDocs(q);
      const list: RecommendationHistoryItem[] = [];
      snaps.forEach((d) => {
        const data = d.data() as RecommendationHistoryItem;
        list.push(data);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'recommendations');
      try {
        const local = JSON.parse(localStorage.getItem(`recs_${userId}`) || '[]');
        return local.map((r: RecommendationResponse) => ({
          id: r.id,
          farmId: r.farmId,
          userId,
          season: r.season,
          scoreVersion: r.scoreVersion,
          createdAt: r.createdAt,
        }));
      } catch {
        return [];
      }
    }
  },

  async getRecommendationById(id: string): Promise<RecommendationResponse | null> {
    try {
      const snap = await getDoc(doc(db, 'recommendations', id));
      if (snap.exists()) {
        const data = snap.data();
        if (data.resultPayload) {
          return JSON.parse(data.resultPayload);
        }
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async deleteRecommendation(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'recommendations', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `recommendations/${id}`);
    }
  },
};
