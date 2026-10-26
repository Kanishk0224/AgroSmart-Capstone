package com.agrosmart.weather;

import java.io.Serializable;

public class WeatherAdvisory implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String farmId;
    private String title;
    private String description;
    private String severity; // INFO, ADVISORY, WARNING, URGENT
    private String category; // IRRIGATION, SPRAY_WINDOW, THERMAL_STRESS, HARVEST_WINDOW
    private String forecastPeriod;
    private String dataSource;
    private String createdAt;
    private String expiresAt;
    private boolean isActionRequired;

    public WeatherAdvisory() {}

    public WeatherAdvisory(String id, String farmId, String title, String description, String severity,
                           String category, String forecastPeriod, String dataSource, String createdAt, String expiresAt, boolean actionRequired) {
        this.id = id;
        this.farmId = farmId;
        this.title = title;
        this.description = description;
        this.severity = severity;
        this.category = category;
        this.forecastPeriod = forecastPeriod;
        this.dataSource = dataSource;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.isActionRequired = actionRequired;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getForecastPeriod() {
        return forecastPeriod;
    }

    public void setForecastPeriod(String forecastPeriod) {
        this.forecastPeriod = forecastPeriod;
    }

    public String getDataSource() {
        return dataSource;
    }

    public void setDataSource(String dataSource) {
        this.dataSource = dataSource;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }

    public boolean isActionRequired() {
        return isActionRequired;
    }

    public void setActionRequired(boolean actionRequired) {
        isActionRequired = actionRequired;
    }
}
