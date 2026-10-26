package com.agrosmart.service;

import com.agrosmart.model.Crop;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WaterCompatibilityService {

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

    public Evaluation evaluate(Crop crop, String irrigationMethod, Double rainfallMm) {
        if (crop == null) {
            return new Evaluation(0, true, "Crop record missing");
        }

        double score = 70.0;
        boolean criticalFail = false;
        String failReason = null;
        List<String> reasons = new ArrayList<String>();
        List<String> warnings = new ArrayList<String>();

        double waterNeed = crop.getWaterRequirementMm() != null ? crop.getWaterRequirementMm() : 500.0;
        String method = irrigationMethod != null ? irrigationMethod.toUpperCase() : "RAIN_FED";

        // Rain-fed evaluation
        if ("RAIN_FED".equals(method)) {
            if (waterNeed >= 900.0) {
                // High water demand crops like wetland rice cannot thrive on rain-fed without massive rainfall
                if (rainfallMm == null || rainfallMm < 900.0) {
                    criticalFail = true;
                    failReason = String.format("%s requires very high seasonal water (%.0f mm); cannot be cultivated reliably under purely rain-fed conditions.", crop.getCropName(), waterNeed);
                    warnings.add(failReason);
                    score = 15.0;
                } else {
                    score = 75.0;
                    reasons.add(String.format("Abundant monsoon rainfall (%.0f mm) supports high water needs of %s.", rainfallMm, crop.getCropName()));
                }
            } else if (waterNeed <= 400.0) {
                score = 88.0;
                reasons.add(String.format("%s is a low-water requirement cultivar (%.0f mm), making it well-suited for rain-fed agriculture.", crop.getCropName(), waterNeed));
            } else {
                score = 65.0;
                warnings.add(String.format("Rain-fed cultivation of %s (requires %.0f mm) entails drought risk during prolonged dry spells.", crop.getCropName(), waterNeed));
            }
        } else if ("DRIP".equals(method)) {
            score = 95.0;
            reasons.add(String.format("Micro-drip irrigation delivers 85-95%% water application efficiency, ideal for managing %s (%.0f mm).", crop.getCropName(), waterNeed));
        } else if ("SPRINKLER".equals(method)) {
            score = 88.0;
            reasons.add(String.format("Sprinkler irrigation provides balanced uniform soil wetting for %s.", crop.getCropName()));
        } else if ("CANAL".equals(method) || "BOREWELL".equals(method) || "WELL".equals(method)) {
            score = 82.0;
            reasons.add(String.format("Secured %s irrigation source can fulfill the seasonal %.0f mm requirement.", method.toLowerCase(), waterNeed));
        }

        int finalScore = (int) Math.min(100, Math.max(0, Math.round(score)));
        Evaluation eval = new Evaluation(finalScore, criticalFail, failReason);
        eval.getReasons().addAll(reasons);
        eval.getWarnings().addAll(warnings);
        return eval;
    }
}
