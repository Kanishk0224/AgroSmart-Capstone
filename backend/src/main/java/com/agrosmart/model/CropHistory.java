package com.agrosmart.model;

import java.io.Serializable;

public class CropHistory implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String farmId;
    private String userId;
    private String cropName;
    private String botanicalFamily;
    private String season;
    private String sowingDate;
    private String harvestDate;
    private Double areaPlantedAcres;
    private Double yieldMetricTons;
    private String notes;
    private String createdAt;
    private String updatedAt;

    public CropHistory() {
    }

    public CropHistory(String id, String farmId, String userId, String cropName, String botanicalFamily, String season, String sowingDate, String harvestDate, Double areaPlantedAcres, Double yieldMetricTons, String notes, String createdAt, String updatedAt) {
        this.id = id;
        this.farmId = farmId;
        this.userId = userId;
        this.cropName = cropName;
        this.botanicalFamily = botanicalFamily;
        this.season = season;
        this.sowingDate = sowingDate;
        this.harvestDate = harvestDate;
        this.areaPlantedAcres = areaPlantedAcres;
        this.yieldMetricTons = yieldMetricTons;
        this.notes = notes;
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

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getBotanicalFamily() {
        return botanicalFamily;
    }

    public void setBotanicalFamily(String botanicalFamily) {
        this.botanicalFamily = botanicalFamily;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public String getSowingDate() {
        return sowingDate;
    }

    public void setSowingDate(String sowingDate) {
        this.sowingDate = sowingDate;
    }

    public String getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(String harvestDate) {
        this.harvestDate = harvestDate;
    }

    public Double getAreaPlantedAcres() {
        return areaPlantedAcres;
    }

    public void setAreaPlantedAcres(Double areaPlantedAcres) {
        this.areaPlantedAcres = areaPlantedAcres;
    }

    public Double getYieldMetricTons() {
        return yieldMetricTons;
    }

    public void setYieldMetricTons(Double yieldMetricTons) {
        this.yieldMetricTons = yieldMetricTons;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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
