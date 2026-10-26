package com.agrosmart.dto;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public class ProfitabilityResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String farmId;
    private String cropName;
    private Double areaAcres;

    // Costs
    private Double seedCost;
    private Double fertilizerCost;
    private Double labourCost;
    private Double irrigationCost;
    private Double equipmentCost;
    private Double otherCosts;
    private Double totalCost;
    private Double costPerAcre;

    // Production & Revenue
    private Double expectedYieldPerAcre;
    private String yieldUnit;
    private Double expectedTotalYield;
    private Double expectedSellingPricePerUnit;
    private Double estimatedRevenue;
    private Double estimatedProfit;
    private Double profitPerAcre;
    private Double returnOnInvestmentPercent; // (Profit / Cost) * 100
    private Double breakEvenPricePerUnit;
    private String currency;

    private Map<String, Double> costBreakdownPercent;
    private List<String> financialAssumptions;
    private List<String> riskFactors;

    public ProfitabilityResponse() {
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

    public Double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }

    public Double getCostPerAcre() {
        return costPerAcre;
    }

    public void setCostPerAcre(Double costPerAcre) {
        this.costPerAcre = costPerAcre;
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

    public Double getExpectedTotalYield() {
        return expectedTotalYield;
    }

    public void setExpectedTotalYield(Double expectedTotalYield) {
        this.expectedTotalYield = expectedTotalYield;
    }

    public Double getExpectedSellingPricePerUnit() {
        return expectedSellingPricePerUnit;
    }

    public void setExpectedSellingPricePerUnit(Double expectedSellingPricePerUnit) {
        this.expectedSellingPricePerUnit = expectedSellingPricePerUnit;
    }

    public Double getEstimatedRevenue() {
        return estimatedRevenue;
    }

    public void setEstimatedRevenue(Double estimatedRevenue) {
        this.estimatedRevenue = estimatedRevenue;
    }

    public Double getEstimatedProfit() {
        return estimatedProfit;
    }

    public void setEstimatedProfit(Double estimatedProfit) {
        this.estimatedProfit = estimatedProfit;
    }

    public Double getProfitPerAcre() {
        return profitPerAcre;
    }

    public void setProfitPerAcre(Double profitPerAcre) {
        this.profitPerAcre = profitPerAcre;
    }

    public Double getReturnOnInvestmentPercent() {
        return returnOnInvestmentPercent;
    }

    public void setReturnOnInvestmentPercent(Double returnOnInvestmentPercent) {
        this.returnOnInvestmentPercent = returnOnInvestmentPercent;
    }

    public Double getBreakEvenPricePerUnit() {
        return breakEvenPricePerUnit;
    }

    public void setBreakEvenPricePerUnit(Double breakEvenPricePerUnit) {
        this.breakEvenPricePerUnit = breakEvenPricePerUnit;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Map<String, Double> getCostBreakdownPercent() {
        return costBreakdownPercent;
    }

    public void setCostBreakdownPercent(Map<String, Double> costBreakdownPercent) {
        this.costBreakdownPercent = costBreakdownPercent;
    }

    public List<String> getFinancialAssumptions() {
        return financialAssumptions;
    }

    public void setFinancialAssumptions(List<String> financialAssumptions) {
        this.financialAssumptions = financialAssumptions;
    }

    public List<String> getRiskFactors() {
        return riskFactors;
    }

    public void setRiskFactors(List<String> riskFactors) {
        this.riskFactors = riskFactors;
    }
}
