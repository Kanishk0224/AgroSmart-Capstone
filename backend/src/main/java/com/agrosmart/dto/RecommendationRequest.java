package com.agrosmart.dto;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;

public class RecommendationRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "Farm ID is required")
    private String farmId;

    private String soilTestId; // Optional: auto-fill from existing test
    private String season; // KHARIF, RABI, ZAID, ALL_SEASON
    private String soilType; // LOAMY, CLAY, etc.
    private Double phLevel;
    private Double nitrogenLevel;
    private Double phosphorusLevel;
    private Double potassiumLevel;
    private Double temperatureCelsius;
    private Double rainfallMm;
    private String irrigationMethod; // DRIP, SPRINKLER, CANAL, BOREWELL, RAIN_FED
    private String availableWaterM3;
    private String previousCrop;
    private String sustainabilityPreference; // BALANCED, WATER_CONSERVATION, SOIL_HEALTH, PROFIT_FOCUSED

    public RecommendationRequest() {
        this.sustainabilityPreference = "BALANCED";
    }

    public String getFarmId() {
        return farmId;
    }

    public void setFarmId(String farmId) {
        this.farmId = farmId;
    }

    public String getSoilTestId() {
        return soilTestId;
    }

    public void setSoilTestId(String soilTestId) {
        this.soilTestId = soilTestId;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
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

    public Double getTemperatureCelsius() {
        return temperatureCelsius;
    }

    public void setTemperatureCelsius(Double temperatureCelsius) {
        this.temperatureCelsius = temperatureCelsius;
    }

    public Double getRainfallMm() {
        return rainfallMm;
    }

    public void setRainfallMm(Double rainfallMm) {
        this.rainfallMm = rainfallMm;
    }

    public String getIrrigationMethod() {
        return irrigationMethod;
    }

    public void setIrrigationMethod(String irrigationMethod) {
        this.irrigationMethod = irrigationMethod;
    }

    public String getAvailableWaterM3() {
        return availableWaterM3;
    }

    public void setAvailableWaterM3(String availableWaterM3) {
        this.availableWaterM3 = availableWaterM3;
    }

    public String getPreviousCrop() {
        return previousCrop;
    }

    public void setPreviousCrop(String previousCrop) {
        this.previousCrop = previousCrop;
    }

    public String getSustainabilityPreference() {
        return sustainabilityPreference;
    }

    public void setSustainabilityPreference(String sustainabilityPreference) {
        this.sustainabilityPreference = sustainabilityPreference;
    }
}
