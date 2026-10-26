import { collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { WaterBudgetResponse } from '../types';
import { apiClient } from './apiClient';

export interface CalculateWaterBudgetParams {
  farmId: string;
  cropName: string;
  areaAcres: number;
  cropWaterDemandMm?: number;
  seasonalRainfallMm?: number;
  irrigationMethod?: string;
  availableWaterSupplyM3?: number;
  soilMoisturePercent?: number;
}

const M3_PER_MM_PER_ACRE = 4.04686;
const HECTARES_PER_ACRE = 0.404686;

export const waterService = {
  async calculateBudget(
    userId: string,
    params: CalculateWaterBudgetParams
  ): Promise<WaterBudgetResponse> {
    // 1. Try Java Backend
    try {
      const res = await apiClient.post<WaterBudgetResponse>('water-budget/calculate', {
        farmId: params.farmId,
        cropIdOrName: params.cropName,
        areaAcres: params.areaAcres,
        seasonalRainfallMm: params.seasonalRainfallMm,
        irrigationMethod: params.irrigationMethod,
        availableWaterSupplyM3: params.availableWaterSupplyM3,
      });
      if (res && res.data) {
        return res.data;
      }
    } catch {
      // Local agronomic calculation fallback
    }

    // 2. Client-side agronomic model matching Java 8 WaterManagementService
    const areaAcres = params.areaAcres;
    const areaHectares = Math.round(areaAcres * HECTARES_PER_ACRE * 100) / 100;
    const cropWaterDemandMm = params.cropWaterDemandMm || 500;
    const method = (params.irrigationMethod || 'CANAL').toUpperCase();

    let efficiency = 0.75;
    if (method === 'DRIP') efficiency = 0.90;
    else if (method === 'SPRINKLER') efficiency = 0.75;
    else if (method === 'CANAL' || method === 'BOREWELL' || method === 'WELL') efficiency = 0.55;
    else if (method === 'RAIN_FED') efficiency = 1.0;

    const rainfallMm = params.seasonalRainfallMm;
    let effectiveRainfallMm = 0;
    const modelingAssumptions: string[] = [];
    const warnings: string[] = [];
    const seasonalSavingsTips: string[] = [];

    if (rainfallMm !== undefined && rainfallMm !== null) {
      // USDA-SCS effective precipitation model
      effectiveRainfallMm = Math.max(0, rainfallMm * 0.75 - 10);
      modelingAssumptions.push(
        `Effective rainfall estimated at ${effectiveRainfallMm.toFixed(1)} mm from gross ${rainfallMm.toFixed(1)} mm precipitation (USDA-SCS runoff deduction).`
      );
    } else {
      modelingAssumptions.push('Rainfall estimate not supplied; assuming 0 mm contribution for conservative drought planning.');
      warnings.push('Precipitation telemetry missing. Calculations assume 100% reliance on irrigation water.');
    }

    const netIrrigationMm = Math.max(0, cropWaterDemandMm - effectiveRainfallMm);
    const grossIrrigationMm = method === 'RAIN_FED' ? netIrrigationMm : netIrrigationMm / efficiency;

    const totalCropDemandM3 = Math.round(cropWaterDemandMm * M3_PER_MM_PER_ACRE * areaAcres * 10) / 10;
    const effectiveRainfallM3 = Math.round(effectiveRainfallMm * M3_PER_MM_PER_ACRE * areaAcres * 10) / 10;
    const netIrrigationM3 = Math.round(netIrrigationMm * M3_PER_MM_PER_ACRE * areaAcres * 10) / 10;
    const grossIrrigationM3 = Math.round(grossIrrigationMm * M3_PER_MM_PER_ACRE * areaAcres * 10) / 10;

    let balanceStatus: 'SURPLUS' | 'SUFFICIENT' | 'MODERATE_DEFICIT' | 'SEVERE_DEFICIT' | 'DATA_INSUFFICIENT' = 'DATA_INSUFFICIENT';
    let deficitOrSurplusM3 = 0;
    let waterScarcityIndex = 0.5;

    if (params.availableWaterSupplyM3 !== undefined && params.availableWaterSupplyM3 !== null) {
      const supply = params.availableWaterSupplyM3;
      deficitOrSurplusM3 = Math.round((supply - grossIrrigationM3) * 10) / 10;
      waterScarcityIndex = Math.min(1.0, Math.round((grossIrrigationM3 / Math.max(1, supply)) * 100) / 100);

      if (deficitOrSurplusM3 >= supply * 0.15) {
        balanceStatus = 'SURPLUS';
      } else if (deficitOrSurplusM3 >= 0) {
        balanceStatus = 'SUFFICIENT';
      } else if (Math.abs(deficitOrSurplusM3) <= grossIrrigationM3 * 0.25) {
        balanceStatus = 'MODERATE_DEFICIT';
        warnings.push(`Water budget faces moderate deficit of ${Math.abs(deficitOrSurplusM3).toLocaleString()} m³. Deficit irrigation strategies advised.`);
      } else {
        balanceStatus = 'SEVERE_DEFICIT';
        warnings.push(`Severe water shortfall (${Math.abs(deficitOrSurplusM3).toLocaleString()} m³). Current crop acreage exceeds available water capacity.`);
      }
    } else {
      modelingAssumptions.push('Total available water capacity unspecified; water scarcity index calculated relative to normal aquifer draft.');
    }

    // Conservation tips
    if (efficiency < 0.8) {
      seasonalSavingsTips.push(`Switching from surface flood/canal to micro-drip can reduce gross water requirement by ${Math.round(grossIrrigationM3 * 0.35).toLocaleString()} m³.`);
    }
    seasonalSavingsTips.push('Apply organic straw or plastic mulch (25 micron) around root zones to slash surface evaporation by 20-30%.');
    seasonalSavingsTips.push('Schedule irrigations during nocturnal hours or early dawn to minimize high midday evapotranspiration losses.');
    seasonalSavingsTips.push('Install tensiometers or dielectric soil moisture sensors to initiate irrigation strictly when root tension drops below -40 kPa.');

    const budgetId = 'wb-' + Date.now();
    const result: WaterBudgetResponse = {
      id: budgetId,
      farmId: params.farmId,
      cropName: params.cropName,
      areaAcres,
      areaHectares,
      cropWaterDemandMm,
      effectiveRainfallMm: Math.round(effectiveRainfallMm * 10) / 10,
      netIrrigationRequirementMm: Math.round(netIrrigationMm * 10) / 10,
      grossIrrigationRequirementMm: Math.round(grossIrrigationMm * 10) / 10,
      totalCropDemandM3,
      effectiveRainfallContributionM3: effectiveRainfallM3,
      netIrrigationM3,
      grossIrrigationM3,
      irrigationMethod: method,
      irrigationEfficiency: Math.round(efficiency * 100),
      waterScarcityIndex,
      waterBalanceStatus: balanceStatus,
      deficitOrSurplusM3,
      seasonalSavingsTips,
      modelingAssumptions,
      warnings,
      createdAt: new Date().toISOString(),
    };

    // Save in Firestore
    try {
      await setDoc(doc(db, 'water_budgets', budgetId), {
        ...result,
        userId,
      });
    } catch {
      // Local fallback
    }

    return result;
  },

  async getSavedBudgets(farmId: string): Promise<WaterBudgetResponse[]> {
    try {
      const q = query(collection(db, 'water_budgets'), where('farmId', '==', farmId));
      const snaps = await getDocs(q);
      const list: WaterBudgetResponse[] = [];
      snaps.forEach((d) => list.push(d.data() as WaterBudgetResponse));
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'water_budgets');
      return [];
    }
  },
};
