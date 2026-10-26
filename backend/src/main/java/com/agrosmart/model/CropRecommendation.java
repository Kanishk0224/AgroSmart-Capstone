package com.agrosmart.model;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class CropRecommendation implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String farmId;
    private String userId;
    private String season;
    private String scoreVersion;
    private String createdAt;

    // Snapshot of input conditions
    private String soilType;
    private Double phLevel;
    private Double nitrogenLevel;
    private Double phosphorusLevel;
    private Double potassiumLevel;
    private Double temperature;
    private Double rainfall;
    private String irrigationMethod;
    private String previousCrop;

    // Serialized recommended crops list
    private List<Map<String, Object>> recommendedCrops;

    public CropRecommendation() {
        this.scoreVersion = "2.0";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFarmId() {
        return farmId;
    }

    public void setFarmId(String farmId) {
        this.farmId = farmId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public String getScoreVersion() {
        return scoreVersion;
    }

    public void setScoreVersion(String scoreVersion) {
        this.scoreVersion = scoreVersion;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public Double getPhLevel() {
        return phLevel;
    }

    public void setPhLevel(Double phLevel) {
        this.phLevel = phLevel;
    }

    public Double getNitrogenLevel() {
        return nitrogenLevel;
    }

    public void setNitrogenLevel(Double nitrogenLevel) {
        this.nitrogenLevel = nitrogenLevel;
    }

    public Double getPhosphorusLevel() {
        return phosphorusLevel;
    }

    public void setPhosphorusLevel(Double phosphorusLevel) {
        this.phosphorusLevel = phosphorusLevel;
    }

    public Double getPotassiumLevel() {
        return potassiumLevel;
    }

    public void setPotassiumLevel(Double potassiumLevel) {
        this.potassiumLevel = potassiumLevel;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getRainfall() {
        return rainfall;
    }

    public void setRainfall(Double rainfall) {
        this.rainfall = rainfall;
    }

    public String getIrrigationMethod() {
        return irrigationMethod;
    }

    public void setIrrigationMethod(String irrigationMethod) {
        this.irrigationMethod = irrigationMethod;
    }

    public String getPreviousCrop() {
        return previousCrop;
    }

    public void setPreviousCrop(String previousCrop) {
        this.previousCrop = previousCrop;
    }

    public List<Map<String, Object>> getRecommendedCrops() {
        return recommendedCrops;
    }

    public void setRecommendedCrops(List<Map<String, Object>> recommendedCrops) {
        this.recommendedCrops = recommendedCrops;
    }
}
