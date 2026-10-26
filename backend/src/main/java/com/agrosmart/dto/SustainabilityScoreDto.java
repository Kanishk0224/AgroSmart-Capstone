package com.agrosmart.dto;

import java.io.Serializable;
import java.util.List;

public class SustainabilityScoreDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private int overallScore; // 0 - 100
    private int waterConservationIndex; // 0 - 100
    private int soilPreservationIndex; // 0 - 100
    private int nutrientBalanceIndex; // 0 - 100
    private int biodiversityRotationIndex; // 0 - 100
    private List<String> sustainabilityHighlights;
    private List<String> environmentalWarnings;
    private String scoringVersion;

    public SustainabilityScoreDto() {
        this.scoringVersion = "2.0";
    }

    public int getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(int overallScore) {
        this.overallScore = overallScore;
    }

    public int getWaterConservationIndex() {
        return waterConservationIndex;
    }

    public void setWaterConservationIndex(int waterConservationIndex) {
        this.waterConservationIndex = waterConservationIndex;
    }

    public int getSoilPreservationIndex() {
        return soilPreservationIndex;
    }

    public void setSoilPreservationIndex(int soilPreservationIndex) {
        this.soilPreservationIndex = soilPreservationIndex;
    }

    public int getNutrientBalanceIndex() {
        return nutrientBalanceIndex;
    }

    public void setNutrientBalanceIndex(int nutrientBalanceIndex) {
        this.nutrientBalanceIndex = nutrientBalanceIndex;
    }

    public int getBiodiversityRotationIndex() {
        return biodiversityRotationIndex;
    }

    public void setBiodiversityRotationIndex(int biodiversityRotationIndex) {
        this.biodiversityRotationIndex = biodiversityRotationIndex;
    }

    public List<String> getSustainabilityHighlights() {
        return sustainabilityHighlights;
    }

    public void setSustainabilityHighlights(List<String> sustainabilityHighlights) {
        this.sustainabilityHighlights = sustainabilityHighlights;
    }

    public List<String> getEnvironmentalWarnings() {
        return environmentalWarnings;
    }

    public void setEnvironmentalWarnings(List<String> environmentalWarnings) {
        this.environmentalWarnings = environmentalWarnings;
    }

    public String getScoringVersion() {
        return scoringVersion;
    }

    public void setScoringVersion(String scoringVersion) {
        this.scoringVersion = scoringVersion;
    }
}
