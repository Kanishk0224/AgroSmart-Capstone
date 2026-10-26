package com.agrosmart.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class MlPredictionResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private boolean available;
    private String predictedCrop;
    private double confidence;
    private String modelVersion;
    private String validationStatus;
    private String uncertaintyWarning;
    private List<AlternativeCropPrediction> alternatives = new ArrayList<AlternativeCropPrediction>();
    private List<String> caveats = new ArrayList<String>();

    public static class AlternativeCropPrediction implements Serializable {
        private static final long serialVersionUID = 1L;
        private String crop;
        private double probability;

        public AlternativeCropPrediction() {}

        public AlternativeCropPrediction(String crop, double probability) {
            this.crop = crop;
            this.probability = probability;
        }

        public String getCrop() {
            return crop;
        }

        public void setCrop(String crop) {
            this.crop = crop;
        }

        public double getProbability() {
            return probability;
        }

        public void setProbability(double probability) {
            this.probability = probability;
        }
    }

    public MlPredictionResponse() {
        this.available = true;
    }

    public static MlPredictionResponse unavailable(String reason) {
        MlPredictionResponse r = new MlPredictionResponse();
        r.setAvailable(false);
        r.setUncertaintyWarning(reason);
        r.setValidationStatus("SERVICE_UNAVAILABLE");
        return r;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getPredictedCrop() {
        return predictedCrop;
    }

    public void setPredictedCrop(String predictedCrop) {
        this.predictedCrop = predictedCrop;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public String getModelVersion() {
        return modelVersion;
    }

    public void setModelVersion(String modelVersion) {
        this.modelVersion = modelVersion;
    }

    public String getValidationStatus() {
        return validationStatus;
    }

    public void setValidationStatus(String validationStatus) {
        this.validationStatus = validationStatus;
    }

    public String getUncertaintyWarning() {
        return uncertaintyWarning;
    }

    public void setUncertaintyWarning(String uncertaintyWarning) {
        this.uncertaintyWarning = uncertaintyWarning;
    }

    public List<AlternativeCropPrediction> getAlternatives() {
        return alternatives;
    }

    public void setAlternatives(List<AlternativeCropPrediction> alternatives) {
        this.alternatives = alternatives;
    }

    public List<String> getCaveats() {
        return caveats;
    }

    public void setCaveats(List<String> caveats) {
        this.caveats = caveats;
    }
}
