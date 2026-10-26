package com.agrosmart.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.Serializable;

public class ProfitabilityRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "Farm ID is required")
    private String farmId;

    @NotBlank(message = "Crop name is required")
    private String cropName;

    @NotNull(message = "Area is required")
    @Positive(message = "Area must be positive")
    private Double areaAcres;

    // Optional field cost components (per acre or total)
    private Double seedCost;
    private Double fertilizerCost;
    private Double labourCost;
    private Double irrigationCost;
    private Double equipmentCost;
    private Double otherCosts;

    // Expected yield and price
    @NotNull(message = "Expected yield per acre is required")
    @Positive(message = "Yield must be positive")
    private Double expectedYieldPerAcre;

    private String yieldUnit; // Quintals, Metric Tons, Kg

    @NotNull(message = "Expected selling price is required")
    @Positive(message = "Price must be positive")
    private Double expectedSellingPricePerUnit;

    private String currency; // INR, USD

    public ProfitabilityRequest() {
        this.yieldUnit = "Quintals";
        this.currency = "INR";
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

    public Double getAreaAcres() {
        return areaAcres;
    }

    public void setAreaAcres(Double areaAcres) {
        this.areaAcres = areaAcres;
    }

    public Double getSeedCost() {
        return seedCost;
    }

    public void setSeedCost(Double seedCost) {
        this.seedCost = seedCost;
    }

    public Double getFertilizerCost() {
        return fertilizerCost;
    }

    public void setFertilizerCost(Double fertilizerCost) {
        this.fertilizerCost = fertilizerCost;
    }

    public Double getLabourCost() {
        return labourCost;
    }

    public void setLabourCost(Double labourCost) {
        this.labourCost = labourCost;
    }

    public Double getIrrigationCost() {
        return irrigationCost;
    }

    public void setIrrigationCost(Double irrigationCost) {
        this.irrigationCost = irrigationCost;
    }

    public Double getEquipmentCost() {
        return equipmentCost;
    }

    public void setEquipmentCost(Double equipmentCost) {
        this.equipmentCost = equipmentCost;
    }

    public Double getOtherCosts() {
        return otherCosts;
    }

    public void setOtherCosts(Double otherCosts) {
        this.otherCosts = otherCosts;
    }

    public Double getExpectedYieldPerAcre() {
        return expectedYieldPerAcre;
    }

    public void setExpectedYieldPerAcre(Double expectedYieldPerAcre) {
        this.expectedYieldPerAcre = expectedYieldPerAcre;
    }

    public String getYieldUnit() {
        return yieldUnit;
    }

    public void setYieldUnit(String yieldUnit) {
        this.yieldUnit = yieldUnit;
    }

    public Double getExpectedSellingPricePerUnit() {
        return expectedSellingPricePerUnit;
    }

    public void setExpectedSellingPricePerUnit(Double expectedSellingPricePerUnit) {
        this.expectedSellingPricePerUnit = expectedSellingPricePerUnit;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
