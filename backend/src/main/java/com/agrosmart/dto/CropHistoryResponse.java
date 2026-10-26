package com.agrosmart.dto;

import com.agrosmart.model.CropHistory;
import java.io.Serializable;

public class CropHistoryResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String farmId;
    private String cropName;
    private String botanicalFamily;
    private String season;
    private String sowingDate;
    private String harvestDate;
    private Double areaPlantedAcres;
    private Double yieldMetricTons;
    private String notes;
    private String createdAt;

    public CropHistoryResponse() {
    }

    public static CropHistoryResponse fromModel(CropHistory model) {
        if (model == null) return null;
        CropHistoryResponse res = new CropHistoryResponse();
        res.setId(model.getId());
        res.setFarmId(model.getFarmId());
        res.setCropName(model.getCropName());
        res.setBotanicalFamily(model.getBotanicalFamily());
        res.setSeason(model.getSeason());
        res.setSowingDate(model.getSowingDate());
        res.setHarvestDate(model.getHarvestDate());
        res.setAreaPlantedAcres(model.getAreaPlantedAcres());
        res.setYieldMetricTons(model.getYieldMetricTons());
        res.setNotes(model.getNotes());
        res.setCreatedAt(model.getCreatedAt());
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
}
