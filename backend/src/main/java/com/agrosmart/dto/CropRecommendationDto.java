package com.agrosmart.dto;

import com.agrosmart.model.DataConfidence;
import java.io.Serializable;
import java.util.List;

public class CropRecommendationDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private String cropId;
    private String cropName;
    private String scientificName;
    private String category;
    private int suitabilityScore; // 0 - 100
    private ComponentScoresDto componentScores;
    private SustainabilityScoreDto sustainability;
    private List<String> reasons;
    private List<String> warnings;
    private String dataCompleteness; // COMPLETE, PARTIAL, MINIMAL
    private boolean criticalConstraintFailed;
    private String failureReason;
    private Double estimatedWaterNeedMm;
    private Integer estimatedDurationDays;
    private String sourceReferences;
    private DataConfidence dataConfidence;

    public CropRecommendationDto() {
    }

    public String getCropId() {
        return cropId;
    }

    public void setCropId(String cropId) {
        this.cropId = cropId;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getScientificName() {
        return scientificName;
    }

    public void setScientificName(String scientificName) {
        this.scientificName = scientificName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getSuitabilityScore() {
        return suitabilityScore;
    }

    public void setSuitabilityScore(int suitabilityScore) {
        this.suitabilityScore = suitabilityScore;
    }

    public ComponentScoresDto getComponentScores() {
        return componentScores;
    }

    public void setComponentScores(ComponentScoresDto componentScores) {
        this.componentScores = componentScores;
    }

    public SustainabilityScoreDto getSustainability() {
        return sustainability;
    }

    public void setSustainability(SustainabilityScoreDto sustainability) {
        this.sustainability = sustainability;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }

    public String getDataCompleteness() {
        return dataCompleteness;
    }

    public void setDataCompleteness(String dataCompleteness) {
        this.dataCompleteness = dataCompleteness;
    }

    public boolean isCriticalConstraintFailed() {
        return criticalConstraintFailed;
    }

    public void setCriticalConstraintFailed(boolean criticalConstraintFailed) {
        this.criticalConstraintFailed = criticalConstraintFailed;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public Double getEstimatedWaterNeedMm() {
        return estimatedWaterNeedMm;
    }

    public void setEstimatedWaterNeedMm(Double estimatedWaterNeedMm) {
        this.estimatedWaterNeedMm = estimatedWaterNeedMm;
    }

    public Integer getEstimatedDurationDays() {
        return estimatedDurationDays;
    }

    public void setEstimatedDurationDays(Integer estimatedDurationDays) {
        this.estimatedDurationDays = estimatedDurationDays;
    }

    public String getSourceReferences() {
        return sourceReferences;
    }

    public void setSourceReferences(String sourceReferences) {
        this.sourceReferences = sourceReferences;
    }

    public DataConfidence getDataConfidence() {
        return dataConfidence;
    }

    public void setDataConfidence(DataConfidence dataConfidence) {
        this.dataConfidence = dataConfidence;
    }
}
