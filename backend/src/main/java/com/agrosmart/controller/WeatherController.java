package com.agrosmart.controller;

import com.agrosmart.dto.ApiResponse;
import com.agrosmart.security.SecurityUser;
import com.agrosmart.weather.WeatherAdvisory;
import com.agrosmart.weather.WeatherResponse;
import com.agrosmart.weather.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/weather")
public class WeatherController {

    private final WeatherService weatherService;

    @Autowired
    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("/farm/{farmId}")
    public ApiResponse<WeatherResponse> getFarmWeather(
            @PathVariable("farmId") String farmId,
            @AuthenticationPrincipal SecurityUser user) {
        WeatherResponse weather = weatherService.getWeatherForFarm(farmId, user.getUid());
        return ApiResponse.ok("Weather telemetry retrieved successfully", weather);
    }

    @GetMapping("/advisories/{farmId}")
    public ApiResponse<List<WeatherAdvisory>> getFarmAdvisories(
            @PathVariable("farmId") String farmId,
            @AuthenticationPrincipal SecurityUser user) {
        List<WeatherAdvisory> advisories = weatherService.getAdvisoriesForFarm(farmId, user.getUid());
        return ApiResponse.ok("Agro-climatic advisories generated successfully", advisories);
    }
}
