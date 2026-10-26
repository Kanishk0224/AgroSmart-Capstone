package com.agrosmart.service;

import com.agrosmart.dto.MlPredictionRequest;
import com.agrosmart.dto.MlPredictionResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class MachineLearningRecommendationClientTest {

    @Test
    public void testClientGracefulFallbackWhenServiceUnavailable() {
        MachineLearningRecommendationClient client = new MachineLearningRecommendationClient();
        MlPredictionRequest req = new MlPredictionRequest(85.0, 45.0, 40.0, 24.0, 80.0, 6.5, 200.0);

        // ML server may not be running on localhost:8000 during isolated Java unit testing
        MlPredictionResponse resp = client.predictCrop(req);

        assertNotNull(resp, "Response should never be null");
        // If unavailable, available must be false and uncertainty warning must explain status
        if (!resp.isAvailable()) {
            assertEquals("SERVICE_UNAVAILABLE", resp.getValidationStatus());
            assertNotNull(resp.getUncertaintyWarning());
        }
    }
}
