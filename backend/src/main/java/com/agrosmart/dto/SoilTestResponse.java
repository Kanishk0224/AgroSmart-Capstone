package com.agrosmart.dto;

import com.agrosmart.model.FertilityRating;
import com.agrosmart.model.SoilTest;
import java.io.Serializable;

public class SoilTestResponse implements Serializable {
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

    public SoilTestResponse() {
    }

    public static SoilTestResponse fromModel(SoilTest test) {
        if (test == null) return null;
        SoilTestResponse res = new SoilTestResponse();
        res.setId(test.getId());
        res.setFarmId(test.getFarmId());
        res.setUserId(test.getUserId());
        res.setTestDate(test.getTestDate());
        res.setPhLevel(test.getPhLevel());
        res.setNitrogenLevel(test.getNitrogenLevel());
        res.setPhosphorusLevel(test.getPhosphorusLevel());
        res.setPotassiumLevel(test.getPotassiumLevel());
        res.setOrganicMatter(test.getOrganicMatter());
        res.setMoistureContent(test.getMoistureContent());
        res.setElectricalConductivity(test.getElectricalConductivity());
        res.setFertilityRating(test.getFertilityRating());
        res.setRecommendations(test.getRecommendations());
        res.setCreatedAt(test.getCreatedAt());
        res.setUpdatedAt(test.getUpdatedAt());
        return res;
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
