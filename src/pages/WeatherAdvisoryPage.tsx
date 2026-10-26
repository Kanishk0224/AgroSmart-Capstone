import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  CloudRain,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Clock,
  Sparkles,
  Info,
  ShieldAlert,
  Calendar,
  Compass,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { farmService } from '../services/farmService';
import { weatherService } from '../services/weatherService';
import { Farm, WeatherTelemetry, WeatherAdvisory } from '../types';

export const WeatherAdvisoryPage: React.FC = () => {
  const { user } = useAuth();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [weather, setWeather] = useState<WeatherTelemetry | null>(null);
  const [advisories, setAdvisories] = useState<WeatherAdvisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchFarms = async () => {
      setLoading(true);
      try {
        const farmList = await farmService.getFarms(user.uid);
        setFarms(farmList);
        if (farmList.length > 0) {
          setSelectedFarmId(farmList[0].id);
          loadWeatherData(farmList[0]);
        }
      } catch (err) {
        console.error('Error fetching farms for weather:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, [user]);

  const loadWeatherData = async (farm: Farm) => {
    setRefreshing(true);
    try {
      const data = await weatherService.getFarmWeather(farm);
      setWeather(data);
      const advs = await weatherService.getFarmAdvisories(farm, data);
      setAdvisories(advs);
    } catch (err) {
      console.error('Error loading weather telemetry:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFarmSelect = (fId: string) => {
    setSelectedFarmId(fId);
    const f = farms.find((item) => item.id === fId);
    if (f) loadWeatherData(f);
  };

  const selectedFarm = farms.find((f) => f.id === selectedFarmId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Retrieving meteorological telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-teal-950 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <CloudSun className="w-96 h-96 -mr-16 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30 text-xs font-semibold mb-3">
            <CloudSun className="w-3.5 h-3.5" /> Weather Advisory • High-Resolution Meteorological Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Weather Advisory & Micro-Climate Telemetry</h1>
          <p className="mt-2 text-sm sm:text-base text-sky-100 font-normal leading-relaxed">
            Hyper-local precipitation probabilities, spray window optimization, thermal stress alerts, and automated irrigation postponement recommendations.
          </p>
        </div>
      </div>

      {/* Parcel Selector & Freshness Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Select Parcel:</label>
          <select
            value={selectedFarmId}
            onChange={(e) => handleFarmSelect(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.location})
              </option>
            ))}
          </select>
        </div>

        {weather && (
          <div className="flex items-center gap-3 text-xs">
            <span
              className={`px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center gap-1.5 ${
                weather.dataFreshness === 'FRESH'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <Clock className="w-3 h-3" />
              {weather.dataFreshness === 'FRESH' ? 'Live Telemetry' : 'Cached Observation'}
            </span>

            <span className="text-slate-400 hidden md:inline">
              Provider: {weather.provider}
            </span>

            <button
              onClick={() => selectedFarm && loadWeatherData(selectedFarm)}
              disabled={refreshing}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {weather && (
        <>
          {/* Current Observation Highlight Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                  <CloudSun className="w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      {weather.currentTemperatureCelsius}°C
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700">
                      {weather.currentCondition}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Observed at {weather.location} ({weather.latitude.toFixed(2)}°N, {weather.longitude.toFixed(2)}°E)
                  </p>
                </div>
              </div>

              {/* Quick telemetry parameters */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Droplets className="w-4 h-4 mx-auto text-sky-600 mb-1" />
                  <span className="text-[10px] text-slate-400">Relative Humidity</span>
                  <p className="font-bold text-slate-800 text-sm">{weather.currentRelativeHumidityPercent}%</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Wind className="w-4 h-4 mx-auto text-teal-600 mb-1" />
                  <span className="text-[10px] text-slate-400">Wind Velocity</span>
                  <p className="font-bold text-slate-800 text-sm">{weather.currentWindSpeedKmh} km/h</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <CloudRain className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                  <span className="text-[10px] text-slate-400">Precipitation</span>
                  <p className="font-bold text-slate-800 text-sm">{weather.currentPrecipitationMm} mm</p>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast Strip */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                7-Day Agro-Meteorological Forecast
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {weather.dailyForecasts.map((d, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-center text-xs space-y-1 hover:border-sky-300 transition-all"
                  >
                    <p className="text-[11px] font-bold text-slate-700">
                      {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-sky-700 font-semibold">{d.condition}</p>
                    <div className="flex justify-center items-center gap-1 font-bold">
                      <span className="text-slate-900">{Math.round(d.maxTempCelsius)}°</span>
                      <span className="text-slate-400 text-[10px]">/ {Math.round(d.minTempCelsius)}°</span>
                    </div>
                    {d.precipitationSumMm > 0 && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {d.precipitationSumMm} mm ({d.precipitationProbabilityPercent}%)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Agro-Climatic Advisories */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Actionable Agronomic Advisories ({advisories.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advisories.map((adv) => (
                <div
                  key={adv.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    adv.severity === 'WARNING'
                      ? 'bg-amber-50/60 border-amber-300 text-amber-950'
                      : adv.severity === 'ADVISORY'
                      ? 'bg-sky-50/60 border-sky-300 text-sky-950'
                      : 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {adv.severity === 'WARNING' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      <h4 className="font-bold text-sm">{adv.title}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/80 border border-current/20 shrink-0">
                      {adv.category}
                    </span>
                  </div>

                  <p className="text-xs mt-2.5 leading-relaxed opacity-90">{adv.description}</p>

                  <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-[11px] opacity-75">
                    <span>Forecast Horizon: {adv.forecastPeriod}</span>
                    <span>Source: {adv.dataSource}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
