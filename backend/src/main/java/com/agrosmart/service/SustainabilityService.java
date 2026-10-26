package com.agrosmart.service;

import com.agrosmart.dto.SustainabilityScoreDto;
import com.agrosmart.model.Crop;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SustainabilityService {

    public SustainabilityScoreDto calculateSustainability(Crop crop, String irrigationMethod, String previousCrop) {
        SustainabilityScoreDto dto = new SustainabilityScoreDto();
        List<String> highlights = new ArrayList<String>();
        List<String> warnings = new ArrayList<String>();

        if (crop == null) {
            dto.setOverallScore(50);
            return dto;
        }

        // 1. Water Conservation Index (0 - 100)
        double waterRequirement = crop.getWaterRequirementMm() != null ? crop.getWaterRequirementMm() : 500.0;
        int waterIndex;
        if (waterRequirement <= 350.0) {
            waterIndex = 95;
            highlights.add(String.format("Low water footprint crop (%.0f mm); significantly conserves groundwater reserves.", waterRequirement));
        } else if (waterRequirement <= 600.0) {
            waterIndex = 80;
            highlights.add(String.format("Moderate water demand (%.0f mm); sustainable when paired with efficient irrigation.", waterRequirement));
        } else {
            waterIndex = 45;
            warnings.add(String.format("High water requirement (%.0f mm); requires conscientious water budgeting to prevent regional aquifer stress.", waterRequirement));
        }

        if ("DRIP".equalsIgnoreCase(irrigationMethod)) {
            waterIndex = Math.min(100, waterIndex + 15);
            highlights.add("Paired with micro-drip irrigation, eliminating evaporation runoff losses.");
        }

        // 2. Soil Preservation Index (0 - 100)
        int soilIndex = 70;
        if (Boolean.TRUE.equals(crop.getNitrogenFixer())) {
            soilIndex = 98;
            highlights.add("Biological nitrogen-fixer (Rhizobium symbiosis) that naturally rebuilds soil organic fertility.");
        } else if (Boolean.TRUE.equals(crop.getDeepRooted())) {
            soilIndex = 85;
            highlights.add("Deep taproot architecture aerates compacted soil sub-layers and taps subsoil moisture.");
        }

        // 3. Agrochemical Burden Index (0 - 100)
        int chemicalIndex = 75;
        double maxN = crop.getMaxNitrogenKgPerHa() != null ? crop.getMaxNitrogenKgPerHa() : 100.0;
        if (maxN > 140.0) {
            chemicalIndex = 50;
            warnings.add(String.format("High nitrogen fertilizer requirement (up to %.0f kg/ha); precision split dosing required to prevent nitrate runoff.", maxN));
        } else if (Boolean.TRUE.equals(crop.getNitrogenFixer())) {
            chemicalIndex = 95;
            highlights.add("Minimal synthetic nitrogen requirement reduces farm chemical runoff footprint.");
        }

        // 4. Biodiversity & Rotation Health Index (0 - 100)
        int rotationIndex = 80;
        if (previousCrop != null && !previousCrop.isEmpty()) {
            if (previousCrop.toLowerCase().contains("legume") || previousCrop.toLowerCase().contains("gram") || previousCrop.toLowerCase().contains("pulse")) {
                rotationIndex = 92;
                highlights.add("Sequenced after a legume crop, maximizing rotational biological diversity.");
            }
        }

        // Weighted Average: Water (30%), Soil (30%), Chemical (20%), Rotation (20%)
        int overall = (int) Math.round(
                waterIndex * 0.30 +
                soilIndex * 0.30 +
                chemicalIndex * 0.20 +
                rotationIndex * 0.20
        );

        dto.setOverallScore(Math.min(100, Math.max(0, overall)));
        dto.setWaterConservationIndex(waterIndex);
        dto.setSoilPreservationIndex(soilIndex);
        dto.setNutrientBalanceIndex(chemicalIndex);
        dto.setBiodiversityRotationIndex(rotationIndex);
        dto.setSustainabilityHighlights(highlights);
        dto.setEnvironmentalWarnings(warnings);
        dto.setScoringVersion("2.0");

        return dto;
    }
}
