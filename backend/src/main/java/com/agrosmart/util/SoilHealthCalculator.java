package com.agrosmart.util;

import com.agrosmart.model.FertilityRating;

import java.util.ArrayList;
import java.util.List;

public class SoilHealthCalculator {

    public static class AnalysisResult {
        private final FertilityRating rating;
        private final String recommendations;

        public AnalysisResult(FertilityRating rating, String recommendations) {
            this.rating = rating;
            this.recommendations = recommendations;
        }

        public FertilityRating getRating() {
            return rating;
        }

        public String getRecommendations() {
            return recommendations;
        }
    }

    public static AnalysisResult analyze(Double ph, Double n, Double p, Double k, Double organicMatter) {
        if (ph == null) ph = 6.5;
        if (n == null) n = 300.0;
        if (p == null) p = 20.0;
        if (k == null) k = 150.0;

        boolean isPhOptimal = ph >= 6.0 && ph <= 7.5;
        boolean isPhAcidic = ph < 6.0;
        boolean isPhAlkaline = ph > 7.5;

        boolean nDeficient = n < 280.0;
        boolean nHigh = n > 560.0;

        boolean pDeficient = p < 15.0;
        boolean pHigh = p > 35.0;

        boolean kDeficient = k < 120.0;
        boolean kHigh = k > 280.0;

        int deficiencyCount = (nDeficient ? 1 : 0) + (pDeficient ? 1 : 0) + (kDeficient ? 1 : 0);
        int highCount = (nHigh ? 1 : 0) + (pHigh ? 1 : 0) + (kHigh ? 1 : 0);

        FertilityRating rating;
        if (deficiencyCount >= 2 || ph < 5.2 || ph > 8.5) {
            rating = FertilityRating.DEFICIENT;
        } else if (highCount >= 2) {
            rating = FertilityRating.EXCESSIVE;
        } else if (isPhOptimal && deficiencyCount == 0) {
            rating = FertilityRating.OPTIMAL;
        } else {
            rating = FertilityRating.MODERATE;
        }

        List<String> recs = new ArrayList<String>();

        if (isPhAcidic) {
            recs.add("Soil is acidic. Apply agricultural lime at 2-3 tons/ha to neutralize soil acidity.");
        } else if (isPhAlkaline) {
            recs.add("Soil is alkaline. Apply agricultural gypsum (calcium sulfate) or elemental sulfur.");
        } else {
            recs.add("Soil pH is in the optimal range (6.0 - 7.5) for nutrient uptake.");
        }

        if (nDeficient) {
            recs.add("Nitrogen is below threshold. Incorporate leguminous cover crops and split urea applications.");
        } else if (nHigh) {
            recs.add("Nitrogen is high. Reduce nitrogenous fertilizers to prevent vegetative overgrowth.");
        }

        if (pDeficient) {
            recs.add("Phosphorus is deficient. Apply Single Super Phosphate (SSP) along with PSB biofertilizers.");
        }

        if (kDeficient) {
            recs.add("Potassium is low. Apply Muriate of Potash (MOP) to boost drought resilience.");
        }

        if (organicMatter != null && organicMatter < 1.5) {
            recs.add("Organic carbon is low (<1.5%). Apply 8-10 tons/ha farmyard manure (FYM) or vermicompost.");
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < recs.size(); i++) {
            if (i > 0) sb.append(" ");
            sb.append(recs.get(i));
        }

        return new AnalysisResult(rating, sb.toString());
    }
}
