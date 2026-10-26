package com.agrosmart.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.io.Serializable;

public class WaterBudgetRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "Farm ID is required")
    private String farmId;

    @NotBlank(message = "Crop ID or Name is required")
    private String cropIdOrName;

    @NotNull(message = "Area is required")
    @Positive(message = "Area must be positive")
    private Double areaAcres;

    private String irrigationMethod; // DRIP, SPRINKLER, CANAL, BOREWELL, RAIN_FED
    private Double seasonalRainfallMm; // Optional estimated rainfall
    private Double availableWaterSupplyM3; // Optional available water in m3

    public WaterBudgetRequest() {
    }

    public String getFarmId() {
        return farmId;
    }

    public void setFarmId(String farmId) {
        this.farmId = farmId;
    }

    public String getCropIdOrName() {
        return cropIdOrName;
    }

    public void setCropIdOrName(String cropIdOrName) {
        this.cropIdOrName = cropIdOrName;
    }

    public Double getAreaAcres() {
        return areaAcres;
    }

    public void setAreaAcres(Double areaAcres) {
        this.areaAcres = areaAcres;
    }

    public String getIrrigationMethod() {
        return irrigationMethod;
    }

    public void setIrrigationMethod(String irrigationMethod) {
        this.irrigationMethod = irrigationMethod;
    }

    public Double getSeasonalRainfallMm() {
        return seasonalRainfallMm;
    }

    public void setSeasonalRainfallMm(Double seasonalRainfallMm) {
        this.seasonalRainfallMm = seasonalRainfallMm;
    }

    public Double getAvailableWaterSupplyM3() {
        return availableWaterSupplyM3;
    }

    public void setAvailableWaterSupplyM3(Double availableWaterSupplyM3) {
        this.availableWaterSupplyM3 = availableWaterSupplyM3;
    }
}
