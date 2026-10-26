package com.agrosmart.dto;

import com.agrosmart.model.Farm;
import java.io.Serializable;

public class FarmResponse implements Serializable {
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

    public FarmResponse() {
    }

    public static FarmResponse fromModel(Farm farm) {
        if (farm == null) return null;
        FarmResponse res = new FarmResponse();
        res.setId(farm.getId());
        res.setUserId(farm.getUserId());
        res.setName(farm.getName());
        res.setLocation(farm.getLocation());
        res.setTotalAreaAcres(farm.getTotalAreaAcres());
        res.setSoilType(farm.getSoilType());
        res.setIrrigationSource(farm.getIrrigationSource());
        res.setPrimaryCropType(farm.getPrimaryCropType());
        res.setNotes(farm.getNotes());
        res.setCreatedAt(farm.getCreatedAt());
        res.setUpdatedAt(farm.getUpdatedAt());
        return res;
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
