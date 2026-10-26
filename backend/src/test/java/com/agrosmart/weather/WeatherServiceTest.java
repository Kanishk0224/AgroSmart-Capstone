package com.agrosmart.weather;

import com.agrosmart.model.Farm;
import com.agrosmart.repository.FarmRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class WeatherServiceTest {

    private WeatherProvider weatherProvider;
    private FarmRepository farmRepository;
    private WeatherService weatherService;

    @BeforeEach
    public void setup() {
        weatherProvider = Mockito.mock(WeatherProvider.class);
        farmRepository = Mockito.mock(FarmRepository.class);
        weatherService = new WeatherService(weatherProvider, farmRepository);
    }

    @Test
    public void testHeavyRainfallTriggersIrrigationSuspensionAdvisory() {
        Farm farm = new Farm();
        farm.setId("farm-1");
        farm.setUserId("user-1");
        farm.setName("Green Valley");
        when(farmRepository.findById("farm-1")).thenReturn(farm);

        WeatherResponse weather = new WeatherResponse();
        weather.setFarmId("farm-1");
        weather.setCurrentTemperatureCelsius(26.0);
        weather.setCurrentWindSpeedKmh(10.0);
        weather.setCurrentRelativeHumidityPercent(70.0);
        weather.setDailyForecasts(Arrays.asList(
                new WeatherResponse.DailyForecast("2026-10-12", 28.0, 20.0, 80.0, 25.0, "Rain"),
                new WeatherResponse.DailyForecast("2026-10-13", 27.0, 19.0, 70.0, 15.0, "Rain")
        ));
        when(weatherProvider.getWeatherDataForFarm(any(Farm.class))).thenReturn(weather);

        List<WeatherAdvisory> advisories = weatherService.getAdvisoriesForFarm("farm-1", "user-1");
        assertNotNull(advisories);
        assertTrue(advisories.stream().anyMatch(a -> a.getTitle().contains("Suspend Irrigation")));
    }

    @Test
    public void testHighWindTriggersSprayAdvisory() {
        Farm farm = new Farm();
        farm.setId("farm-1");
        farm.setUserId("user-1");
        when(farmRepository.findById("farm-1")).thenReturn(farm);

        WeatherResponse weather = new WeatherResponse();
        weather.setFarmId("farm-1");
        weather.setCurrentTemperatureCelsius(24.0);
        weather.setCurrentWindSpeedKmh(26.5); // High wind
        weather.setCurrentRelativeHumidityPercent(60.0);
        weather.setDailyForecasts(Arrays.asList(
                new WeatherResponse.DailyForecast("2026-10-12", 26.0, 18.0, 10.0, 0.0, "Clear")
        ));
        when(weatherProvider.getWeatherDataForFarm(any(Farm.class))).thenReturn(weather);

        List<WeatherAdvisory> advisories = weatherService.getAdvisoriesForFarm("farm-1", "user-1");
        assertTrue(advisories.stream().anyMatch(a -> a.getTitle().contains("Postpone Foliar Spraying")));
    }
}
