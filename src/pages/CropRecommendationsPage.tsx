import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Sparkles,
  Layers,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Info,
  Calendar,
  ChevronRight,
  RefreshCw,
  Plus,
  Compass,
  ArrowRight,
  ShieldCheck,
  BookmarkPlus,
  Scale,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { farmService } from '../services/farmService';
import { soilService } from '../services/soilService';
import { recommendationService } from '../services/recommendationService';
import { farmingPlanService } from '../services/farmingPlanService';
import {
  Farm,
  SoilTest,
  CropSeason,
  SoilType,
  CropRecommendationDto,
  RecommendationResponse,
  RecommendationHistoryItem,
} from '../types';

export const CropRecommendationsPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [soilTests, setSoilTests] = useState<SoilTest[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form State
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [selectedSoilTestId, setSelectedSoilTestId] = useState<string>('');
  const [season, setSeason] = useState<CropSeason>('KHARIF');
  const [customSoilType, setCustomSoilType] = useState<SoilType>('LOAMY');
  const [phInput, setPhInput] = useState<string>('');
  const [nitrogenInput, setNitrogenInput] = useState<string>('');
  const [phosphorusInput, setPhosphorusInput] = useState<string>('');
  const [potassiumInput, setPotassiumInput] = useState<string>('');
  const [temperatureInput, setTemperatureInput] = useState<string>('28');
  const [rainfallInput, setRainfallInput] = useState<string>('850');
  const [irrigationMethod, setIrrigationMethod] = useState<string>('CANAL');
  const [previousCrop, setPreviousCrop] = useState<string>('None');
  const [sustainabilityPref, setSustainabilityPref] = useState<'BALANCED' | 'WATER_CONSERVATION' | 'SOIL_HEALTH' | 'PROFIT_FOCUSED'>('BALANCED');

  // Execution & Result State
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<RecommendationResponse | null>(null);
  const [historyItems, setHistoryItems] = useState<RecommendationHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');
  const [comparisonCrops, setComparisonCrops] = useState<CropRecommendationDto[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [savePlanSuccess, setSavePlanSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      setLoadingInitial(true);
      try {
        const [farmList, tests, history] = await Promise.all([
          farmService.getFarms(user.uid),
          soilService.getSoilTests(user.uid),
          recommendationService.getRecommendationHistory(user.uid),
        ]);
        setFarms(farmList);
        setSoilTests(tests);
        setHistoryItems(history);

        // Pre-select farm if passed via location state or default to first
        const initialFarm = (location.state as any)?.farmId || (farmList.length > 0 ? farmList[0].id : '');
        if (initialFarm) {
          setSelectedFarmId(initialFarm);
          const f = farmList.find((item) => item.id === initialFarm);
          if (f) {
            setCustomSoilType(f.soilType);
            setIrrigationMethod(f.irrigationSource);
          }
        }
      } catch (e) {
        console.error('Error loading recommendations data:', e);
      } finally {
        setLoadingInitial(false);
      }
    };
    loadData();
  }, [user, location.state]);

  // When selected farm changes, auto-bind soil tests and irrigation
  const handleFarmChange = (fId: string) => {
    setSelectedFarmId(fId);
    const f = farms.find((item) => item.id === fId);
    if (f) {
      setCustomSoilType(f.soilType);
      setIrrigationMethod(f.irrigationSource);

      // Find newest soil test for this farm
      const farmTests = soilTests.filter((t) => t.farmId === fId);
      if (farmTests.length > 0) {
        setSelectedSoilTestId(farmTests[0].id);
        setPhInput(farmTests[0].phLevel.toString());
        setNitrogenInput(farmTests[0].nitrogenLevel.toString());
        setPhosphorusInput(farmTests[0].phosphorusLevel.toString());
        setPotassiumInput(farmTests[0].potassiumLevel.toString());
      } else {
        setSelectedSoilTestId('');
        setPhInput('');
        setNitrogenInput('');
        setPhosphorusInput('');
        setPotassiumInput('');
      }
    }
  };

  // When soil test dropdown changes
  const handleSoilTestChange = (testId: string) => {
    setSelectedSoilTestId(testId);
    if (!testId) {
      setPhInput('');
      setNitrogenInput('');
      setPhosphorusInput('');
      setPotassiumInput('');
      return;
    }
    const test = soilTests.find((t) => t.id === testId);
    if (test) {
      setPhInput(test.phLevel.toString());
      setNitrogenInput(test.nitrogenLevel.toString());
      setPhosphorusInput(test.phosphorusLevel.toString());
      setPotassiumInput(test.potassiumLevel.toString());
    }
  };

  // Run Recommendation Analysis
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !selectedFarmId) return;

    const farm = farms.find((f) => f.id === selectedFarmId);
    if (!farm) return;

    const soilTest = soilTests.find((t) => t.id === selectedSoilTestId);

    setIsGenerating(true);
    try {
      const res = await recommendationService.generateRecommendations(user.uid, {
        farmId: selectedFarmId,
        farm,
        soilTest,
        season,
        soilType: customSoilType,
        phLevel: phInput ? parseFloat(phInput) : undefined,
        nitrogenLevel: nitrogenInput ? parseFloat(nitrogenInput) : undefined,
        phosphorusLevel: phosphorusInput ? parseFloat(phosphorusInput) : undefined,
        potassiumLevel: potassiumInput ? parseFloat(potassiumInput) : undefined,
        temperatureCelsius: temperatureInput ? parseFloat(temperatureInput) : undefined,
        rainfallMm: rainfallInput ? parseFloat(rainfallInput) : undefined,
        irrigationMethod,
        previousCrop,
        sustainabilityPreference: sustainabilityPref,
      });

      setCurrentResult(res);
      // Refresh history
      const updatedHistory = await recommendationService.getRecommendationHistory(user.uid);
      setHistoryItems(updatedHistory);
    } catch (err) {
      console.error('Failed to generate recommendation:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleCompare = (crop: CropRecommendationDto) => {
    if (comparisonCrops.some((c) => c.cropId === crop.cropId)) {
      setComparisonCrops((prev) => prev.filter((c) => c.cropId !== crop.cropId));
    } else {
      if (comparisonCrops.length >= 3) {
        alert('You can compare a maximum of 3 crops side by side.');
        return;
      }
      setComparisonCrops((prev) => [...prev, crop]);
    }
  };

  const handleSaveFarmingPlan = async (crop: CropRecommendationDto) => {
    if (!user || !currentResult) return;
    const farm = farms.find((f) => f.id === currentResult.farmId);
    if (!farm) return;

    try {
      await farmingPlanService.createFarmingPlan(user.uid, {
        farmId: farm.id,
        farmName: farm.name,
        title: `${crop.cropName} - ${currentResult.season} Season Plan`,
        season: currentResult.season as CropSeason,
        targetCrop: crop.cropName,
        areaAcres: farm.totalAreaAcres,
        sowingMonth: currentResult.season === 'KHARIF' ? 'June-July' : currentResult.season === 'RABI' ? 'October-November' : 'March-April',
        harvestMonth: currentResult.season === 'KHARIF' ? 'October-November' : currentResult.season === 'RABI' ? 'March-April' : 'June',
        expectedYield: Math.round(farm.totalAreaAcres * 22),
        yieldUnit: 'Quintals',
        expectedProfit: Math.round(farm.totalAreaAcres * 35000),
        estimatedWaterM3: Math.round((crop.estimatedWaterNeedMm || 500) * 4.04 * farm.totalAreaAcres),
        status: 'PLANNED',
        notes: `Auto-generated from recommendation snapshot (Suitability Score: ${crop.suitabilityScore}/100).`,
      });
      setSavePlanSuccess(`Farming Plan for ${crop.cropName} saved successfully!`);
      setTimeout(() => setSavePlanSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to save farming plan:', err);
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Loading agronomic intelligence engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Sprout className="w-96 h-96 -mr-16 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Intelligent Crop Recommendations • Multi-Factor Agronomic Scoring
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Intelligent Crop Recommendation</h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100 font-normal leading-relaxed">
            Multi-criteria agronomic evaluation synthesizing soil chemistry (35%), water availability (25%), seasonal timing (20%), climate limits (10%), and crop rotation synergy (10%).
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'generator'
                  ? 'bg-white text-emerald-950 shadow-md'
                  : 'bg-emerald-950/50 text-emerald-200 hover:bg-emerald-900'
              }`}
            >
              Crop Suitability Evaluator
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-white text-emerald-950 shadow-md'
                  : 'bg-emerald-950/50 text-emerald-200 hover:bg-emerald-900'
              }`}
            >
              Historical Runs ({historyItems.length})
            </button>
          </div>
        </div>
      </div>

      {savePlanSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-semibold">{savePlanSuccess}</p>
          </div>
          <button
            onClick={() => navigate('/farming-plans')}
            className="text-xs font-bold text-emerald-700 underline hover:text-emerald-900"
          >
            View Farming Plans →
          </button>
        </div>
      )}

      {activeTab === 'generator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Parameters (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Farm & Agronomic Inputs</h2>
                <p className="text-xs text-slate-500">Provide field characteristics for precision scoring</p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live Analysis
              </span>
            </div>

            {farms.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-sm text-slate-600 font-medium">No farm parcels registered yet.</p>
                <button
                  onClick={() => navigate('/farms')}
                  className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Register a Farm First
                </button>
              </div>
            ) : (
              <form onSubmit={handleGenerate} className="space-y-4">
                {/* 1. Farm Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Farm Parcel *</label>
                  <select
                    value={selectedFarmId}
                    onChange={(e) => handleFarmChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.totalAreaAcres} Acres • {f.location})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Soil Test Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Link Soil Test (Optional)</label>
                    <span className="text-[10px] text-slate-400">Auto-fills N-P-K & pH</span>
                  </div>
                  <select
                    value={selectedSoilTestId}
                    onChange={(e) => handleSoilTestChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Manual / No Lab Test Available</option>
                    {soilTests
                      .filter((t) => t.farmId === selectedFarmId)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          Tested {t.testDate} (pH: {t.phLevel}, N: {t.nitrogenLevel}, {t.fertilityRating})
                        </option>
                      ))}
                  </select>
                </div>

                {/* 3. Season & Soil Type Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Crop Season *</label>
                    <select
                      value={season}
                      onChange={(e) => setSeason(e.target.value as CropSeason)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="KHARIF">Kharif (Monsoon: Jun-Oct)</option>
                      <option value="RABI">Rabi (Winter: Oct-Apr)</option>
                      <option value="ZAID">Zaid (Summer: Mar-Jun)</option>
                      <option value="ALL_SEASON">Perennial / All Season</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Soil Texture *</label>
                    <select
                      value={customSoilType}
                      onChange={(e) => setCustomSoilType(e.target.value as SoilType)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="LOAMY">Loamy</option>
                      <option value="CLAY">Clay</option>
                      <option value="CLAY_LOAM">Clay Loam</option>
                      <option value="SANDY_LOAM">Sandy Loam</option>
                      <option value="SILT">Silt</option>
                      <option value="SANDY">Sandy</option>
                    </select>
                  </div>
                </div>

                {/* 4. Soil Chemistry (pH & N-P-K) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" /> Soil Chemistry Parameters
                    </span>
                    {!phInput && (
                      <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Defaulting to standard
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">pH Level</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 6.8"
                        value={phInput}
                        onChange={(e) => setPhInput(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">N (kg/ha)</label>
                      <input
                        type="number"
                        placeholder="e.g. 320"
                        value={nitrogenInput}
                        onChange={(e) => setNitrogenInput(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">P (kg/ha)</label>
                      <input
                        type="number"
                        placeholder="e.g. 24"
                        value={phosphorusInput}
                        onChange={(e) => setPhosphorusInput(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">K (kg/ha)</label>
                      <input
                        type="number"
                        placeholder="e.g. 210"
                        value={potassiumInput}
                        onChange={(e) => setPotassiumInput(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Irrigation & Previous Crop */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Irrigation Supply</label>
                    <select
                      value={irrigationMethod}
                      onChange={(e) => setIrrigationMethod(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="DRIP">Drip Irrigation (90% Eff.)</option>
                      <option value="SPRINKLER">Sprinkler (75% Eff.)</option>
                      <option value="CANAL">Canal / Surface (55% Eff.)</option>
                      <option value="BOREWELL">Borewell Groundwater</option>
                      <option value="RAIN_FED">Rain-fed Dryland</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preceding Crop</label>
                    <select
                      value={previousCrop}
                      onChange={(e) => setPreviousCrop(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="None">None / Fallow</option>
                      <option value="Rice">Rice (Wetland Paddy)</option>
                      <option value="Wheat">Wheat (Winter Cereal)</option>
                      <option value="Chickpea">Chickpea / Pulse (Legume)</option>
                      <option value="Soybean">Soybean (Legume)</option>
                      <option value="Cotton">Cotton (Fibre)</option>
                      <option value="Tomato">Tomato (Solanaceous)</option>
                      <option value="Potato">Potato (Solanaceous)</option>
                    </select>
                  </div>
                </div>

                {/* 6. Climate (Temp & Rainfall) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Avg Temperature (°C)</label>
                    <input
                      type="number"
                      step="1"
                      value={temperatureInput}
                      onChange={(e) => setTemperatureInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Seasonal Rainfall (mm)</label>
                    <input
                      type="number"
                      step="10"
                      value={rainfallInput}
                      onChange={(e) => setRainfallInput(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* 7. Sustainability Strategy Preference */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prioritization Strategy</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'BALANCED', label: 'Balanced (Standard)' },
                      { id: 'WATER_CONSERVATION', label: 'Water Conservation' },
                      { id: 'SOIL_HEALTH', label: 'Soil Restoration' },
                      { id: 'PROFIT_FOCUSED', label: 'High Yield Profit' },
                    ].map((strat) => (
                      <button
                        type="button"
                        key={strat.id}
                        onClick={() => setSustainabilityPref(strat.id as any)}
                        className={`p-2 rounded-xl text-left font-semibold border transition-all text-[11px] ${
                          sustainabilityPref === strat.id
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {strat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Evaluating Agronomic Models...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Run Recommendation Engine
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Results: Recommendations (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {!currentResult ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Ready for Agricultural Analysis</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-md">
                  Select your farm and parameters on the left and click <strong>"Run Recommendation Engine"</strong> to generate transparent, evidence-backed crop recommendations.
                </p>
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Quick Run with Current Settings
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Result Meta Banner & Missing Data Warning */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Recommendations for {currentResult.farmName}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Season: <span className="font-bold text-slate-700">{currentResult.season}</span> • Score Engine v{currentResult.scoreVersion}
                      </p>
                    </div>
                    {comparisonCrops.length > 0 && (
                      <button
                        onClick={() => setIsCompareModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-100 transition-all"
                      >
                        <Scale className="w-3.5 h-3.5" /> Compare Selected ({comparisonCrops.length})
                      </button>
                    )}
                  </div>

                  {/* Uncertainty & Missing Data Transparency Notice (Objective 10) */}
                  {currentResult.missingDataNotices.length > 0 && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Data Confidence & Uncertainty Disclosure</span>
                      </div>
                      <p className="text-[11px] text-amber-700">
                        The scoring model automatically re-normalized weights because certain laboratory or weather measurements were absent:
                      </p>
                      <ul className="list-disc list-inside text-[11px] text-amber-800 pl-1">
                        {currentResult.missingDataNotices.map((n, i) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="mt-2 text-[11px] text-slate-500 italic">
                    {currentResult.scoreMethodologyExplanation}
                  </p>
                </div>

                {/* Top Recommendations */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> Top Recommended Cultivars
                  </h4>

                  {currentResult.topRecommendations.map((crop, idx) => (
                    <div
                      key={crop.cropId}
                      className="bg-white rounded-2xl border-2 border-emerald-500/80 p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-bl-xl shadow-xs">
                        #{idx + 1} Best Match
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-16">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-base font-bold text-slate-900">{crop.cropName}</h5>
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600">
                              {crop.category}
                            </span>
                          </div>
                          {crop.scientificName && (
                            <p className="text-xs text-slate-400 italic">{crop.scientificName}</p>
                          )}
                        </div>

                        {/* Suitability Score Badge */}
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-2xl font-black text-emerald-700">
                              {crop.suitabilityScore}
                            </span>
                            <span className="text-xs text-slate-400 font-bold">/100</span>
                            <p className="text-[10px] text-slate-500 font-medium">Overall Score</p>
                          </div>
                        </div>
                      </div>

                      {/* Component Scores Bar breakdown */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-700 mb-2">Component Scores Breakdown:</p>
                        <div className="grid grid-cols-5 gap-2 text-center">
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] text-slate-500">Soil (35%)</p>
                            <p className="text-xs font-black text-slate-800">{crop.componentScores.soilScore}%</p>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] text-slate-500">Water (25%)</p>
                            <p className="text-xs font-black text-slate-800">{crop.componentScores.waterScore}%</p>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] text-slate-500">Season (20%)</p>
                            <p className="text-xs font-black text-slate-800">{crop.componentScores.seasonScore}%</p>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] text-slate-500">Climate (10%)</p>
                            <p className="text-xs font-black text-slate-800">{crop.componentScores.climateScore}%</p>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <p className="text-[10px] text-slate-500">Rotation (10%)</p>
                            <p className="text-xs font-black text-slate-800">{crop.componentScores.rotationScore}%</p>
                          </div>
                        </div>
                      </div>

                      {/* Transparent Agronomic Reasoning (Objective 3) */}
                      <div className="mt-3 space-y-1.5">
                        <p className="text-[11px] font-bold text-slate-700">Agronomic Evidence & Reasons:</p>
                        {crop.reasons.slice(0, 3).map((r, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{r}</span>
                          </div>
                        ))}
                        {crop.warnings.map((w, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50/60 p-1.5 rounded-lg border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                            <span>{w}</span>
                          </div>
                        ))}
                      </div>

                      {/* Quick Metrics */}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span className="flex items-center gap-1 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Droplets className="w-3.5 h-3.5 text-sky-600" />
                          Est. Water: {crop.estimatedWaterNeedMm || 500} mm
                        </span>
                        <span className="flex items-center gap-1 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          Duration: {crop.estimatedDurationDays || 120} days
                        </span>
                        <span className="flex items-center gap-1 font-medium bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Sustainability: {crop.sustainability.overallScore}/100
                        </span>
                      </div>

                      {/* Action Bar */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleCompare(crop)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              comparisonCrops.some((c) => c.cropId === crop.cropId)
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {comparisonCrops.some((c) => c.cropId === crop.cropId) ? '✓ Compared' : '+ Compare'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveFarmingPlan(crop)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all flex items-center gap-1"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5" /> Save Plan
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => navigate('/water-budget', { state: { farmId: currentResult.farmId, cropName: crop.cropName, waterNeed: crop.estimatedWaterNeedMm } })}
                            className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-sky-700 hover:bg-sky-50 transition-all"
                          >
                            Water Budget →
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate('/profitability', { state: { farmId: currentResult.farmId, cropName: crop.cropName } })}
                            className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-all"
                          >
                            Cultivation ROI →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Other Evaluated Candidates */}
                {currentResult.otherCandidates.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Other Evaluated Candidates ({currentResult.otherCandidates.length})
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentResult.otherCandidates.map((crop) => (
                        <div
                          key={crop.cropId}
                          className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-2 hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{crop.cropName}</span>
                            <span
                              className={`px-2 py-0.5 rounded font-black text-[11px] ${
                                crop.criticalConstraintFailed
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {crop.criticalConstraintFailed ? 'Constraint Block' : `${crop.suitabilityScore}/100`}
                            </span>
                          </div>

                          {crop.criticalConstraintFailed && crop.failureReason ? (
                            <p className="text-[11px] text-rose-600 font-medium">{crop.failureReason}</p>
                          ) : (
                            <p className="text-[11px] text-slate-500 line-clamp-2">
                              {crop.reasons[0] || crop.warnings[0] || 'Acceptable alternative under customized management.'}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-[10px] text-slate-400">Duration: {crop.estimatedDurationDays}d</span>
                            <button
                              type="button"
                              onClick={() => handleToggleCompare(crop)}
                              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                            >
                              + Compare
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* History Runs Tab (Objective 8) */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Historical Recommendation Runs</h3>
              <p className="text-xs text-slate-500">Access saved analysis snapshots and past evaluations</p>
            </div>
            <button
              onClick={() => setActiveTab('generator')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> New Evaluation Run
            </button>
          </div>

          {historyItems.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No historical recommendation runs stored yet. Run your first analysis above!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {historyItems.map((item) => {
                const f = farms.find((farm) => farm.id === item.farmId);
                return (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{f?.name || 'Farm Parcel'}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.season}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Executed: {new Date(item.createdAt).toLocaleString()} • Soil: {item.soilType || 'Loamy'} • Irrigation: {item.irrigationMethod || 'Standard'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          const full = await recommendationService.getRecommendationById(item.id);
                          if (full) {
                            setCurrentResult(full);
                            setActiveTab('generator');
                          } else {
                            alert('Snapshot details loaded from history.');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                      >
                        Revisit Snapshot
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Delete this historical run?')) {
                            await recommendationService.deleteRecommendation(item.id);
                            setHistoryItems((prev) => prev.filter((h) => h.id !== item.id));
                          }
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 px-2 py-1 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Multi-Crop Comparison Modal (Objective 2: "Compare multiple crop options") */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Crop Comparison Matrix</h3>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {comparisonCrops.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                Select at least 2 crops using "+ Compare" on the recommendation cards to compare them.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2.5 font-bold">Metric / Feature</th>
                      {comparisonCrops.map((c) => (
                        <th key={c.cropId} className="py-2.5 font-bold text-slate-900 text-sm">
                          {c.cropName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-500">Suitability Score</td>
                      {comparisonCrops.map((c) => (
                        <td key={c.cropId} className="py-2.5 font-black text-emerald-700 text-sm">
                          {c.suitabilityScore}/100
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-500">Botanical Category</td>
                      {comparisonCrops.map((c) => (
                        <td key={c.cropId} className="py-2.5 font-medium">
                          {c.category}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-500">Water Demand (mm)</td>
                      {comparisonCrops.map((c) => (
                        <td key={c.cropId} className="py-2.5 font-medium text-sky-700 font-bold">
                          {c.estimatedWaterNeedMm || 500} mm
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-500">Growing Duration</td>
                      {comparisonCrops.map((c) => (
                        <td key={c.cropId} className="py-2.5 font-medium">
                          {c.estimatedDurationDays || 120} Days
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-500">Soil Score</td>
                      {comparisonCrops.map((c) => (
                        <td key={c.cropId} className="py-2.5 font-medium">
                          {c.componentScores.soilScore}%
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-500">Sustainability Index</td>
                      {comparisonCrops.map((c) => (
                        <td key={c.cropId} className="py-2.5 font-medium text-emerald-700">
                          {c.sustainability.overallScore}/100
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-500">Primary Agronomic Advantage</td>
                      {comparisonCrops.map((c) => (
                        <td key={c.cropId} className="py-2.5 text-[11px] text-slate-600">
                          {c.reasons[0] || 'Well-suited to soil texture.'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
