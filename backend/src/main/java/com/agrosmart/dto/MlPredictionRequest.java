package com.agrosmart.dto;

import java.io.Serializable;

public class MlPredictionRequest implements Serializable {
    private static final long serialVersionUID = 1L;

    private double n;
    private double p;
    private double k;
    private double temperature;
    private double humidity;
    private double ph;
    private double rainfall;

    public MlPredictionRequest() {
        this.humidity = 65.0;
    }

    public MlPredictionRequest(double n, double p, double k, double temperature, double humidity, double ph, double rainfall) {
        this.n = n;
        this.p = p;
        this.k = k;
        this.temperature = temperature;
        this.humidity = humidity;
        this.ph = ph;
        this.rainfall = rainfall;
    }

    public double getN() {
        return n;
    }

    public void setN(double n) {
        this.n = n;
    }

    public double getP() {
        return p;
    }

    public void setP(double p) {
        this.p = p;
    }

    public double getK() {
        return k;
    }

    public void setK(double k) {
        this.k = k;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public double getHumidity() {
        return humidity;
    }

    public void setHumidity(double humidity) {
        this.humidity = humidity;
    }

    public double getPh() {
        return ph;
    }

    public void setPh(double ph) {
        this.ph = ph;
    }

    public double getRainfall() {
        return rainfall;
    }

    public void setRainfall(double rainfall) {
        this.rainfall = rainfall;
    }
}
