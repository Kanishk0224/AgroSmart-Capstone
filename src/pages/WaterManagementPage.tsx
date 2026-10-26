import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Droplets,
  CloudRain,
  Waves,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { farmService } from '../services/farmService';
import { waterService } from '../services/waterService';
import { Farm, WaterBudgetResponse } from '../types';
import { VERIFIED_CROP_CATALOG } from '../services/cropService';

export const WaterManagementPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [cropName, setCropName] = useState<string>('Basmati & Wetland Rice');
  const [areaAcres, setAreaAcres] = useState<number>(10);
  const [cropDemandMm, setCropDemandMm] = useState<number>(1200);
  const [rainfallMm, setRainfallMm] = useState<number>(650);
  const [irrigationMethod, setIrrigationMethod] = useState<string>('CANAL');
  const [waterSupplyM3, setWaterSupplyM3] = useState<string>('45000');

  // Calculation & History State
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<WaterBudgetResponse | null>(null);
  const [savedBudgets, setSavedBudgets] = useState<WaterBudgetResponse[]>([]);

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      setLoading(true);
      try {
        const farmList = await farmService.getFarms(user.uid);
        setFarms(farmList);

        const initialFarm = (location.state as any)?.farmId || (farmList.length > 0 ? farmList[0].id : '');
        if (initialFarm) {
          setSelectedFarmId(initialFarm);
          const f = farmList.find((farm) => farm.id === initialFarm);
          if (f) {
            setAreaAcres(f.totalAreaAcres);
            setIrrigationMethod(f.irrigationSource);
          }
        }

        // Passed crop name or water need from recommendations page
        if ((location.state as any)?.cropName) {
          setCropName((location.state as any).cropName);
        }
        if ((location.state as any)?.waterNeed) {
          setCropDemandMm((location.state as any).waterNeed);
        }

        if (initialFarm) {
          const budgets = await waterService.getSavedBudgets(initialFarm);
          setSavedBudgets(budgets);
        }
      } catch (err) {
        console.error('Error loading water management data:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, location.state]);

  const handleFarmChange = async (fId: string) => {
    setSelectedFarmId(fId);
    const f = farms.find((farm) => farm.id === fId);
    if (f) {
      setAreaAcres(f.totalAreaAcres);
      setIrrigationMethod(f.irrigationSource);
      const budgets = await waterService.getSavedBudgets(fId);
      setSavedBudgets(budgets);
    }
  };

  const handleCropChange = (cName: string) => {
    setCropName(cName);
    const found = VERIFIED_CROP_CATALOG.find((c) => c.cropName === cName);
    if (found && found.waterRequirementMm) {
      setCropDemandMm(found.waterRequirementMm);
    }
  };

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !selectedFarmId) return;

    setIsCalculating(true);
    try {
      const budget = await waterService.calculateBudget(user.uid, {
        farmId: selectedFarmId,
        cropName,
        areaAcres: Number(areaAcres),
        cropWaterDemandMm: Number(cropDemandMm),
        seasonalRainfallMm: rainfallMm ? Number(rainfallMm) : undefined,
        irrigationMethod,
        availableWaterSupplyM3: waterSupplyM3 ? Number(waterSupplyM3) : undefined,
      });
      setCurrentBudget(budget);
      // Refresh saved budgets
      const budgets = await waterService.getSavedBudgets(selectedFarmId);
      setSavedBudgets(budgets);
    } catch (err) {
      console.error('Error calculating water budget:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Initializing water budget models...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-teal-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Droplets className="w-96 h-96 -mr-16 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30 text-xs font-semibold mb-3">
            <Waves className="w-3.5 h-3.5" /> Smart Water Management • Hydrologic Water Budgeting
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Agricultural Water Management & Budgeting</h1>
          <p className="mt-2 text-sm sm:text-base text-sky-100 font-normal leading-relaxed">
            Volumetric crop water demand modeling based on USDA-SCS effective rainfall deductions, conveyance efficiency factors, and aquifer stress indicators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Hydrologic Parameters</h2>
              <p className="text-xs text-slate-500">Configure irrigation and seasonal rainfall</p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              USDA-SCS Model
            </span>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Target Farm */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Farm Parcel *</label>
              <select
                value={selectedFarmId}
                onChange={(e) => handleFarmChange(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.totalAreaAcres} Acres • {f.irrigationSource})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Crop */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cultivated Crop *</label>
              <select
                value={cropName}
                onChange={(e) => handleCropChange(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {VERIFIED_CROP_CATALOG.map((c) => (
                  <option key={c.cropId} value={c.cropName}>
                    {c.cropName} (Req: {c.waterRequirementMm} mm)
                  </option>
                ))}
              </select>
            </div>

            {/* Parcel Acreage & Crop Water Demand */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Planted Area (Acres) *</label>
                <input
                  type="number"
                  step="0.5"
                  value={areaAcres}
                  onChange={(e) => setAreaAcres(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Crop Demand (mm)</label>
                <input
                  type="number"
                  value={cropDemandMm}
                  onChange={(e) => setCropDemandMm(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Irrigation Method */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Irrigation Method & Conveyance</label>
              <select
                value={irrigationMethod}
                onChange={(e) => setIrrigationMethod(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="DRIP">Micro-Drip Irrigation (90% System Efficiency)</option>
                <option value="SPRINKLER">Overhead Sprinkler (75% System Efficiency)</option>
                <option value="CANAL">Canal Surface Flow (55% Efficiency - Runoff Loss)</option>
                <option value="BOREWELL">Borewell Flood (55% Efficiency)</option>
                <option value="RAIN_FED">Rain-fed Dryland (100% Reliance on Weather)</option>
              </select>
            </div>

            {/* Seasonal Rainfall & Aquifer Capacity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Forecast Rainfall (mm)</label>
                <input
                  type="number"
                  value={rainfallMm}
                  onChange={(e) => setRainfallMm(Number(e.target.value))}
                  placeholder="e.g. 600"
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Supply Quota (m³)</label>
                <input
                  type="number"
                  value={waterSupplyM3}
                  onChange={(e) => setWaterSupplyM3(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Simulating Volumetric Water Budget...
                </>
              ) : (
                <>
                  <Droplets className="w-4 h-4" /> Compute Field Water Budget
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Analysis (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!currentBudget ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                <CloudRain className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Simulation Run Active</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md">
                Select your farm parcel, target crop, and seasonal rainfall to simulate total water requirements and irrigation schedules.
              </p>
              <button
                type="button"
                onClick={() => handleCalculate()}
                className="mt-6 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Compute with Current Inputs
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Balance Status Card */}
              <div
                className={`p-5 rounded-2xl border ${
                  currentBudget.waterBalanceStatus === 'SURPLUS'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : currentBudget.waterBalanceStatus === 'SUFFICIENT'
                    ? 'bg-sky-50 border-sky-200 text-sky-900'
                    : currentBudget.waterBalanceStatus === 'MODERATE_DEFICIT'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {currentBudget.waterBalanceStatus === 'SURPLUS' || currentBudget.waterBalanceStatus === 'SUFFICIENT' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-amber-600" />
                    )}
                    <div>
                      <h3 className="font-bold text-sm">
                        Water Balance Status: {currentBudget.waterBalanceStatus.replace('_', ' ')}
                      </h3>
                      <p className="text-xs opacity-80">
                        {currentBudget.cropName} on {currentBudget.areaAcres} acres • Method: {currentBudget.irrigationMethod} ({currentBudget.irrigationEfficiency}% Efficiency)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold">Deficit / Surplus:</span>
                    <p className="font-black text-sm">
                      {currentBudget.deficitOrSurplusM3 > 0 ? '+' : ''}
                      {currentBudget.deficitOrSurplusM3.toLocaleString()} m³
                    </p>
                  </div>
                </div>

                {currentBudget.warnings.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-current/10 space-y-1 text-xs">
                    {currentBudget.warnings.map((w, i) => (
                      <div key={i} className="flex items-center gap-1.5 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Volumetric Breakdown Grid */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-800">Volumetric Water Dynamics (m³ & mm)</h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-500 font-semibold">Total Crop Demand</span>
                    <p className="text-sm font-black text-slate-900 mt-0.5">
                      {currentBudget.totalCropDemandM3.toLocaleString()} m³
                    </p>
                    <span className="text-[10px] text-slate-400">({currentBudget.cropWaterDemandMm} mm depth)</span>
                  </div>

                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-center">
                    <span className="text-[10px] text-sky-700 font-semibold">Effective Rainfall</span>
                    <p className="text-sm font-black text-sky-900 mt-0.5">
                      {currentBudget.effectiveRainfallContributionM3.toLocaleString()} m³
                    </p>
                    <span className="text-[10px] text-sky-600">({currentBudget.effectiveRainfallMm} mm net)</span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                    <span className="text-[10px] text-emerald-700 font-semibold">Net Irrigation Req</span>
                    <p className="text-sm font-black text-emerald-900 mt-0.5">
                      {currentBudget.netIrrigationM3.toLocaleString()} m³
                    </p>
                    <span className="text-[10px] text-emerald-600">({currentBudget.netIrrigationRequirementMm} mm)</span>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                    <span className="text-[10px] text-amber-700 font-semibold">Gross Pumped Volume</span>
                    <p className="text-sm font-black text-amber-900 mt-0.5">
                      {currentBudget.grossIrrigationM3.toLocaleString()} m³
                    </p>
                    <span className="text-[10px] text-amber-600">({currentBudget.grossIrrigationRequirementMm} mm pumped)</span>
                  </div>
                </div>

                {/* Efficiency Bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>Conveyance Application Efficiency</span>
                    <span>{currentBudget.irrigationEfficiency}% Efficient</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        currentBudget.irrigationEfficiency >= 85 ? 'bg-emerald-500' : currentBudget.irrigationEfficiency >= 70 ? 'bg-sky-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${currentBudget.irrigationEfficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Water Savings & Conservation Tips (Objective 5) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-600" /> Agronomic Water Conservation Practices
                </h4>
                <div className="space-y-2">
                  {currentBudget.seasonalSavingsTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Saved Water Budgets for this Farm */}
          {savedBudgets.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Previously Calculated Budgets ({savedBudgets.length})
              </h4>
              <div className="divide-y divide-slate-100">
                {savedBudgets.slice(0, 5).map((b) => (
                  <div key={b.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{b.cropName}</span>
                      <span className="text-slate-400 ml-2">({b.areaAcres} Acres • {b.irrigationMethod})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-600">{b.grossIrrigationM3.toLocaleString()} m³</span>
                      <button
                        onClick={() => setCurrentBudget(b)}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
