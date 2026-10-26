package com.agrosmart.service;

import com.agrosmart.dto.MlPredictionRequest;
import com.agrosmart.dto.MlPredictionResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class MachineLearningRecommendationClient {
    private static final Logger logger = LoggerFactory.getLogger(MachineLearningRecommendationClient.class);

    @Value("${ml.service.url:http://localhost:8000/predict}")
    private String mlServiceUrl;

    @Value("${ml.service.enabled:true}")
    private boolean mlEnabled;

    @Value("${ml.service.timeout.ms:2500}")
    private int timeoutMs;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public MlPredictionResponse predictCrop(MlPredictionRequest request) {
        if (!mlEnabled) {
            logger.debug("Machine Learning prediction service is disabled by configuration");
            return MlPredictionResponse.unavailable("ML prediction module is disabled in configuration");
        }

        HttpURLConnection conn = null;
        try {
            URL url = new URL(mlServiceUrl);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            conn.setConnectTimeout(timeoutMs);
            conn.setReadTimeout(timeoutMs);
            conn.setDoOutput(true);

            String jsonPayload = objectMapper.writeValueAsString(request);
            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonPayload.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            int status = conn.getResponseCode();
            if (status >= 200 && status < 300) {
                StringBuilder responseBody = new StringBuilder();
                try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = br.readLine()) != null) {
                        responseBody.append(line.trim());
                    }
                }

                JsonNode root = objectMapper.readTree(responseBody.toString());
                MlPredictionResponse response = new MlPredictionResponse();
                response.setAvailable(true);
                response.setPredictedCrop(root.path("predicted_crop").asText("Unknown"));
                response.setConfidence(root.path("confidence").asDouble(0.0));
                response.setModelVersion(root.path("model_version").asText("3.1.0"));
                response.setValidationStatus(root.path("validation_status").asText("VALID"));
                if (root.hasNonNull("uncertainty_warning")) {
                    response.setUncertaintyWarning(root.path("uncertainty_warning").asText());
                }

                List<MlPredictionResponse.AlternativeCropPrediction> alts = new ArrayList<MlPredictionResponse.AlternativeCropPrediction>();
                if (root.has("alternative_predictions") && root.path("alternative_predictions").isArray()) {
                    for (JsonNode altNode : root.path("alternative_predictions")) {
                        alts.add(new MlPredictionResponse.AlternativeCropPrediction(
                                altNode.path("crop").asText(),
                                altNode.path("probability").asDouble()
                        ));
                    }
                }
                response.setAlternatives(alts);

                List<String> caveats = new ArrayList<String>();
                if (root.has("caveats") && root.path("caveats").isArray()) {
                    for (JsonNode cNode : root.path("caveats")) {
                        caveats.add(cNode.asText());
                    }
                }
                response.setCaveats(caveats);
                return response;
            } else {
                logger.warn("ML microservice returned non-200 status code: {}", status);
                return MlPredictionResponse.unavailable("ML service returned status: " + status);
            }
        } catch (Exception e) {
            // Log cleanly without exposing stack traces or internals
            logger.debug("ML microservice prediction unavailable or timed out: {}", e.getMessage());
            return MlPredictionResponse.unavailable("Machine Learning service unavailable or timed out");
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
    }

    public boolean isServiceAvailable() {
        if (!mlEnabled) return false;
        try {
            String healthUrl = mlServiceUrl.replace("/predict", "/health");
            URL url = new URL(healthUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(1000);
            conn.setReadTimeout(1000);
            int code = conn.getResponseCode();
            conn.disconnect();
            return (code >= 200 && code < 300);
        } catch (Exception e) {
            return false;
        }
    }
}
