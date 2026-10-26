package com.agrosmart.weather;

import com.agrosmart.model.Farm;

public interface WeatherProvider {
    WeatherResponse getWeatherDataForFarm(Farm farm);
    String getProviderName();
}
