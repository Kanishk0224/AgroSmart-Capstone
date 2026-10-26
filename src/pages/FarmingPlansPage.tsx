import React, { useState, useEffect } from 'react';
import {
  BookmarkPlus,
  Calendar,
  Layers,
  Droplets,
  Coins,
  CheckCircle2,
  Clock,
  Trash2,
  Plus,
  ArrowRight,
  TrendingUp,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { farmService } from '../services/farmService';
import { farmingPlanService } from '../services/farmingPlanService';
import { Farm, FarmingPlan, CropSeason } from '../types';
import { VERIFIED_CROP_CATALOG } from '../services/cropService';

export const FarmingPlansPage: React.FC = () => {
  const { user } = useAuth();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [plans, setPlans] = useState<FarmingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Status Filter
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Plan Form State
  const [farmId, setFarmId] = useState('');
  const [title, setTitle] = useState('2025 Kharif High Yield Strategy');
  const [season, setSeason] = useState<CropSeason>('KHARIF');
  const [targetCrop, setTargetCrop] = useState('Yellow Seeded Soybean');
  const [areaAcres, setAreaAcres] = useState(10);
  const [sowingMonth, setSowingMonth] = useState('June-July');
  const [harvestMonth, setHarvestMonth] = useState('October-November');
  const [expectedYield, setExpectedYield] = useState(220);
  const [expectedProfit, setExpectedProfit] = useState(380000);
  const [estimatedWaterM3, setEstimatedWaterM3] = useState(20230);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const [farmList, planList] = await Promise.all([
          farmService.getFarms(user.uid),
          farmingPlanService.getFarmingPlans(user.uid),
        ]);
        setFarms(farmList);
        setPlans(planList);
        if (farmList.length > 0) {
          setFarmId(farmList[0].id);
          setAreaAcres(farmList[0].totalAreaAcres);
        }
      } catch (err) {
        console.error('Error fetching farming plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !farmId) return;

    const farm = farms.find((f) => f.id === farmId);
    if (!farm) return;

    try {
      const created = await farmingPlanService.createFarmingPlan(user.uid, {
        farmId,
        farmName: farm.name,
        title,
        season,
        targetCrop,
        areaAcres: Number(areaAcres),
        sowingMonth,
        harvestMonth,
        expectedYield: Number(expectedYield),
        yieldUnit: 'Quintals',
        expectedProfit: Number(expectedProfit),
        estimatedWaterM3: Number(estimatedWaterM3),
        status: 'PLANNED',
        notes,
      });

      setPlans((prev) => [created, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create farming plan:', err);
    }
  };

  const handleStatusChange = async (planId: string, newStatus: FarmingPlan['status']) => {
    try {
      await farmingPlanService.updateFarmingPlanStatus(planId, newStatus);
      setPlans((prev) =>
        prev.map((p) => (p.id === planId ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Delete this farming plan?')) return;
    try {
      await farmingPlanService.deleteFarmingPlan(planId);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    } catch (err) {
      console.error('Failed to delete plan:', err);
    }
  };

  const filteredPlans = plans.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Loading farming plans...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-green-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold mb-3">
            <BookmarkPlus className="w-3.5 h-3.5" /> Farm Planning • Plan & Revisit Farming Strategies
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Saved Farming Plans & Seasonal Blueprints</h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100 font-normal leading-relaxed">
            Organize seasonal cropping blueprints, track execution milestones, link hydrological water budgets, and measure actual harvest outcomes.
          </p>
        </div>
      </div>

      {/* Action Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['ALL', 'PLANNED', 'IN_PROGRESS', 'HARVESTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Farming Blueprint
        </button>
      </div>

      {/* Plans List */}
      {filteredPlans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          No farming plans saved in this view. Use the button above or save directly from the <strong>Crop Recommendation</strong> generator!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{plan.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">Parcel: {plan.farmName}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      plan.status === 'HARVESTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : plan.status === 'IN_PROGRESS'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {plan.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-emerald-700 font-black">{plan.targetCrop}</span>
                  <span className="text-slate-300">•</span>
                  <span>{plan.season} Season</span>
                  <span className="text-slate-300">•</span>
                  <span>{plan.areaAcres} Acres</span>
                </div>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">Water Allocation</span>
                    <p className="font-bold text-sky-800 mt-0.5">{plan.estimatedWaterM3.toLocaleString()} m³</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">Projected Net Profit</span>
                    <p className="font-bold text-emerald-800 mt-0.5">₹{plan.expectedProfit.toLocaleString()}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">Sowing Window</span>
                    <p className="font-bold text-slate-800 mt-0.5">{plan.sowingMonth}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">Harvest Window</span>
                    <p className="font-bold text-slate-800 mt-0.5">{plan.harvestMonth}</p>
                  </div>
                </div>

                {plan.notes && (
                  <p className="mt-3 text-[11px] text-slate-500 italic bg-slate-50/50 p-2 rounded-lg">
                    "{plan.notes}"
                  </p>
                )}
              </div>

              {/* Status Update & Delete */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <select
                  value={plan.status}
                  onChange={(e) => handleStatusChange(plan.id, e.target.value as any)}
                  className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-700 text-[11px]"
                >
                  <option value="PLANNED">Planned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="HARVESTED">Harvested</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50"
                  title="Delete Plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Seasonal Farming Plan</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Plan Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Farm *</label>
                  <select
                    value={farmId}
                    onChange={(e) => {
                      setFarmId(e.target.value);
                      const f = farms.find((item) => item.id === e.target.value);
                      if (f) setAreaAcres(f.totalAreaAcres);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    {farms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.totalAreaAcres} Ac)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Season *</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    <option value="KHARIF">Kharif</option>
                    <option value="RABI">Rabi</option>
                    <option value="ZAID">Zaid</option>
                    <option value="ALL_SEASON">Perennial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Crop *</label>
                  <select
                    value={targetCrop}
                    onChange={(e) => setTargetCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    {VERIFIED_CROP_CATALOG.map((c) => (
                      <option key={c.cropId} value={c.cropName}>
                        {c.cropName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Acreage *</label>
                  <input
                    type="number"
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sowing Calendar</label>
                  <input
                    type="text"
                    value={sowingMonth}
                    onChange={(e) => setSowingMonth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harvest Calendar</label>
                  <input
                    type="text"
                    value={harvestMonth}
                    onChange={(e) => setHarvestMonth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Projected Profit (₹)</label>
                  <input
                    type="number"
                    value={expectedProfit}
                    onChange={(e) => setExpectedProfit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Water Budget (m³)</label>
                  <input
                    type="number"
                    value={estimatedWaterM3}
                    onChange={(e) => setEstimatedWaterM3(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Agronomic Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Apply single super phosphate at basal, drip fertigation schedule..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Save Farming Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
