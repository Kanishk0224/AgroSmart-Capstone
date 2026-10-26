package com.agrosmart.dto;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;
import javax.validation.constraints.Size;
import java.io.Serializable;

public class SoilTestRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "Farm ID is required")
    private String farmId;

    @NotBlank(message = "Test date is required")
    @Size(max = 30)
    private String testDate;

    @NotNull(message = "pH level is required")
    @DecimalMin(value = "0.0", message = "pH cannot be below 0")
    @DecimalMax(value = "14.0", message = "pH cannot exceed 14")
    private Double phLevel;

    @NotNull(message = "Nitrogen level is required")
    @PositiveOrZero(message = "Nitrogen level must be non-negative")
    private Double nitrogenLevel;

    @NotNull(message = "Phosphorus level is required")
    @PositiveOrZero(message = "Phosphorus level must be non-negative")
    private Double phosphorusLevel;

    @NotNull(message = "Potassium level is required")
    @PositiveOrZero(message = "Potassium level must be non-negative")
    private Double potassiumLevel;

    private Double organicMatter;
    private Double moistureContent;
    private Double electricalConductivity;

    public SoilTestRequest() {
    }

    public String getFarmId() {
        return farmId;
    }

    public void setFarmId(String farmId) {
        this.farmId = farmId;
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
}
