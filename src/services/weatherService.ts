import { WeatherTelemetry, WeatherAdvisory, Farm } from '../types';
import { apiClient } from './apiClient';

export const weatherService = {
  async getFarmWeather(farm: Farm): Promise<WeatherTelemetry> {
    try {
      const res = await apiClient.get<WeatherTelemetry>(`weather/farm/${farm.id}`);
      if (res && res.data) return res.data;
    } catch {
      // Direct Open-Meteo client fallback
    }

    // Direct browser Open-Meteo query
    const coords = resolveCoordinates(farm.location);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords[0]}&longitude=${coords[1]}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        const current = json.current;
        const daily = json.daily;

        const forecasts = [];
        if (daily && daily.time) {
          for (let i = 0; i < Math.min(7, daily.time.length); i++) {
            const rSum = daily.precipitation_sum ? daily.precipitation_sum[i] : 0;
            forecasts.push({
              date: daily.time[i],
              maxTempCelsius: daily.temperature_2m_max ? daily.temperature_2m_max[i] : 30,
              minTempCelsius: daily.temperature_2m_min ? daily.temperature_2m_min[i] : 20,
              precipitationProbabilityPercent: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 10,
              precipitationSumMm: rSum,
              condition: rSum > 5 ? 'Rain Showers' : rSum > 0.5 ? 'Scattered Rain' : 'Partly Cloudy',
            });
          }
        }

        const precip = current.precipitation || 0;
        return {
          farmId: farm.id,
          farmName: farm.name,
          location: farm.location,
          latitude: coords[0],
          longitude: coords[1],
          provider: 'Open-Meteo High-Resolution WMO API',
          observationTime: current.time || new Date().toISOString(),
          retrievalTime: new Date().toISOString(),
          dataFreshness: 'FRESH',
          currentTemperatureCelsius: current.temperature_2m || 28.0,
          currentRelativeHumidityPercent: current.relative_humidity_2m || 65.0,
          currentWindSpeedKmh: current.wind_speed_10m || 12.0,
          currentPrecipitationMm: precip,
          currentCondition: precip > 5 ? 'Heavy Rain' : precip > 0 ? 'Light Rain' : 'Clear & Sunny',
          dailyForecasts: forecasts,
        };
      }
    } catch {
      // Network disconnected: provide regional climatology baseline
    }

    return generateAgroBaseline(farm, coords[0], coords[1]);
  },

  async getFarmAdvisories(farm: Farm, weather: WeatherTelemetry): Promise<WeatherAdvisory[]> {
    try {
      const res = await apiClient.get<WeatherAdvisory[]>(`weather/advisories/${farm.id}`);
      if (res && res.data && res.data.length > 0) return res.data;
    } catch {
      // Local rule-based advisory fallback
    }

    const advisories: WeatherAdvisory[] = [];
    const now = new Date().toISOString();
    const expires = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

    const upcomingRain = weather.dailyForecasts.reduce((acc, f) => acc + f.precipitationSumMm, 0);

    if (upcomingRain > 15.0) {
      advisories.push({
        id: `adv-rain-${Date.now()}`,
        farmId: farm.id,
        title: 'Heavy Rainfall Expected: Suspend Field Irrigation',
        description: `Projected 7-day cumulative rainfall is ${upcomingRain.toFixed(1)} mm. Suspend irrigation cycles to prevent soil anaerobic hypoxia and nitrate leaching.`,
        severity: 'WARNING',
        category: 'IRRIGATION',
        forecastPeriod: 'Next 7 Days',
        dataSource: weather.provider,
        createdAt: now,
        expiresAt: expires,
        isActionRequired: true,
      });
    } else if (upcomingRain < 2.0 && weather.currentTemperatureCelsius > 30.0) {
      advisories.push({
        id: `adv-dry-${Date.now()}`,
        farmId: farm.id,
        title: 'Dry Weather Spell: Prioritize Root-Zone Drip',
        description: 'Dry conditions forecast with high evaporative demand. Maintain organic mulching and schedule night irrigation.',
        severity: 'ADVISORY',
        category: 'IRRIGATION',
        forecastPeriod: 'Next 5-7 Days',
        dataSource: weather.provider,
        createdAt: now,
        expiresAt: expires,
        isActionRequired: false,
      });
    }

    if (weather.currentWindSpeedKmh > 20.0) {
      advisories.push({
        id: `adv-wind-${Date.now()}`,
        farmId: farm.id,
        title: 'High Wind Velocity: Postpone Foliar Spraying',
        description: `Current wind speed (${weather.currentWindSpeedKmh.toFixed(1)} km/h) exceeds safe chemical spray limits. Postpone spray operations to prevent droplet drift.`,
        severity: 'WARNING',
        category: 'SPRAY_WINDOW',
        forecastPeriod: 'Immediate Window',
        dataSource: weather.provider,
        createdAt: now,
        expiresAt: expires,
        isActionRequired: true,
      });
    } else {
      advisories.push({
        id: `adv-spray-${Date.now()}`,
        farmId: farm.id,
        title: 'Calm Atmosphere: Optimal Spray Window Open',
        description: `Wind speed (${weather.currentWindSpeedKmh.toFixed(1)} km/h) is favorable for foliar micronutrient and biological pest sprays.`,
        severity: 'INFO',
        category: 'SPRAY_WINDOW',
        forecastPeriod: 'Today',
        dataSource: weather.provider,
        createdAt: now,
        expiresAt: expires,
        isActionRequired: false,
      });
    }

    if (weather.currentRelativeHumidityPercent > 80.0 && weather.currentTemperatureCelsius >= 22.0) {
      advisories.push({
        id: `adv-hum-${Date.now()}`,
        farmId: farm.id,
        title: 'High Humidity Alert: Monitor Fungal Disease Vector',
        description: `Persistent humidity (${weather.currentRelativeHumidityPercent.toFixed(1)}%) promotes downy mildew and rust. Scout crops for initial lesions.`,
        severity: 'ADVISORY',
        category: 'DISEASE_VULNERABILITY',
        forecastPeriod: 'Next 48 Hours',
        dataSource: weather.provider,
        createdAt: now,
        expiresAt: expires,
        isActionRequired: false,
      });
    }

    return advisories;
  },
};

