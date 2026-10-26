package com.agrosmart.model;

import java.io.Serializable;

public class Farm implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String userId;
    private String name;
    private String location;
    private Double totalAreaAcres;
    private String soilType;
    private String irrigationSource;
    private String primaryCropType;
    private String notes;
    private String createdAt;
    private String updatedAt;

    public Farm() {
    }

    public Farm(String id, String userId, String name, String location, Double totalAreaAcres, String soilType, String irrigationSource, String primaryCropType, String notes, String createdAt, String updatedAt) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.location = location;
        this.totalAreaAcres = totalAreaAcres;
        this.soilType = soilType;
        this.irrigationSource = irrigationSource;
        this.primaryCropType = primaryCropType;
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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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
