package com.agrosmart.util;

import com.agrosmart.model.FertilityRating;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class SoilHealthCalculatorTest {

    @Test
    public void testOptimalSoilProfile() {
        SoilHealthCalculator.AnalysisResult result = SoilHealthCalculator.analyze(6.8, 350.0, 22.0, 200.0, 2.5);
        assertEquals(FertilityRating.OPTIMAL, result.getRating());
        assertTrue(result.getRecommendations().contains("optimal range"));
    }

    @Test
    public void testAcidicAndDeficientSoil() {
        SoilHealthCalculator.AnalysisResult result = SoilHealthCalculator.analyze(5.0, 150.0, 8.0, 90.0, 1.0);
        assertEquals(FertilityRating.DEFICIENT, result.getRating());
        assertTrue(result.getRecommendations().contains("lime"));
        assertTrue(result.getRecommendations().contains("Nitrogen is below threshold"));
    }

    @Test
    public void testAlkalineAndPhosphorusDeficient() {
        SoilHealthCalculator.AnalysisResult result = SoilHealthCalculator.analyze(8.0, 320.0, 10.0, 220.0, 1.8);
        assertTrue(result.getRecommendations().contains("gypsum"));
        assertTrue(result.getRecommendations().contains("Phosphorus is deficient"));
    }
}
