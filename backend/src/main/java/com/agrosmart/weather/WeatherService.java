package com.agrosmart.weather;

import com.agrosmart.exception.ResourceNotFoundException;
import com.agrosmart.exception.UnauthorizedException;
import com.agrosmart.model.Farm;
import com.agrosmart.repository.FarmRepository;
import com.agrosmart.util.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class WeatherService {

    private final WeatherProvider weatherProvider;
    private final FarmRepository farmRepository;

    @Autowired
    public WeatherService(WeatherProvider weatherProvider, FarmRepository farmRepository) {
        this.weatherProvider = weatherProvider;
        this.farmRepository = farmRepository;
    }

    public WeatherResponse getWeatherForFarm(String farmId, String userId) {
        Farm farm = verifyFarmOwnership(farmId, userId);
        return weatherProvider.getWeatherDataForFarm(farm);
    }

    public List<WeatherAdvisory> getAdvisoriesForFarm(String farmId, String userId) {
        Farm farm = verifyFarmOwnership(farmId, userId);
        WeatherResponse weather = weatherProvider.getWeatherDataForFarm(farm);

        List<WeatherAdvisory> advisories = new ArrayList<WeatherAdvisory>();
        String now = DateUtils.nowIso();
        long nextDay = System.currentTimeMillis() + 24 * 3600 * 1000L;
        String tomorrow = DateUtils.formatDate(new Date(nextDay));

        // 1. Irrigation & Rain Advisory
        double upcomingRain = 0.0;
        for (WeatherResponse.DailyForecast df : weather.getDailyForecasts()) {
            upcomingRain += df.getPrecipitationSumMm();
        }

        if (upcomingRain > 15.0) {
            advisories.add(new WeatherAdvisory(
                    "adv-rain-" + UUID.randomUUID().toString().substring(0, 6),
                    farmId,
                    "Heavy Rainfall Approaching: Suspend Irrigation",
                    String.format("Cumulative rainfall of %.1f mm projected over the next 7 days. Defer surface and drip irrigation to prevent root hypoxia and nitrogen leaching.", upcomingRain),
                    "WARNING",
                    "IRRIGATION",
                    "Next 7 Days",
                    weather.getProvider(),
                    now,
                    tomorrow,
                    true
            ));
        } else if (upcomingRain < 2.0 && weather.getCurrentTemperatureCelsius() > 30.0) {
            advisories.add(new WeatherAdvisory(
                    "adv-dry-" + UUID.randomUUID().toString().substring(0, 6),
                    farmId,
                    "Dry Spell Advisory: Conserve Soil Moisture",
                    "Minimal precipitation forecast for next 5-7 days under warm conditions. Apply organic mulch and prioritize evening drip cycles.",
                    "ADVISORY",
                    "IRRIGATION",
                    "Next 5-7 Days",
                    weather.getProvider(),
                    now,
                    tomorrow,
                    false
            ));
        }

        // 2. Wind & Spray Window
        if (weather.getCurrentWindSpeedKmh() > 20.0) {
            advisories.add(new WeatherAdvisory(
                    "adv-wind-" + UUID.randomUUID().toString().substring(0, 6),
                    farmId,
                    "High Wind Speed: Postpone Foliar Spraying",
                    String.format("Current wind speed is %.1f km/h. Avoid pesticide and foliar micronutrient spraying to prevent chemical drift away from target foliage.", weather.getCurrentWindSpeedKmh()),
                    "WARNING",
                    "SPRAY_WINDOW",
                    "Current Window",
                    weather.getProvider(),
                    now,
                    tomorrow,
                    true
            ));
        } else {
            advisories.add(new WeatherAdvisory(
                    "adv-spray-" + UUID.randomUUID().toString().substring(0, 6),
                    farmId,
                    "Optimal Chemical Spray Window Open",
                    String.format("Mild wind (%.1f km/h) and moderate temperature create favorable conditions for planned biological or foliar sprays.", weather.getCurrentWindSpeedKmh()),
                    "INFO",
                    "SPRAY_WINDOW",
                    "Today",
                    weather.getProvider(),
                    now,
                    tomorrow,
                    false
            ));
        }

        // 3. Thermal Stress Check
        if (weather.getCurrentTemperatureCelsius() > 35.0) {
            advisories.add(new WeatherAdvisory(
                    "adv-heat-" + UUID.randomUUID().toString().substring(0, 6),
                    farmId,
                    "Elevated Heat Stress Alert",
                    String.format("Ambient temperature (%.1f°C) is above physiological comfort threshold for sensitive crops. Ensure adequate soil water availability to avoid floral drop.", weather.getCurrentTemperatureCelsius()),
                    "WARNING",
                    "THERMAL_STRESS",
                    "Daytime Highs",
                    weather.getProvider(),
                    now,
                    tomorrow,
                    true
            ));
        }

        // 4. Disease Micro-Climate Warning
        if (weather.getCurrentRelativeHumidityPercent() > 80.0 && weather.getCurrentTemperatureCelsius() >= 22.0) {
            advisories.add(new WeatherAdvisory(
                    "adv-humidity-" + UUID.randomUUID().toString().substring(0, 6),
                    farmId,
                    "High Humidity Alert: Monitor Fungal Disease Vector",
                    String.format("Persistent relative humidity (%.1f%%) fosters micro-climate conducive to downy mildew and leaf blight. Scout parcel borders for early symptom detection.", weather.getCurrentRelativeHumidityPercent()),
                    "ADVISORY",
                    "DISEASE_VULNERABILITY",
                    "Next 48 Hours",
                    weather.getProvider(),
                    now,
                    tomorrow,
                    false
            ));
        }

        return advisories;
    }

    private Farm verifyFarmOwnership(String farmId, String userId) {
        Farm farm = farmRepository.findById(farmId);
        if (farm == null) {
            throw new ResourceNotFoundException("Farm parcel not found: " + farmId);
        }
        if (!userId.equals(farm.getUserId())) {
            throw new UnauthorizedException("Unauthorized access to farm weather telemetry");
        }
        return farm;
    }
}
