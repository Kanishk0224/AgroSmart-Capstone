package com.agrosmart.dto;

import java.io.Serializable;
import java.util.List;

public class RecommendationResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String farmId;
    private String farmName;
    private String season;
    private String scoreVersion;
    private List<CropRecommendationDto> topRecommendations;
    private List<CropRecommendationDto> otherCandidates;
    private List<String> globalWarnings;
    private List<String> missingDataNotices;
    private String scoreMethodologyExplanation;
    private String createdAt;
    private MlPredictionResponse mlPrediction;
    private String mlConflictNotice;

    public RecommendationResponse() {
        this.scoreVersion = "3.0";
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

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public String getScoreVersion() {
        return scoreVersion;
    }

    public void setScoreVersion(String scoreVersion) {
        this.scoreVersion = scoreVersion;
    }

    public List<CropRecommendationDto> getTopRecommendations() {
        return topRecommendations;
    }

    public void setTopRecommendations(List<CropRecommendationDto> topRecommendations) {
        this.topRecommendations = topRecommendations;
    }

    public List<CropRecommendationDto> getOtherCandidates() {
        return otherCandidates;
    }

    public void setOtherCandidates(List<CropRecommendationDto> otherCandidates) {
        this.otherCandidates = otherCandidates;
    }

    public List<String> getGlobalWarnings() {
        return globalWarnings;
    }

    public void setGlobalWarnings(List<String> globalWarnings) {
        this.globalWarnings = globalWarnings;
    }

    public List<String> getMissingDataNotices() {
        return missingDataNotices;
    }

    public void setMissingDataNotices(List<String> missingDataNotices) {
        this.missingDataNotices = missingDataNotices;
    }

    public String getScoreMethodologyExplanation() {
        return scoreMethodologyExplanation;
    }

    public void setScoreMethodologyExplanation(String scoreMethodologyExplanation) {
        this.scoreMethodologyExplanation = scoreMethodologyExplanation;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public MlPredictionResponse getMlPrediction() {
        return mlPrediction;
    }

    public void setMlPrediction(MlPredictionResponse mlPrediction) {
        this.mlPrediction = mlPrediction;
    }

    public String getMlConflictNotice() {
        return mlConflictNotice;
    }

    public void setMlConflictNotice(String mlConflictNotice) {
        this.mlConflictNotice = mlConflictNotice;
    }
}
