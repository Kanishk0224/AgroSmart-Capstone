package com.agrosmart.model;

import java.io.Serializable;

public class SoilTest implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String farmId;
    private String userId;
    private String testDate;
    private Double phLevel;
    private Double nitrogenLevel;
    private Double phosphorusLevel;
    private Double potassiumLevel;
    private Double organicMatter;
    private Double moistureContent;
    private Double electricalConductivity;
    private FertilityRating fertilityRating;
    private String recommendations;
    private String createdAt;
    private String updatedAt;

    public SoilTest() {
    }

    public SoilTest(String id, String farmId, String userId, String testDate, Double phLevel, Double nitrogenLevel, Double phosphorusLevel, Double potassiumLevel, Double organicMatter, Double moistureContent, Double electricalConductivity, FertilityRating fertilityRating, String recommendations, String createdAt, String updatedAt) {
        this.id = id;
        this.farmId = farmId;
        this.userId = userId;
        this.testDate = testDate;
        this.phLevel = phLevel;
        this.nitrogenLevel = nitrogenLevel;
        this.phosphorusLevel = phosphorusLevel;
        this.potassiumLevel = potassiumLevel;
        this.organicMatter = organicMatter;
        this.moistureContent = moistureContent;
        this.electricalConductivity = electricalConductivity;
        this.fertilityRating = fertilityRating;
        this.recommendations = recommendations;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public String getTestDate() {
        return testDate;
    }

    public void setTestDate(String testDate) {
        this.testDate = testDate;
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

    public Double getOrganicMatter() {
        return organicMatter;
    }

    public void setOrganicMatter(Double organicMatter) {
        this.organicMatter = organicMatter;
    }

    public Double getMoistureContent() {
        return moistureContent;
    }

    public void setMoistureContent(Double moistureContent) {
        this.moistureContent = moistureContent;
    }

    public Double getElectricalConductivity() {
        return electricalConductivity;
    }

    public void setElectricalConductivity(Double electricalConductivity) {
        this.electricalConductivity = electricalConductivity;
    }

    public FertilityRating getFertilityRating() {
        return fertilityRating;
    }

    public void setFertilityRating(FertilityRating fertilityRating) {
        this.fertilityRating = fertilityRating;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
