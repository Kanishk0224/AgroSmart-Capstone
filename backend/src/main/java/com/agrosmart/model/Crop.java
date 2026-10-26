package com.agrosmart.model;

import java.io.Serializable;
import java.util.List;

public class Crop implements Serializable {
    private static final long serialVersionUID = 1L;

    private String cropId;
    private String cropName;
    private String scientificName;
    private CropCategory category;
    private List<String> suitableSoilTypes;
    private Double minimumSuitablePH;
    private Double maximumSuitablePH;

    // Nutrient demands (kg/ha)
    private Double minNitrogenKgPerHa;
    private Double maxNitrogenKgPerHa;
    private Double minPhosphorusKgPerHa;
    private Double maxPhosphorusKgPerHa;
    private Double minPotassiumKgPerHa;
    private Double maxPotassiumKgPerHa;

    // Climate parameters
    private Double minTemperatureCelsius;
    private Double maxTemperatureCelsius;
    private Double minRainfallMm;
    private Double maxRainfallMm;

    // Seasonal & Water requirement
    private List<CropSeason> suitableSeasons;
    private Double waterRequirementMm; // mm per season
    private String waterRequirementUnit; // "MM_PER_SEASON"
    private Integer growingDurationDaysMin;
    private Integer growingDurationDaysMax;

    // Rotation parameters
    private String botanicalFamily;
    private Boolean nitrogenFixer;
    private Boolean deepRooted;
    private List<String> goodFollowers;
    private List<String> badFollowers;

    // Provenance & Metadata
    private String sourceReferences;
    private String sourceUpdatedAt;
    private DataConfidence dataConfidence;
    private String description;

