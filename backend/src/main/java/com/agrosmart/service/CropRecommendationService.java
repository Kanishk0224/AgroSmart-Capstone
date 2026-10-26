package com.agrosmart.service;

import com.agrosmart.dto.*;
import com.agrosmart.exception.ResourceNotFoundException;
import com.agrosmart.exception.UnauthorizedException;
import com.agrosmart.model.*;
import com.agrosmart.repository.CropRecommendationRepository;
import com.agrosmart.repository.FarmRepository;
import com.agrosmart.repository.SoilTestRepository;
import com.agrosmart.util.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CropRecommendationService {

    private final CropDataService cropDataService;
    private final SoilCompatibilityService soilService;
    private final ClimateCompatibilityService climateService;
    private final WaterCompatibilityService waterService;
    private final SeasonCompatibilityService seasonService;
    private final CropRotationService rotationService;
    private final SustainabilityService sustainabilityService;
    private final RecommendationRankingService rankingService;
    private final FarmRepository farmRepository;
    private final SoilTestRepository soilTestRepository;
    private final CropRecommendationRepository recommendationRepository;
    private final MachineLearningRecommendationClient mlClient;

    @Autowired
    public CropRecommendationService(
            CropDataService cropDataService,
            SoilCompatibilityService soilService,
            ClimateCompatibilityService climateService,
            WaterCompatibilityService waterService,
            SeasonCompatibilityService seasonService,
            CropRotationService rotationService,
            SustainabilityService sustainabilityService,
            RecommendationRankingService rankingService,
            FarmRepository farmRepository,
            SoilTestRepository soilTestRepository,
            CropRecommendationRepository recommendationRepository,
            @Autowired(required = false) MachineLearningRecommendationClient mlClient) {
        this.cropDataService = cropDataService;
        this.soilService = soilService;
        this.climateService = climateService;
        this.waterService = waterService;
        this.seasonService = seasonService;
        this.rotationService = rotationService;
        this.sustainabilityService = sustainabilityService;
        this.rankingService = rankingService;
        this.farmRepository = farmRepository;
        this.soilTestRepository = soilTestRepository;
        this.recommendationRepository = recommendationRepository;
        this.mlClient = mlClient;
    }

    public RecommendationResponse generateRecommendations(RecommendationRequest request, String userId) {
        // 1. Verify Farm Ownership
        Farm farm = farmRepository.findById(request.getFarmId());
        if (farm == null) {
            throw new ResourceNotFoundException("Farm parcel not found: " + request.getFarmId());
        }
        if (!userId.equals(farm.getUserId())) {
            throw new UnauthorizedException("Unauthorized access to farm parcel");
        }

        // 2. Resolve Soil Data: request inputs take precedence, otherwise auto-fill from soilTest
        String effectiveSoilType = request.getSoilType() != null ? request.getSoilType() : farm.getSoilType();
        Double effectivePh = request.getPhLevel();
        Double effectiveN = request.getNitrogenLevel();
        Double effectiveP = request.getPhosphorusLevel();
        Double effectiveK = request.getPotassiumLevel();

        if (effectivePh == null && request.getSoilTestId() != null) {
            SoilTest test = soilTestRepository.findById(request.getSoilTestId());
            if (test != null && userId.equals(test.getUserId())) {
                effectivePh = test.getPhLevel();
                effectiveN = test.getNitrogenLevel();
                effectiveP = test.getPhosphorusLevel();
                effectiveK = test.getPotassiumLevel();
            }
        }

        // 3. Resolve irrigation method and previous crop
        String effectiveIrrigation = request.getIrrigationMethod() != null ? request.getIrrigationMethod() : farm.getIrrigationSource();
        String effectivePreviousCrop = request.getPreviousCrop();

        // Check if climate is missing
        boolean climateMissing = (request.getTemperatureCelsius() == null && request.getRainfallMm() == null);
        List<String> missingNotices = new ArrayList<String>();
        if (effectivePh == null) missingNotices.add("Laboratory soil pH assay missing; using generic assumption.");
        if (effectiveN == null) missingNotices.add("Soil available macronutrients (N-P-K) missing.");
        if (request.getTemperatureCelsius() == null) missingNotices.add("Ambient temperature estimate missing.");
        if (request.getRainfallMm() == null) missingNotices.add("Seasonal rainfall estimate missing.");

        String completeness = "COMPLETE";
        if (missingNotices.size() >= 3) completeness = "MINIMAL";
        else if (missingNotices.size() > 0) completeness = "PARTIAL";

        List<Crop> catalog = cropDataService.getAllCrops();
        List<CropRecommendationDto> candidates = new ArrayList<CropRecommendationDto>();

        for (Crop crop : catalog) {
            SoilCompatibilityService.Evaluation soilEval = soilService.evaluate(
                    crop, effectiveSoilType, effectivePh, effectiveN, effectiveP, effectiveK
            );
            ClimateCompatibilityService.Evaluation climateEval = climateService.evaluate(
                    crop, request.getTemperatureCelsius(), request.getRainfallMm()
            );
            WaterCompatibilityService.Evaluation waterEval = waterService.evaluate(
                    crop, effectiveIrrigation, request.getRainfallMm()
            );
            SeasonCompatibilityService.Evaluation seasonEval = seasonService.evaluate(
                    crop, request.getSeason()
            );
            CropRotationService.RotationEvaluation rotationEval = rotationService.evaluateRotation(
                    crop, effectivePreviousCrop
            );
            SustainabilityScoreDto sustainability = sustainabilityService.calculateSustainability(
                    crop, effectiveIrrigation, effectivePreviousCrop
            );

            CropRecommendationDto dto = new CropRecommendationDto();
            dto.setCropId(crop.getCropId());
            dto.setCropName(crop.getCropName());
            dto.setScientificName(crop.getScientificName());
            dto.setCategory(crop.getCategory().name());
            dto.setEstimatedWaterNeedMm(crop.getWaterRequirementMm());
            dto.setEstimatedDurationDays(crop.getGrowingDurationDaysMax());
            dto.setSourceReferences(crop.getSourceReferences());
            dto.setDataConfidence(crop.getDataConfidence());
            dto.setDataCompleteness(completeness);

            ComponentScoresDto cs = new ComponentScoresDto(
                    soilEval.getScore(),
                    climateEval.getScore(),
                    waterEval.getScore(),
                    seasonEval.getScore(),
                    rotationEval.getScore()
            );
            dto.setComponentScores(cs);
            dto.setSustainability(sustainability);

            // Consolidate reasons
            List<String> allReasons = new ArrayList<String>();
            allReasons.addAll(soilEval.getReasons());
            allReasons.addAll(climateEval.getReasons());
            allReasons.addAll(waterEval.getReasons());
            allReasons.addAll(seasonEval.getReasons());
            allReasons.addAll(rotationEval.getReasons());
            dto.setReasons(allReasons);

            // Consolidate warnings
            List<String> allWarnings = new ArrayList<String>();
            allWarnings.addAll(soilEval.getWarnings());
            allWarnings.addAll(climateEval.getWarnings());
            allWarnings.addAll(waterEval.getWarnings());
            allWarnings.addAll(seasonEval.getWarnings());
            allWarnings.addAll(rotationEval.getWarnings());
            dto.setWarnings(allWarnings);

            // Critical constraint checking
            boolean critical = soilEval.isCriticalFailure() || climateEval.isCriticalFailure() || waterEval.isCriticalFailure();
            dto.setCriticalConstraintFailed(critical);
            if (critical) {
                String fReason = soilEval.isCriticalFailure() ? soilEval.getFailureReason() :
                                 climateEval.isCriticalFailure() ? climateEval.getFailureReason() :
                                 waterEval.getFailureReason();
                dto.setFailureReason(fReason);
            }

            candidates.add(dto);
        }

        // Rank candidates with dynamic weight normalization
        rankingService.rankAndScore(candidates, request.getSustainabilityPreference(), climateMissing);

        List<CropRecommendationDto> top = new ArrayList<CropRecommendationDto>();
        List<CropRecommendationDto> others = new ArrayList<CropRecommendationDto>();

        for (CropRecommendationDto c : candidates) {
            if (!c.isCriticalConstraintFailed() && c.getSuitabilityScore() >= 60 && top.size() < 3) {
                top.add(c);
            } else {
                others.add(c);
            }
        }

        String recId = "rec-" + UUID.randomUUID().toString().substring(0, 8);
        String now = DateUtils.nowIso();

        RecommendationResponse response = new RecommendationResponse();
        response.setId(recId);
        response.setFarmId(farm.getId());
        response.setFarmName(farm.getName());
        response.setSeason(request.getSeason() != null ? request.getSeason() : "KHARIF");
        response.setScoreVersion("3.0");
        response.setTopRecommendations(top);
        response.setOtherCandidates(others);
        response.setMissingDataNotices(missingNotices);
        response.setGlobalWarnings(new ArrayList<String>());
        response.setCreatedAt(now);
        response.setScoreMethodologyExplanation(
                "Overall Suitability is a multi-criteria weighted synthesis: Soil Compatibility (35%), Water Availability (25%), Seasonal Synchronization (20%), Climate Boundaries (10%), and Crop Rotation Synergy (10%). Missing measurements are dynamically re-normalized rather than rewarded."
        );

        // Optional ML Prediction & Ensemble Conflict Evaluation
        if (mlClient != null) {
            try {
                double nVal = effectiveN != null ? effectiveN : 80.0;
                double pVal = effectiveP != null ? effectiveP : 45.0;
                double kVal = effectiveK != null ? effectiveK : 40.0;
                double phVal = effectivePh != null ? effectivePh : 6.8;
                double tempVal = request.getTemperatureCelsius() != null ? request.getTemperatureCelsius() : 25.0;
                double rainVal = request.getRainfallMm() != null ? request.getRainfallMm() : 600.0;

                MlPredictionRequest mlReq = new MlPredictionRequest(nVal, pVal, kVal, tempVal, 68.0, phVal, rainVal);
                MlPredictionResponse mlResp = mlClient.predictCrop(mlReq);
                response.setMlPrediction(mlResp);

                if (mlResp != null && mlResp.isAvailable() && mlResp.getPredictedCrop() != null) {
                    String mlCrop = mlResp.getPredictedCrop().toLowerCase();
                    // Check if ML predicted a candidate that failed critical physiological rules
                    for (CropRecommendationDto cand : candidates) {
                        if (cand.getCropName().toLowerCase().contains(mlCrop) || mlCrop.contains(cand.getCropName().toLowerCase())) {
                            if (cand.isCriticalConstraintFailed()) {
                                String conflictNotice = String.format(
                                        "Ensemble Conflict Alert: ML model classified '%s' with %.1f%% confidence, but agricultural constraint check flagged: %s. Rule-based safeguard takes precedence.",
                                        mlResp.getPredictedCrop(), mlResp.getConfidence() * 100.0, cand.getFailureReason()
                                );
                                response.setMlConflictNotice(conflictNotice);
                                response.getGlobalWarnings().add(conflictNotice);
                            }
                            break;
                        }
                    }
                }
            } catch (Exception e) {
                // Non-blocking fallback
                response.setMlPrediction(MlPredictionResponse.unavailable("ML service communication deferred"));
            }
        }

        // Snapshot persistence
        try {
            CropRecommendation entity = new CropRecommendation();
            entity.setId(recId);
            entity.setFarmId(farm.getId());
            entity.setUserId(userId);
            entity.setSeason(response.getSeason());
            entity.setScoreVersion("2.0");
            entity.setCreatedAt(now);
            entity.setSoilType(effectiveSoilType);
            entity.setPhLevel(effectivePh);
            entity.setNitrogenLevel(effectiveN);
            entity.setPhosphorusLevel(effectiveP);
            entity.setPotassiumLevel(effectiveK);
            entity.setTemperature(request.getTemperatureCelsius());
            entity.setRainfall(request.getRainfallMm());
            entity.setIrrigationMethod(effectiveIrrigation);
            entity.setPreviousCrop(effectivePreviousCrop);
            recommendationRepository.save(entity);
        } catch (Exception e) {
            // Non-blocking snapshot save
        }

        return response;
    }

    public List<CropRecommendation> getSavedRecommendations(String userId) {
        return recommendationRepository.findByUserId(userId);
    }

    public CropRecommendation getSavedRecommendationById(String recId, String userId) {
        CropRecommendation rec = recommendationRepository.findById(recId);
        if (rec == null) throw new ResourceNotFoundException("Recommendation snapshot not found: " + recId);
        if (!userId.equals(rec.getUserId())) throw new UnauthorizedException("Unauthorized access to recommendation record");
        return rec;
    }

    public void deleteSavedRecommendation(String recId, String userId) {
        CropRecommendation rec = recommendationRepository.findById(recId);
        if (rec == null) throw new ResourceNotFoundException("Recommendation snapshot not found: " + recId);
        if (!userId.equals(rec.getUserId())) throw new UnauthorizedException("Unauthorized access to recommendation record");
        recommendationRepository.deleteById(recId);
    }
}
