package com.agrosmart.dto;

import java.io.Serializable;
import java.util.List;

public class DashboardSummaryDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private int totalFarms;
    private double totalAcres;
    private int totalSoilTests;
    private double averagePh;
    private int optimalSoilPercent;
    private int deficientTestsCount;
    private List<FarmResponse> recentFarms;
    private List<SoilTestResponse> recentSoilTests;

    public DashboardSummaryDto() {
    }

    public int getTotalFarms() {
        return totalFarms;
    }

    public void setTotalFarms(int totalFarms) {
        this.totalFarms = totalFarms;
    }

    public double getTotalAcres() {
        return totalAcres;
    }

    public void setTotalAcres(double totalAcres) {
        this.totalAcres = totalAcres;
    }

    public int getTotalSoilTests() {
        return totalSoilTests;
    }

    public void setTotalSoilTests(int totalSoilTests) {
        this.totalSoilTests = totalSoilTests;
    }

    public double getAveragePh() {
        return averagePh;
    }

    public void setAveragePh(double averagePh) {
        this.averagePh = averagePh;
    }

    public int getOptimalSoilPercent() {
        return optimalSoilPercent;
    }

    public void setOptimalSoilPercent(int optimalSoilPercent) {
        this.optimalSoilPercent = optimalSoilPercent;
    }

    public int getDeficientTestsCount() {
        return deficientTestsCount;
    }

    public void setDeficientTestsCount(int deficientTestsCount) {
        this.deficientTestsCount = deficientTestsCount;
    }

    public List<FarmResponse> getRecentFarms() {
        return recentFarms;
    }

    public void setRecentFarms(List<FarmResponse> recentFarms) {
        this.recentFarms = recentFarms;
    }

    public List<SoilTestResponse> getRecentSoilTests() {
        return recentSoilTests;
    }

    public void setRecentSoilTests(List<SoilTestResponse> recentSoilTests) {
        this.recentSoilTests = recentSoilTests;
    }
}
