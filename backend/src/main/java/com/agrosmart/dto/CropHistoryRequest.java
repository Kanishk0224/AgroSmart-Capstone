package com.agrosmart.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.Serializable;

public class CropHistoryRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "Crop name is required")
    private String cropName;

    private String botanicalFamily;

    @NotBlank(message = "Season is required")
    private String season;

    private String sowingDate;
    private String harvestDate;

    @NotNull(message = "Area planted is required")
    @Positive(message = "Area planted must be greater than zero")
    private Double areaPlantedAcres;

    private Double yieldMetricTons;
    private String notes;

    public CropHistoryRequest() {
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
}
