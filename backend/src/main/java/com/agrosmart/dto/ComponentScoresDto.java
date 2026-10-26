package com.agrosmart.dto;

import java.io.Serializable;

public class ComponentScoresDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private int soil;
    private int climate;
    private int water;
    private int season;
    private int rotation;

    public ComponentScoresDto() {
    }

    public ComponentScoresDto(int soil, int climate, int water, int season, int rotation) {
        this.soil = soil;
        this.climate = climate;
        this.water = water;
        this.season = season;
        this.rotation = rotation;
    }

    public int getSoil() {
        return soil;
    }

    public void setSoil(int soil) {
        this.soil = soil;
    }

    public int getClimate() {
        return climate;
    }

    public void setClimate(int climate) {
        this.climate = climate;
    }

    public int getWater() {
        return water;
    }

    public void setWater(int water) {
        this.water = water;
    }

    public int getSeason() {
        return season;
    }

    public void setSeason(int season) {
        this.season = season;
    }

    public int getRotation() {
        return rotation;
    }

    public void setRotation(int rotation) {
        this.rotation = rotation;
    }
}
