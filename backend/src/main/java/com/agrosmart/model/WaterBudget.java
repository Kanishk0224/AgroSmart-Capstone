package com.agrosmart.model;

import java.io.Serializable;

public class WaterBudget implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String farmId;
    private String userId;
    private String cropName;
    private Double areaAcres;
    private String irrigationMethod;
    private Double cropWaterDemandMm;
    private Double totalWaterDemandM3;
    private Double estimatedRainfallMm;
    private Double effectiveRainfallM3;
    private Double netIrrigationDemandM3;
    private Double grossIrrigationDemandM3;
    private Double availableSupplyM3;
    private Double deficitSurplusM3;
    private String balanceStatus; // SUFFICIENT_ESTIMATED, POSSIBLE_SHORTAGE, DATA_INSUFFICIENT
    private String assumptions;
    private String createdAt;

    public WaterBudget() {
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

    public Double getCropWaterDemandMm() {
        return cropWaterDemandMm;
    }

    public void setCropWaterDemandMm(Double cropWaterDemandMm) {
        this.cropWaterDemandMm = cropWaterDemandMm;
    }

    public Double getTotalWaterDemandM3() {
        return totalWaterDemandM3;
    }

    public void setTotalWaterDemandM3(Double totalWaterDemandM3) {
        this.totalWaterDemandM3 = totalWaterDemandM3;
    }

    public Double getEstimatedRainfallMm() {
        return estimatedRainfallMm;
    }

    public void setEstimatedRainfallMm(Double estimatedRainfallMm) {
        this.estimatedRainfallMm = estimatedRainfallMm;
    }

    public Double getEffectiveRainfallM3() {
        return effectiveRainfallM3;
    }

    public void setEffectiveRainfallM3(Double effectiveRainfallM3) {
        this.effectiveRainfallM3 = effectiveRainfallM3;
    }

    public Double getNetIrrigationDemandM3() {
        return netIrrigationDemandM3;
    }

    public void setNetIrrigationDemandM3(Double netIrrigationDemandM3) {
        this.netIrrigationDemandM3 = netIrrigationDemandM3;
    }

    public Double getGrossIrrigationDemandM3() {
        return grossIrrigationDemandM3;
    }

    public void setGrossIrrigationDemandM3(Double grossIrrigationDemandM3) {
        this.grossIrrigationDemandM3 = grossIrrigationDemandM3;
    }

    public Double getAvailableSupplyM3() {
        return availableSupplyM3;
    }

    public void setAvailableSupplyM3(Double availableSupplyM3) {
        this.availableSupplyM3 = availableSupplyM3;
    }

    public Double getDeficitSurplusM3() {
        return deficitSurplusM3;
    }

    public void setDeficitSurplusM3(Double deficitSurplusM3) {
        this.deficitSurplusM3 = deficitSurplusM3;
    }

    public String getBalanceStatus() {
        return balanceStatus;
    }

    public void setBalanceStatus(String balanceStatus) {
        this.balanceStatus = balanceStatus;
    }

    public String getAssumptions() {
        return assumptions;
    }

    public void setAssumptions(String assumptions) {
        this.assumptions = assumptions;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
