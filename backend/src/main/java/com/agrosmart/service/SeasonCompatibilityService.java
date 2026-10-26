package com.agrosmart.service;

import com.agrosmart.model.Crop;
import com.agrosmart.model.CropSeason;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SeasonCompatibilityService {

    public static class Evaluation {
        private final int score;
        private final boolean criticalFailure;
        private final String failureReason;
        private final List<String> reasons = new ArrayList<String>();
        private final List<String> warnings = new ArrayList<String>();

        public Evaluation(int score, boolean criticalFailure, String failureReason) {
            this.score = score;
            this.criticalFailure = criticalFailure;
            this.failureReason = failureReason;
        }

        public int getScore() {
            return score;
        }

        public boolean isCriticalFailure() {
            return criticalFailure;
        }

        public String getFailureReason() {
            return failureReason;
        }

        public List<String> getReasons() {
            return reasons;
        }

        public List<String> getWarnings() {
            return warnings;
        }
    }

    public Evaluation evaluate(Crop crop, String seasonStr) {
        if (crop == null) {
            return new Evaluation(0, true, "Crop not found");
        }

        List<String> reasons = new ArrayList<String>();
        List<String> warnings = new ArrayList<String>();

        if (seasonStr == null || seasonStr.isEmpty() || "ALL_SEASON".equalsIgnoreCase(seasonStr)) {
            Evaluation eval = new Evaluation(85, false, null);
            eval.getReasons().add("Evaluation conducted on multi-season baseline.");
            return eval;
        }

        CropSeason targetSeason;
        try {
            targetSeason = CropSeason.valueOf(seasonStr.toUpperCase());
        } catch (Exception e) {
            targetSeason = CropSeason.KHARIF;
        }

        List<CropSeason> suitable = crop.getSuitableSeasons();
        if (suitable != null && (suitable.contains(targetSeason) || suitable.contains(CropSeason.ALL_SEASON) || suitable.contains(CropSeason.PERENNIAL))) {
            Evaluation eval = new Evaluation(100, false, null);
            eval.getReasons().add(String.format("Cultivar is naturally timed and photoperiodically synchronized with the %s growing cycle.", targetSeason.name()));
            return eval;
        }

        // Season mismatch
        Evaluation eval = new Evaluation(30, false, null);
        eval.getWarnings().add(String.format("Cultivar suitable seasons (%s) do not traditionally coincide with the requested %s cycle.", suitable != null ? suitable.toString() : "None", targetSeason.name()));
        return eval;
    }
}
