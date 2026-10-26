package com.agrosmart.dto;

import java.io.Serializable;
import java.util.List;

public class WaterBudgetResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String farmId;
    private String cropName;
    private Double areaAcres;
    private Double areaHectares;
    private String irrigationMethod;
    private Double irrigationEfficiencyPercent;

    // Depth metrics (mm)
    private Double cropWaterDemandMm;
    private Double estimatedRainfallMm;
    private Double effectiveRainfallMm;
    private Double netIrrigationDemandMm;
    private Double grossIrrigationDemandMm;

    // Volumetric metrics (m3)
    private Double totalCropDemandM3;
    private Double effectiveRainfallM3;
    private Double netIrrigationDemandM3;
    private Double grossIrrigationDemandM3;
    private Double availableSupplyM3;
    private Double deficitSurplusM3;

    // Evaluation
    private String balanceStatus; // SUFFICIENT_ESTIMATED, POSSIBLE_SHORTAGE, DATA_INSUFFICIENT
    private List<String> agronomicAssumptions;
    private List<String> waterConservationRecommendations;
    private List<String> warnings;

    public WaterBudgetResponse() {
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

    public Double getAreaAcres() {
        return areaAcres;
    }

    public void setAreaAcres(Double areaAcres) {
        this.areaAcres = areaAcres;
    }

    public Double getAreaHectares() {
        return areaHectares;
    }

    public void setAreaHectares(Double areaHectares) {
        this.areaHectares = areaHectares;
    }

    public String getIrrigationMethod() {
        return irrigationMethod;
    }

    public void setIrrigationMethod(String irrigationMethod) {
        this.irrigationMethod = irrigationMethod;
    }

    public Double getIrrigationEfficiencyPercent() {
        return irrigationEfficiencyPercent;
    }

    public void setIrrigationEfficiencyPercent(Double irrigationEfficiencyPercent) {
        this.irrigationEfficiencyPercent = irrigationEfficiencyPercent;
    }

    public Double getCropWaterDemandMm() {
        return cropWaterDemandMm;
    }

    public void setCropWaterDemandMm(Double cropWaterDemandMm) {
        this.cropWaterDemandMm = cropWaterDemandMm;
    }

    public Double getEstimatedRainfallMm() {
        return estimatedRainfallMm;
    }

    public void setEstimatedRainfallMm(Double estimatedRainfallMm) {
        this.estimatedRainfallMm = estimatedRainfallMm;
    }

    public Double getEffectiveRainfallMm() {
        return effectiveRainfallMm;
    }

    public void setEffectiveRainfallMm(Double effectiveRainfallMm) {
        this.effectiveRainfallMm = effectiveRainfallMm;
    }

    public Double getNetIrrigationDemandMm() {
        return netIrrigationDemandMm;
    }

    public void setNetIrrigationDemandMm(Double netIrrigationDemandMm) {
        this.netIrrigationDemandMm = netIrrigationDemandMm;
    }

    public Double getGrossIrrigationDemandMm() {
        return grossIrrigationDemandMm;
    }

    public void setGrossIrrigationDemandMm(Double grossIrrigationDemandMm) {
        this.grossIrrigationDemandMm = grossIrrigationDemandMm;
    }

    public Double getTotalCropDemandM3() {
        return totalCropDemandM3;
    }

    public void setTotalCropDemandM3(Double totalCropDemandM3) {
        this.totalCropDemandM3 = totalCropDemandM3;
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

    public List<String> getAgronomicAssumptions() {
        return agronomicAssumptions;
    }

    public void setAgronomicAssumptions(List<String> agronomicAssumptions) {
        this.agronomicAssumptions = agronomicAssumptions;
    }

    public List<String> getWaterConservationRecommendations() {
        return waterConservationRecommendations;
    }

    public void setWaterConservationRecommendations(List<String> waterConservationRecommendations) {
        this.waterConservationRecommendations = waterConservationRecommendations;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }
}