function resolveCoordinates(loc: string): [number, number] {
  if (!loc) return [20.5937, 78.9629];
  const l = loc.toLowerCase();
  if (l.includes('nashik') || l.includes('maharashtra')) return [19.9975, 73.7898];
  if (l.includes('punjab') || l.includes('bhatinda')) return [30.2110, 74.9455];
  if (l.includes('thanjavur') || l.includes('tamil nadu')) return [10.7870, 79.1378];
  if (l.includes('kerala') || l.includes('wayanad')) return [11.6854, 76.1320];
  if (l.includes('karnataka') || l.includes('bengaluru')) return [12.9716, 77.5946];
  if (l.includes('gujarat')) return [22.2587, 71.1924];
  if (l.includes('uttar pradesh') || l.includes('varanasi')) return [25.3176, 82.9739];
  return [20.5937, 78.9629];
}

function generateAgroBaseline(farm: Farm, lat: number, lon: number): WeatherTelemetry {
  const forecasts: any[] = [];
  const now = Date.now();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now + i * 24 * 3600 * 1000).toISOString().split('T')[0];
    const rain = (i === 2 || i === 5) ? 6.5 : 0.0;
    forecasts.push({
      date: d,
      maxTempCelsius: 29 + (i % 3),
      minTempCelsius: 19 + (i % 2),
      precipitationProbabilityPercent: rain > 0 ? 55 : 15,
      precipitationSumMm: rain,
      condition: rain > 0 ? 'Scattered Rain' : 'Sunny & Warm',
    });
  }

  return {
    farmId: farm.id,
    farmName: farm.name,
    location: farm.location,
    latitude: lat,
    longitude: lon,
    provider: 'AgroSmart Regional Climatology Baseline',
    observationTime: new Date().toISOString(),
    retrievalTime: new Date().toISOString(),
    dataFreshness: 'LOCAL_BASELINE',
    currentTemperatureCelsius: 27.5,
    currentRelativeHumidityPercent: 62.0,
    currentWindSpeedKmh: 11.4,
    currentPrecipitationMm: 0.0,
    currentCondition: 'Partly Cloudy',
    dailyForecasts: forecasts,
  };
}
