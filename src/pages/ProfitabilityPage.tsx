import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Percent,
  Coins,
  Scale,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { farmService } from '../services/farmService';
import { profitabilityService } from '../services/profitabilityService';
import { Farm, ProfitabilityResponse } from '../types';
import { VERIFIED_CROP_CATALOG } from '../services/cropService';

export const ProfitabilityPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Form State
  const [cropName, setCropName] = useState<string>('Basmati & Wetland Rice');
  const [areaAcres, setAreaAcres] = useState<number>(10);
  const [seedCost, setSeedCost] = useState<number>(25000);
  const [fertilizerCost, setFertilizerCost] = useState<number>(40000);
  const [labourCost, setLabourCost] = useState<number>(55000);
  const [irrigationCost, setIrrigationCost] = useState<number>(20000);
  const [equipmentCost, setEquipmentCost] = useState<number>(30000);
  const [otherCosts, setOtherCosts] = useState<number>(12000);

  const [expectedYieldPerAcre, setExpectedYieldPerAcre] = useState<number>(24);
  const [yieldUnit, setYieldUnit] = useState<string>('Quintals');
  const [expectedPricePerUnit, setExpectedPricePerUnit] = useState<number>(2800);

  // Results State
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimate, setEstimate] = useState<ProfitabilityResponse | null>(null);
  const [savedEstimates, setSavedEstimates] = useState<ProfitabilityResponse[]>([]);

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
            recalculateCosts(f.totalAreaAcres);
          }
        }

        if ((location.state as any)?.cropName) {
          setCropName((location.state as any).cropName);
        }

        const list = await profitabilityService.getSavedEstimates(user.uid);
        setSavedEstimates(list);
      } catch (err) {
        console.error('Error loading profitability:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, location.state]);

  const recalculateCosts = (acres: number) => {
    setSeedCost(Math.round(acres * 2500));
    setFertilizerCost(Math.round(acres * 4000));
    setLabourCost(Math.round(acres * 5500));
    setIrrigationCost(Math.round(acres * 2000));
    setEquipmentCost(Math.round(acres * 3000));
    setOtherCosts(Math.round(acres * 1200));
  };

  const handleFarmChange = (fId: string) => {
    setSelectedFarmId(fId);
    const f = farms.find((farm) => farm.id === fId);
    if (f) {
      setAreaAcres(f.totalAreaAcres);
      recalculateCosts(f.totalAreaAcres);
    }
  };

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !selectedFarmId) return;

    setIsCalculating(true);
    try {
      const res = await profitabilityService.estimateProfitability(user.uid, {
        farmId: selectedFarmId,
        cropName,
        areaAcres: Number(areaAcres),
        seedCost: Number(seedCost),
        fertilizerCost: Number(fertilizerCost),
        labourCost: Number(labourCost),
        irrigationCost: Number(irrigationCost),
        equipmentCost: Number(equipmentCost),
        otherCosts: Number(otherCosts),
        expectedYieldPerAcre: Number(expectedYieldPerAcre),
        yieldUnit,
        expectedSellingPricePerUnit: Number(expectedPricePerUnit),
      });
      setEstimate(res);
      const list = await profitabilityService.getSavedEstimates(user.uid);
      setSavedEstimates(list);
    } catch (err) {
      console.error('Failed to calculate profitability:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Loading cultivation economic models...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <TrendingUp className="w-96 h-96 -mr-16 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold mb-3">
            <Coins className="w-3.5 h-3.5" /> Farm Profitability Analysis • Cost-Benefit & ROI Analysis
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Cultivation Economics & ROI Comparator</h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100 font-normal leading-relaxed">
            Project itemized input expenditures, projected farmgate revenues, break-even price thresholds, and return on investment percentages across prospective cultivars.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Cost & Yield Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Crop Financial Inputs</h3>
              <p className="text-xs text-slate-500">Itemize operational and harvesting costs</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              INR (₹) Model
            </span>
          </div>

          <form onSubmit={handleCalculate} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Farm Parcel *</label>
              <select
                value={selectedFarmId}
                onChange={(e) => handleFarmChange(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                required
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.totalAreaAcres} Acres)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Candidate Crop</label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                >
                  {VERIFIED_CROP_CATALOG.map((c) => (
                    <option key={c.cropId} value={c.cropName}>
                      {c.cropName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Acreage</label>
                <input
                  type="number"
                  value={areaAcres}
                  onChange={(e) => {
                    const a = Number(e.target.value);
                    setAreaAcres(a);
                    recalculateCosts(a);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  required
                />
              </div>
            </div>

            {/* Itemized Expenses */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block text-[11px]">Itemized Field Expenditures (₹)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-600 mb-0.5">Seeds & Seedlings (₹)</label>
                  <input
                    type="number"
                    value={seedCost}
                    onChange={(e) => setSeedCost(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 mb-0.5">Fertilizers & Amendments (₹)</label>
                  <input
                    type="number"
                    value={fertilizerCost}
                    onChange={(e) => setFertilizerCost(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 mb-0.5">Farm Labour & Weeding (₹)</label>
                  <input
                    type="number"
                    value={labourCost}
                    onChange={(e) => setLabourCost(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 mb-0.5">Irrigation & Power (₹)</label>
                  <input
                    type="number"
                    value={irrigationCost}
                    onChange={(e) => setIrrigationCost(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 mb-0.5">Machinery & Fuel (₹)</label>
                  <input
                    type="number"
                    value={equipmentCost}
                    onChange={(e) => setEquipmentCost(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-600 mb-0.5">Harvesting / Other (₹)</label>
                  <input
                    type="number"
                    value={otherCosts}
                    onChange={(e) => setOtherCosts(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Production & Yield Expectations */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Yield / Acre</label>
                <input
                  type="number"
                  value={expectedYieldPerAcre}
                  onChange={(e) => setExpectedYieldPerAcre(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Price (₹/Quintal)</label>
                <input
                  type="number"
                  value={expectedPricePerUnit}
                  onChange={(e) => setExpectedPricePerUnit(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isCalculating ? 'Computing Economic Projections...' : 'Simulate Cultivation ROI & Profits'}
            </button>
          </form>
        </div>

        {/* Right Output: Financial Metrics & Projections (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!estimate ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Economic Model Computed</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-md">
                Configure cultivation expenditures and expected APMC prices to project net return margins, cost per acre, and break-even points.
              </p>
              <button
                type="button"
                onClick={() => handleCalculate()}
                className="mt-6 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                Compute with Current Inputs
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Financial Summary Highlight Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Estimated Gross Revenue</span>
                  <p className="text-lg font-black text-slate-900 mt-1">
                    ₹{estimate.estimatedRevenue.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400">Total Yield: {estimate.expectedTotalYield} Q</span>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Total Input Costs</span>
                  <p className="text-lg font-black text-slate-900 mt-1">
                    ₹{estimate.totalCost.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400">₹{estimate.costPerAcre.toLocaleString()}/Acre</span>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-xs text-center">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase">Estimated Net Profit</span>
                  <p className="text-lg font-black text-emerald-900 mt-1">
                    ₹{estimate.estimatedProfit.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-semibold">₹{estimate.profitPerAcre.toLocaleString()}/Acre</span>
                </div>

                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 shadow-xs text-center">
                  <span className="text-[10px] text-indigo-800 font-bold uppercase">Return on Investment</span>
                  <p className="text-lg font-black text-indigo-950 mt-1">
                    {estimate.returnOnInvestmentPercent}%
                  </p>
                  <span className="text-[10px] text-indigo-700 font-semibold">ROI Margin</span>
                </div>
              </div>

              {/* Break-even & Cost Allocation */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800">Operational Breakdown & Break-Even</h4>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Break-Even Price: ₹{estimate.breakEvenPricePerUnit} / {estimate.yieldUnit}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Cost Component Proportions:</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Seeds</p>
                      <p className="font-bold text-slate-800">{estimate.costBreakdownPercent.seeds}%</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Fertilizer</p>
                      <p className="font-bold text-slate-800">{estimate.costBreakdownPercent.fertilizer}%</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Labour</p>
                      <p className="font-bold text-slate-800">{estimate.costBreakdownPercent.labour}%</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Irrigation</p>
                      <p className="font-bold text-slate-800">{estimate.costBreakdownPercent.irrigation}%</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Equipment</p>
                      <p className="font-bold text-slate-800">{estimate.costBreakdownPercent.equipment}%</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Other</p>
                      <p className="font-bold text-slate-800">{estimate.costBreakdownPercent.other}%</p>
                    </div>
                  </div>
                </div>

                {/* Risk Factors & Assumptions (Objective 7 & 10) */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Financial Sensitivity & Risk Factors:
                  </span>
                  <div className="space-y-1">
                    {estimate.riskFactors.map((r, i) => (
                      <p key={i} className="text-xs text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200">
                        • {r}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Saved Estimates History */}
              {savedEstimates.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Saved Cultivation Estimates ({savedEstimates.length})
                  </h4>
                  <div className="divide-y divide-slate-100">
                    {savedEstimates.slice(0, 5).map((est) => (
                      <div key={est.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-800">{est.cropName}</span>
                          <span className="text-slate-400 ml-2">({est.areaAcres} Acres)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-emerald-700">+₹{est.estimatedProfit.toLocaleString()}</span>
                          <span className="font-semibold text-indigo-700">({est.returnOnInvestmentPercent}% ROI)</span>
                          <button
                            onClick={() => setEstimate(est)}
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
          )}
        </div>
      </div>
    </div>
  );
};