    public Crop() {
        this.waterRequirementUnit = "MM_PER_SEASON";
        this.dataConfidence = DataConfidence.HIGH;
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

    public CropCategory getCategory() {
        return category;
    }

    public void setCategory(CropCategory category) {
        this.category = category;
    }

    public List<String> getSuitableSoilTypes() {
        return suitableSoilTypes;
    }

    public void setSuitableSoilTypes(List<String> suitableSoilTypes) {
        this.suitableSoilTypes = suitableSoilTypes;
    }

    public Double getMinimumSuitablePH() {
        return minimumSuitablePH;
    }

    public void setMinimumSuitablePH(Double minimumSuitablePH) {
        this.minimumSuitablePH = minimumSuitablePH;
    }

    public Double getMaximumSuitablePH() {
        return maximumSuitablePH;
    }

    public void setMaximumSuitablePH(Double maximumSuitablePH) {
        this.maximumSuitablePH = maximumSuitablePH;
    }

    public Double getMinNitrogenKgPerHa() {
        return minNitrogenKgPerHa;
    }

    public void setMinNitrogenKgPerHa(Double minNitrogenKgPerHa) {
        this.minNitrogenKgPerHa = minNitrogenKgPerHa;
    }

    public Double getMaxNitrogenKgPerHa() {
        return maxNitrogenKgPerHa;
    }

    public void setMaxNitrogenKgPerHa(Double maxNitrogenKgPerHa) {
        this.maxNitrogenKgPerHa = maxNitrogenKgPerHa;
    }

    public Double getMinPhosphorusKgPerHa() {
        return minPhosphorusKgPerHa;
    }

    public void setMinPhosphorusKgPerHa(Double minPhosphorusKgPerHa) {
        this.minPhosphorusKgPerHa = minPhosphorusKgPerHa;
    }

    public Double getMaxPhosphorusKgPerHa() {
        return maxPhosphorusKgPerHa;
    }

    public void setMaxPhosphorusKgPerHa(Double maxPhosphorusKgPerHa) {
        this.maxPhosphorusKgPerHa = maxPhosphorusKgPerHa;
    }

    public Double getMinPotassiumKgPerHa() {
        return minPotassiumKgPerHa;
    }

    public void setMinPotassiumKgPerHa(Double minPotassiumKgPerHa) {
        this.minPotassiumKgPerHa = minPotassiumKgPerHa;
    }

    public Double getMaxPotassiumKgPerHa() {
        return maxPotassiumKgPerHa;
    }

    public void setMaxPotassiumKgPerHa(Double maxPotassiumKgPerHa) {
        this.maxPotassiumKgPerHa = maxPotassiumKgPerHa;
    }

    public Double getMinTemperatureCelsius() {
        return minTemperatureCelsius;
    }

    public void setMinTemperatureCelsius(Double minTemperatureCelsius) {
        this.minTemperatureCelsius = minTemperatureCelsius;
    }

    public Double getMaxTemperatureCelsius() {
        return maxTemperatureCelsius;
    }

    public void setMaxTemperatureCelsius(Double maxTemperatureCelsius) {
        this.maxTemperatureCelsius = maxTemperatureCelsius;
    }

    public Double getMinRainfallMm() {
        return minRainfallMm;
    }

    public void setMinRainfallMm(Double minRainfallMm) {
        this.minRainfallMm = minRainfallMm;
    }

    public Double getMaxRainfallMm() {
        return maxRainfallMm;
    }

    public void setMaxRainfallMm(Double maxRainfallMm) {
        this.maxRainfallMm = maxRainfallMm;
    }

    public List<CropSeason> getSuitableSeasons() {
        return suitableSeasons;
    }

    public void setSuitableSeasons(List<CropSeason> suitableSeasons) {
        this.suitableSeasons = suitableSeasons;
    }

    public Double getWaterRequirementMm() {
        return waterRequirementMm;
    }

    public void setWaterRequirementMm(Double waterRequirementMm) {
        this.waterRequirementMm = waterRequirementMm;
    }

    public String getWaterRequirementUnit() {
        return waterRequirementUnit;
    }

    public void setWaterRequirementUnit(String waterRequirementUnit) {
        this.waterRequirementUnit = waterRequirementUnit;
    }

    public Integer getGrowingDurationDaysMin() {
        return growingDurationDaysMin;
    }

    public void setGrowingDurationDaysMin(Integer growingDurationDaysMin) {
        this.growingDurationDaysMin = growingDurationDaysMin;
    }

    public Integer getGrowingDurationDaysMax() {
        return growingDurationDaysMax;
    }

    public void setGrowingDurationDaysMax(Integer growingDurationDaysMax) {
        this.growingDurationDaysMax = growingDurationDaysMax;
    }

    public String getBotanicalFamily() {
        return botanicalFamily;
    }

    public void setBotanicalFamily(String botanicalFamily) {
        this.botanicalFamily = botanicalFamily;
    }

    public Boolean getNitrogenFixer() {
        return nitrogenFixer;
    }

    public void setNitrogenFixer(Boolean nitrogenFixer) {
        this.nitrogenFixer = nitrogenFixer;
    }

    public Boolean getDeepRooted() {
        return deepRooted;
    }

    public void setDeepRooted(Boolean deepRooted) {
        this.deepRooted = deepRooted;
    }

    public List<String> getGoodFollowers() {
        return goodFollowers;
    }

    public void setGoodFollowers(List<String> goodFollowers) {
        this.goodFollowers = goodFollowers;
    }

    public List<String> getBadFollowers() {
        return badFollowers;
    }

    public void setBadFollowers(List<String> badFollowers) {
        this.badFollowers = badFollowers;
    }

    public String getSourceReferences() {
        return sourceReferences;
    }

    public void setSourceReferences(String sourceReferences) {
        this.sourceReferences = sourceReferences;
    }

    public String getSourceUpdatedAt() {
        return sourceUpdatedAt;
    }

    public void setSourceUpdatedAt(String sourceUpdatedAt) {
        this.sourceUpdatedAt = sourceUpdatedAt;
    }

    public DataConfidence getDataConfidence() {
        return dataConfidence;
    }

    public void setDataConfidence(DataConfidence dataConfidence) {
        this.dataConfidence = dataConfidence;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
