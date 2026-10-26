package com.agrosmart.service;

import com.agrosmart.model.Crop;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClimateCompatibilityService {

    public static class Evaluation {
        private final int score;
        private final boolean criticalFailure;
        private final String failureReason;
        private final boolean missingData;
        private final List<String> reasons = new ArrayList<String>();
        private final List<String> warnings = new ArrayList<String>();

        public Evaluation(int score, boolean criticalFailure, String failureReason, boolean missingData) {
            this.score = score;
            this.criticalFailure = criticalFailure;
            this.failureReason = failureReason;
            this.missingData = missingData;
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

        public boolean isMissingData() {
            return missingData;
        }

        public List<String> getReasons() {
            return reasons;
        }

        public List<String> getWarnings() {
            return warnings;
        }
    }

    public Evaluation evaluate(Crop crop, Double temperature, Double rainfall) {
        if (crop == null) {
            return new Evaluation(0, true, "Crop not found", true);
        }

        double score = 0.0;
        boolean criticalFail = false;
        String failReason = null;
        boolean isMissing = false;

        List<String> reasons = new ArrayList<String>();
        List<String> warnings = new ArrayList<String>();

        // Temperature (50 points)
        if (temperature != null) {
            double minT = crop.getMinTemperatureCelsius();
            double maxT = crop.getMaxTemperatureCelsius();

            if (temperature >= minT && temperature <= maxT) {
                score += 50.0;
                reasons.add(String.format("Expected seasonal temperature (%.1f°C) is ideal for %s vegetative development (%.0f - %.0f°C).", temperature, crop.getCropName(), minT, maxT));
            } else if (temperature >= minT - 4.0 && temperature <= maxT + 4.0) {
                score += 30.0;
                warnings.add(String.format("Temperature (%.1f°C) is close to boundary conditions for %s (%.0f - %.0f°C).", temperature, crop.getCropName(), minT, maxT));
            } else {
                score += 10.0;
                if (temperature < minT - 8.0 || temperature > maxT + 8.0) {
                    criticalFail = true;
                    failReason = String.format("Temperature (%.1f°C) is beyond physiological tolerance for %s.", temperature, crop.getCropName());
                }
                warnings.add(String.format("Severe thermal divergence from %s range (%.0f - %.0f°C).", crop.getCropName(), minT, maxT));
            }
        } else {
            score += 30.0; // Uncertainty adjustment
            isMissing = true;
            warnings.add("Ambient temperature estimate unavailable. Climate model relies on broad seasonal averages.");
        }

        // Rainfall (50 points)
        if (rainfall != null) {
            double minR = crop.getMinRainfallMm();
            double maxR = crop.getMaxRainfallMm();

            if (rainfall >= minR && rainfall <= maxR) {
                score += 50.0;
                reasons.add(String.format("Seasonal rainfall estimate (%.0f mm) aligns with crop precipitation demands.", rainfall));
            } else if (rainfall >= minR * 0.7 && rainfall <= maxR * 1.3) {
                score += 35.0;
                reasons.add(String.format("Rainfall (%.0f mm) is moderately suitable with supplemental irrigation management.", rainfall));
            } else {
                score += 15.0;
                warnings.add(String.format("Rainfall expectation (%.0f mm) diverges from standard crop range (%.0f - %.0f mm).", rainfall, minR, maxR));
            }
        } else {
            score += 30.0;
            isMissing = true;
            warnings.add("Precipitation telemetry is missing. Evaluation assumes adequate supplemental watering.");
        }

        int finalScore = (int) Math.min(100, Math.max(0, Math.round(score)));
        Evaluation eval = new Evaluation(finalScore, criticalFail, failReason, isMissing);
        eval.getReasons().addAll(reasons);
        eval.getWarnings().addAll(warnings);
        return eval;
    }
}
