package com.agrosmart.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;
import java.io.Serializable;

public class FarmRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    @NotBlank(message = "Farm name cannot be empty")
    @Size(min = 2, max = 120, message = "Farm name must be between 2 and 120 characters")
    private String name;

    @NotBlank(message = "Location cannot be empty")
    @Size(max = 200, message = "Location cannot exceed 200 characters")
    private String location;

    @NotNull(message = "Total area in acres is required")
    @Positive(message = "Total area must be greater than zero")
    private Double totalAreaAcres;

    @NotBlank(message = "Soil type is required")
    @Size(max = 50, message = "Soil type cannot exceed 50 characters")
    private String soilType;

    @NotBlank(message = "Irrigation source is required")
    @Size(max = 50, message = "Irrigation source cannot exceed 50 characters")
    private String irrigationSource;

    @Size(max = 100, message = "Primary crop type cannot exceed 100 characters")
    private String primaryCropType;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    public FarmRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getTotalAreaAcres() {
        return totalAreaAcres;
    }

    public void setTotalAreaAcres(Double totalAreaAcres) {
        this.totalAreaAcres = totalAreaAcres;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public String getIrrigationSource() {
        return irrigationSource;
    }

    public void setIrrigationSource(String irrigationSource) {
        this.irrigationSource = irrigationSource;
    }

    public String getPrimaryCropType() {
        return primaryCropType;
    }

    public void setPrimaryCropType(String primaryCropType) {
        this.primaryCropType = primaryCropType;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
