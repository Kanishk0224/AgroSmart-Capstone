package com.agrosmart.service;

import com.agrosmart.dto.ComponentScoresDto;
import com.agrosmart.dto.CropRecommendationDto;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecommendationRankingService {

    public void rankAndScore(List<CropRecommendationDto> candidates, String sustainabilityPreference, boolean climateMissing) {
        if (candidates == null || candidates.isEmpty()) return;

        // Base weights
        double wSoil = 0.35;
        double wWater = 0.25;
        double wSeason = 0.20;
        double wClimate = climateMissing ? 0.0 : 0.10;
        double wRotation = 0.10;

        // Adjust for user preference
        if ("WATER_CONSERVATION".equalsIgnoreCase(sustainabilityPreference)) {
            wWater = 0.40;
            wSoil = 0.30;
            wSeason = 0.15;
            wRotation = 0.10;
            wClimate = climateMissing ? 0.0 : 0.05;
        } else if ("SOIL_HEALTH".equalsIgnoreCase(sustainabilityPreference)) {
            wSoil = 0.45;
            wRotation = 0.20;
            wWater = 0.20;
            wSeason = 0.10;
            wClimate = climateMissing ? 0.0 : 0.05;
        }

        // Normalize weights so they sum exactly to 1.0
        double totalWeight = wSoil + wWater + wSeason + wClimate + wRotation;
        wSoil /= totalWeight;
        wWater /= totalWeight;
        wSeason /= totalWeight;
        wClimate /= totalWeight;
        wRotation /= totalWeight;

        for (CropRecommendationDto dto : candidates) {
            ComponentScoresDto cs = dto.getComponentScores();
            if (cs == null) continue;

            if (dto.isCriticalConstraintFailed()) {
                dto.setSuitabilityScore(Math.min(25, (int) Math.round(cs.getSoil() * 0.2 + cs.getWater() * 0.2)));
            } else {
                double raw = cs.getSoil() * wSoil +
                             cs.getWater() * wWater +
                             cs.getSeason() * wSeason +
                             cs.getClimate() * wClimate +
                             cs.getRotation() * wRotation;

                int finalScore = (int) Math.min(100, Math.max(0, Math.round(raw)));
                dto.setSuitabilityScore(finalScore);
            }
        }

        // Sort descending by score
        Collections.sort(candidates, new Comparator<CropRecommendationDto>() {
            @Override
            public int compare(CropRecommendationDto a, CropRecommendationDto b) {
                // Critical failures go to the bottom
                if (a.isCriticalConstraintFailed() && !b.isCriticalConstraintFailed()) return 1;
                if (!a.isCriticalConstraintFailed() && b.isCriticalConstraintFailed()) return -1;
                return Integer.compare(b.getSuitabilityScore(), a.getSuitabilityScore());
            }
        });
    }
}
