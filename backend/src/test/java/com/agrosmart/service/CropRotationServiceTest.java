package com.agrosmart.service;

import com.agrosmart.model.Crop;
import com.agrosmart.model.CropCategory;
import com.agrosmart.repository.CropHistoryRepository;
import com.agrosmart.repository.FarmRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

public class CropRotationServiceTest {

    private CropRotationService rotationService;
    private CropHistoryRepository historyRepository;
    private FarmRepository farmRepository;

    @BeforeEach
    public void setup() {
        historyRepository = Mockito.mock(CropHistoryRepository.class);
        farmRepository = Mockito.mock(FarmRepository.class);
        rotationService = new CropRotationService(historyRepository, farmRepository);
    }

    @Test
    public void testContinuousCerealRotationPenalty() {
        Crop wheat = new Crop();
        wheat.setCropName("Wheat");
        wheat.setBotanicalFamily("Poaceae");

        CropRotationService.RotationEvaluation eval = rotationService.evaluateRotation(wheat, "Rice");
        assertEquals(60, eval.getScore());
        assertTrue(eval.getWarnings().stream().anyMatch(w -> w.contains("Continuous cereal cultivation")));
    }

    @Test
    public void testLegumePredecessorBonus() {
        Crop wheat = new Crop();
        wheat.setCropName("Wheat");
        wheat.setBotanicalFamily("Poaceae");
        wheat.setGoodFollowers(Arrays.asList("Chickpea", "Soybean"));

        CropRotationService.RotationEvaluation eval = rotationService.evaluateRotation(wheat, "Chickpea");
        assertTrue(eval.getScore() >= 95);
        assertTrue(eval.getReasons().stream().anyMatch(r -> r.contains("Legume-cereal alternation")));
    }

    @Test
    public void testSolanaceousDiseaseWarning() {
        Crop tomato = new Crop();
        tomato.setCropName("Tomato");
        tomato.setBotanicalFamily("Solanaceae");

        CropRotationService.RotationEvaluation eval = rotationService.evaluateRotation(tomato, "Potato");
        assertEquals(35, eval.getScore());
        assertTrue(eval.getWarnings().stream().anyMatch(w -> w.contains("Solanaceous crop")));
    }
}
