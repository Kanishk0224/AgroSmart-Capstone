package com.agrosmart.service;

import com.agrosmart.dto.CropHistoryRequest;
import com.agrosmart.dto.CropHistoryResponse;
import com.agrosmart.exception.ResourceNotFoundException;
import com.agrosmart.exception.UnauthorizedException;
import com.agrosmart.model.Crop;
import com.agrosmart.model.CropHistory;
import com.agrosmart.repository.CropHistoryRepository;
import com.agrosmart.repository.FarmRepository;
import com.agrosmart.util.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CropRotationService {

    private final CropHistoryRepository historyRepository;
    private final FarmRepository farmRepository;

    public static class RotationEvaluation {
        private final int score; // 0 - 100
        private final List<String> reasons = new ArrayList<String>();
        private final List<String> warnings = new ArrayList<String>();
        private final String previousCropFamily;

        public RotationEvaluation(int score, String previousCropFamily) {
            this.score = score;
            this.previousCropFamily = previousCropFamily;
        }

        public int getScore() {
            return score;
        }

        public List<String> getReasons() {
            return reasons;
        }

        public List<String> getWarnings() {
            return warnings;
        }

        public String getPreviousCropFamily() {
            return previousCropFamily;
        }
    }

    @Autowired
    public CropRotationService(CropHistoryRepository historyRepository, FarmRepository farmRepository) {
        this.historyRepository = historyRepository;
        this.farmRepository = farmRepository;
    }

    public RotationEvaluation evaluateRotation(Crop candidate, String previousCropName) {
        if (candidate == null) {
            return new RotationEvaluation(70, "Unknown");
        }

        if (previousCropName == null || previousCropName.trim().isEmpty() || "None".equalsIgnoreCase(previousCropName)) {
            RotationEvaluation eval = new RotationEvaluation(75, "None");
            eval.getReasons().add("No immediate preceding crop recorded; rotation score based on baseline cultivar diversification.");
            return eval;
        }

        String prev = previousCropName.toLowerCase();
        String candidateFamily = candidate.getBotanicalFamily() != null ? candidate.getBotanicalFamily() : "";
        int score = 75;
        List<String> reasons = new ArrayList<String>();
        List<String> warnings = new ArrayList<String>();

        // 1. Same botanical family check (Disease/Nematode buildup)
        if ("solanaceae".equalsIgnoreCase(candidateFamily) && (prev.contains("tomato") || prev.contains("potato") || prev.contains("eggplant") || prev.contains("brinjal") || prev.contains("chilli"))) {
            score = 35;
            warnings.add(String.format("High Risk: %s follows another Solanaceous crop (%s). Successive cultivation elevates fungal wilt and root-knot nematode pressure.", candidate.getCropName(), previousCropName));
        } else if ("poaceae".equalsIgnoreCase(candidateFamily) && (prev.contains("rice") || prev.contains("wheat") || prev.contains("maize") || prev.contains("sorghum"))) {
            score = 60;
            warnings.add(String.format("Continuous cereal cultivation (%s after %s) depletes identical soil nutrient strata and favors stem-borer cycles.", candidate.getCropName(), previousCropName));
        } else if (candidate.getGoodFollowers() != null && candidate.getGoodFollowers().stream().anyMatch(f -> prev.contains(f.toLowerCase()))) {
            score = 95;
            reasons.add(String.format("Optimal Rotation: Documented synergic rotation sequence following %s.", previousCropName));
        } else {
            score = 80;
            reasons.add(String.format("Cultivating %s after %s offers beneficial botanical family diversification.", candidate.getCropName(), previousCropName));
        }

        // 2. Legume credit
        if (prev.contains("chickpea") || prev.contains("gram") || prev.contains("soybean") || prev.contains("mung") || prev.contains("pulse") || prev.contains("pea") || prev.contains("groundnut")) {
            if ("Poaceae".equalsIgnoreCase(candidateFamily)) {
                score = Math.min(100, score + 20);
                reasons.add(String.format("Legume-cereal alternation: %s capitalizes on residual fixed biological nitrogen from preceding %s.", candidate.getCropName(), previousCropName));
            }
        }

        RotationEvaluation eval = new RotationEvaluation(score, candidateFamily);
        eval.getReasons().addAll(reasons);
        eval.getWarnings().addAll(warnings);
        return eval;
    }

    // Crop History CRUD for Farm
    public List<CropHistoryResponse> getHistoryForFarm(String farmId, String userId) {
        verifyFarmOwnership(farmId, userId);
        List<CropHistory> list = historyRepository.findByFarmId(farmId);
        List<CropHistoryResponse> responses = new ArrayList<CropHistoryResponse>();
        for (CropHistory h : list) {
            responses.add(CropHistoryResponse.fromModel(h));
        }
        return responses;
    }

    public CropHistoryResponse addHistory(String farmId, CropHistoryRequest request, String userId) {
        verifyFarmOwnership(farmId, userId);
        String id = "hist-" + UUID.randomUUID().toString().substring(0, 8);
        String now = DateUtils.nowIso();

        CropHistory history = new CropHistory(
                id,
                farmId,
                userId,
                request.getCropName().trim(),
                request.getBotanicalFamily() != null ? request.getBotanicalFamily().trim() : "",
                request.getSeason().trim(),
                request.getSowingDate(),
                request.getHarvestDate(),
                request.getAreaPlantedAcres(),
                request.getYieldMetricTons(),
                request.getNotes() != null ? request.getNotes().trim() : "",
                now,
                now
        );

        CropHistory saved = historyRepository.save(history);
        return CropHistoryResponse.fromModel(saved);
    }

    public CropHistoryResponse updateHistory(String historyId, CropHistoryRequest request, String userId) {
        CropHistory existing = historyRepository.findById(historyId);
        if (existing == null) {
            throw new ResourceNotFoundException("Crop history record not found: " + historyId);
        }
        if (!userId.equals(existing.getUserId())) {
            throw new UnauthorizedException("Unauthorized to modify this crop history record");
        }

        existing.setCropName(request.getCropName().trim());
        if (request.getBotanicalFamily() != null) existing.setBotanicalFamily(request.getBotanicalFamily().trim());
        existing.setSeason(request.getSeason().trim());
        existing.setSowingDate(request.getSowingDate());
        existing.setHarvestDate(request.getHarvestDate());
        existing.setAreaPlantedAcres(request.getAreaPlantedAcres());
        existing.setYieldMetricTons(request.getYieldMetricTons());
        if (request.getNotes() != null) existing.setNotes(request.getNotes().trim());
        existing.setUpdatedAt(DateUtils.nowIso());

        CropHistory saved = historyRepository.save(existing);
        return CropHistoryResponse.fromModel(saved);
    }

    public void deleteHistory(String historyId, String userId) {
        CropHistory existing = historyRepository.findById(historyId);
        if (existing == null) {
            throw new ResourceNotFoundException("Crop history record not found: " + historyId);
        }
        if (!userId.equals(existing.getUserId())) {
            throw new UnauthorizedException("Unauthorized to delete this crop history record");
        }
        historyRepository.deleteById(historyId);
    }

    private void verifyFarmOwnership(String farmId, String userId) {
        com.agrosmart.model.Farm farm = farmRepository.findById(farmId);
        if (farm == null) {
            throw new ResourceNotFoundException("Farm not found: " + farmId);
        }
        if (!userId.equals(farm.getUserId())) {
            throw new UnauthorizedException("You do not have access to this farm parcel");
        }
    }
}
