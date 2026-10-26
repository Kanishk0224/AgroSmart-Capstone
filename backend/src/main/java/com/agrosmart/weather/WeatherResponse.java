package com.agrosmart.weather;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class WeatherResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    private String farmId;
    private String farmName;
    private String location;
    private double latitude;
    private double longitude;
    private String provider;
    private String observationTime;
    private String retrievalTime;
    private String dataFreshness; // FRESH, CACHED, STALE
    private double currentTemperatureCelsius;
    private double currentRelativeHumidityPercent;
    private double currentWindSpeedKmh;
    private double currentPrecipitationMm;
    private String currentCondition;
    private List<DailyForecast> dailyForecasts = new ArrayList<DailyForecast>();

    public static class DailyForecast implements Serializable {
        private static final long serialVersionUID = 1L;
        private String date;
        private double maxTempCelsius;
        private double minTempCelsius;
        private double precipitationProbabilityPercent;
        private double precipitationSumMm;
        private String condition;

        public DailyForecast() {}

        public DailyForecast(String date, double maxTemp, double minTemp, double pop, double precip, String condition) {
            this.date = date;
            this.maxTempCelsius = maxTemp;
            this.minTempCelsius = minTemp;
            this.precipitationProbabilityPercent = pop;
            this.precipitationSumMm = precip;
            this.condition = condition;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public double getMaxTempCelsius() {
            return maxTempCelsius;
        }

        public void setMaxTempCelsius(double maxTempCelsius) {
            this.maxTempCelsius = maxTempCelsius;
        }

        public double getMinTempCelsius() {
            return minTempCelsius;
        }

        public void setMinTempCelsius(double minTempCelsius) {
            this.minTempCelsius = minTempCelsius;
        }

        public double getPrecipitationProbabilityPercent() {
            return precipitationProbabilityPercent;
        }

        public void setPrecipitationProbabilityPercent(double precipitationProbabilityPercent) {
            this.precipitationProbabilityPercent = precipitationProbabilityPercent;
        }

        public double getPrecipitationSumMm() {
            return precipitationSumMm;
        }

        public void setPrecipitationSumMm(double precipitationSumMm) {
            this.precipitationSumMm = precipitationSumMm;
        }

        public String getCondition() {
            return condition;
        }

        public void setCondition(String condition) {
            this.condition = condition;
        }
    }

    public WeatherResponse() {
        this.provider = "Open-Meteo High-Resolution WMO API";
        this.dataFreshness = "FRESH";
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getObservationTime() {
        return observationTime;
    }

    public void setObservationTime(String observationTime) {
        this.observationTime = observationTime;
    }

    public String getRetrievalTime() {
        return retrievalTime;
    }

    public void setRetrievalTime(String retrievalTime) {
        this.retrievalTime = retrievalTime;
    }

    public String getDataFreshness() {
        return dataFreshness;
    }

    public void setDataFreshness(String dataFreshness) {
        this.dataFreshness = dataFreshness;
    }

    public double getCurrentTemperatureCelsius() {
        return currentTemperatureCelsius;
    }

    public void setCurrentTemperatureCelsius(double currentTemperatureCelsius) {
        this.currentTemperatureCelsius = currentTemperatureCelsius;
    }

    public double getCurrentRelativeHumidityPercent() {
        return currentRelativeHumidityPercent;
    }

    public void setCurrentRelativeHumidityPercent(double currentRelativeHumidityPercent) {
        this.currentRelativeHumidityPercent = currentRelativeHumidityPercent;
    }

    public double getCurrentWindSpeedKmh() {
        return currentWindSpeedKmh;
    }

    public void setCurrentWindSpeedKmh(double currentWindSpeedKmh) {
        this.currentWindSpeedKmh = currentWindSpeedKmh;
    }

    public double getCurrentPrecipitationMm() {
        return currentPrecipitationMm;
    }

    public void setCurrentPrecipitationMm(double currentPrecipitationMm) {
        this.currentPrecipitationMm = currentPrecipitationMm;
    }

    public String getCurrentCondition() {
        return currentCondition;
    }

    public void setCurrentCondition(String currentCondition) {
        this.currentCondition = currentCondition;
    }

    public List<DailyForecast> getDailyForecasts() {
        return dailyForecasts;
    }

    public void setDailyForecasts(List<DailyForecast> dailyForecasts) {
        this.dailyForecasts = dailyForecasts;
    }
}
