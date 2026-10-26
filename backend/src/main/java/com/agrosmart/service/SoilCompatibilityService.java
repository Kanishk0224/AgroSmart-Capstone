package com.agrosmart.service;

import com.agrosmart.model.Crop;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SoilCompatibilityService {

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

    public Evaluation evaluate(Crop crop, String farmSoilType, Double phLevel, Double nitrogen, Double phosphorus, Double potassium) {
        if (crop == null) {
            return new Evaluation(0, true, "Crop record unavailable");
        }

        double totalScore = 0.0;
        double maxPossible = 100.0;
        boolean criticalFail = false;
        String failReason = null;

        List<String> reasons = new ArrayList<String>();
        List<String> warnings = new ArrayList<String>();

        // 1. pH Evaluation (Weight: 40 points)
        if (phLevel != null) {
            double minPh = crop.getMinimumSuitablePH();
            double maxPh = crop.getMaximumSuitablePH();

            if (phLevel >= minPh && phLevel <= maxPh) {
                totalScore += 40.0;
                reasons.add(String.format("Soil pH (%.1f) falls squarely within the documented optimal range (%.1f - %.1f).", phLevel, minPh, maxPh));
            } else if (phLevel >= minPh - 0.5 && phLevel <= maxPh + 0.5) {
                totalScore += 22.0;
                warnings.add(String.format("Soil pH (%.1f) is slightly marginal for %s (optimal: %.1f - %.1f). Minor soil amendment advised.", phLevel, crop.getCropName(), minPh, maxPh));
            } else {
                totalScore += 5.0;
                if (phLevel < minPh - 1.0 || phLevel > maxPh + 1.0) {
                    criticalFail = true;
                    failReason = String.format("Soil pH (%.1f) violates critical physiological limits for %s (%.1f - %.1f).", phLevel, crop.getCropName(), minPh, maxPh);
                }
                warnings.add(String.format("Soil pH (%.1f) deviates significantly from suitable bounds (%.1f - %.1f).", phLevel, minPh, maxPh));
            }
        } else {
            totalScore += 20.0; // Uncertainty penalty (missing measurement is NOT given full marks)
            warnings.add("Soil pH test measurement is missing. Evaluation assumes baseline neutral assumption.");
        }

        // 2. Soil Texture Compatibility (Weight: 35 points)
        if (farmSoilType != null && !farmSoilType.isEmpty()) {
            String normalizedType = farmSoilType.toUpperCase();
            List<String> suitableTypes = crop.getSuitableSoilTypes();

            if (suitableTypes != null && suitableTypes.contains(normalizedType)) {
                totalScore += 35.0;
                reasons.add(String.format("Soil texture (%s) is verified as optimal for root penetration and moisture retention of %s.", farmSoilType.replace('_', ' ').toLowerCase(), crop.getCropName()));
            } else if (isCompatibleTexture(normalizedType, suitableTypes)) {
                totalScore += 22.0;
                reasons.add(String.format("Soil texture (%s) is moderately compatible with %s requirements.", farmSoilType.replace('_', ' ').toLowerCase(), crop.getCropName()));
            } else {
                totalScore += 8.0;
                warnings.add(String.format("Soil classification (%s) differs from preferred textures for %s (%s).", farmSoilType, crop.getCropName(), String.join(", ", suitableTypes)));
            }
        } else {
            totalScore += 18.0;
            warnings.add("Farm soil classification is unrecorded. Soil physical structure compatibility cannot be fully validated.");
        }

        // 3. Macronutrient Status Compatibility (Weight: 25 points)
        if (nitrogen != null && phosphorus != null && potassium != null) {
            double nutrientScore = 25.0;

            if (Boolean.TRUE.equals(crop.getNitrogenFixer())) {
                reasons.add("As a biological nitrogen-fixing legume, this crop is well-adapted even when baseline soil nitrogen is low.");
                if (nitrogen < 250.0) {
                    nutrientScore += 0.0; // No penalty for low N on legumes
                }
            } else {
                if (nitrogen < crop.getMinNitrogenKgPerHa() * 0.7) {
                    nutrientScore -= 7.0;
                    warnings.add(String.format("Soil available nitrogen (%.0f kg/ha) is below recommended initial threshold for %s.", nitrogen, crop.getCropName()));
                }
            }

            if (phosphorus < 15.0 && crop.getMinPhosphorusKgPerHa() > 40.0) {
                nutrientScore -= 6.0;
                warnings.add(String.format("Available phosphorus (%.0f kg/ha) is deficient for high-phosphorus demanding %s.", phosphorus, crop.getCropName()));
            }

            if (potassium < 110.0 && crop.getMinPotassiumKgPerHa() > 50.0) {
                nutrientScore -= 5.0;
                warnings.add(String.format("Potassium levels (%.0f kg/ha) are low; supplemental potash required during tillering/flowering.", potassium));
            }

            totalScore += Math.max(5.0, nutrientScore);
        } else {
            totalScore += 12.0;
            warnings.add("Partial or missing N-P-K nutrient assay data. Fertilizer adjustment will be required upon laboratory testing.");
        }

        int finalScore = (int) Math.min(100, Math.max(0, Math.round(totalScore)));
        Evaluation eval = new Evaluation(finalScore, criticalFail, failReason);
        eval.getReasons().addAll(reasons);
        eval.getWarnings().addAll(warnings);
        return eval;
    }

    private boolean isCompatibleTexture(String farmSoil, List<String> suitable) {
        if (suitable == null) return false;
        if (farmSoil.contains("LOAM") && suitable.stream().anyMatch(s -> s.contains("LOAM"))) {
            return true;
        }
        if (farmSoil.contains("CLAY") && suitable.stream().anyMatch(s -> s.contains("CLAY"))) {
            return true;
        }
        return false;
    }
}
