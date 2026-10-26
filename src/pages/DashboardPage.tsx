import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tractor,
  FlaskConical,
  Plus,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Layers,
  Leaf,
  Droplets,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboardService';
import { farmService, CreateFarmDto } from '../services/farmService';
import { soilService, CreateSoilTestDto } from '../services/soilService';
import { DashboardStats, Farm, SoilTest } from '../types';
import { MetricCards } from '../components/dashboard/MetricCards';
import { SoilHealthChart } from '../components/dashboard/SoilHealthChart';
import { FarmDistributionChart } from '../components/dashboard/FarmDistributionChart';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { FarmModal } from '../components/farms/FarmModal';
import { SoilTestModal } from '../components/soil/SoilTestModal';

export const DashboardPage: React.FC = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [soilTests, setSoilTests] = useState<SoilTest[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);

  const userId = user?.uid || profile?.uid || '';

  const loadData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [dashStats, allFarms, allSoilTests] = await Promise.all([
        dashboardService.getDashboardStats(userId),
        farmService.getFarms(userId),
        soilService.getSoilTests(userId),
      ]);
      setStats(dashStats);
      setFarms(allFarms || []);
      setSoilTests(allSoilTests || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleCreateFarm = async (data: CreateFarmDto) => {
    await farmService.createFarm(data, userId);
    await loadData();
  };

  const handleCreateSoilTest = async (data: CreateSoilTestDto) => {
    await soilService.createSoilTest(data, userId);
    await loadData();
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold">Aggregating Farm Telemetry &amp; Soil Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome back, {profile?.fullName?.split(' ')[0] || 'Farmer'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time land holdings, soil chemistry benchmarks, and crop insights
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsFarmModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
          >
            <Tractor className="w-4 h-4" />
            <span>Add New Farm</span>
          </button>

          <button
            onClick={() => setIsSoilModalOpen(true)}
            disabled={farms.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs border border-slate-300 transition-colors disabled:opacity-40"
          >
            <FlaskConical className="w-4 h-4 text-emerald-700" />
            <span>Record Soil Test</span>
          </button>

          <button
            onClick={loadData}
            title="Refresh Data"
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs border border-slate-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real Metric Cards */}
      {stats && <MetricCards stats={stats} />}

      {/* Onboarding Cards if user has no farms */}
      {farms.length === 0 && !loading && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
            <Tractor className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Welcome to AgroSmart 360</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            You have not registered any farm parcels yet. Add your first parcel to begin logging
            soil test assays, receiving crop recommendations, and planning irrigation.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setIsFarmModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Your First Farm
            </button>
            <button
              onClick={() => navigate('/crops')}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              Explore Crop Catalog
            </button>
          </div>
        </div>
      )}

      {/* Agricultural Intelligence Quick Access Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-green-950 rounded-3xl p-6 text-white border border-emerald-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-emerald-800/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Intelligent Decision Support
            </div>
            <h3 className="text-lg font-bold text-white">Decision Support & Farm Planning</h3>
          </div>
          <button
            onClick={() => navigate('/recommendations')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            Launch Recommendation Engine <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/recommendations')}
            className="bg-emerald-900/40 hover:bg-emerald-900/70 p-4 rounded-2xl border border-emerald-700/50 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white mb-2">
                <Leaf className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Crop Recommendation</h4>
              <p className="text-[11px] text-emerald-200 leading-snug">
                Multi-criteria scoring across soil chemistry, water requirements, and season.
              </p>
            </div>
            <span className="text-[10px] text-emerald-300 font-bold mt-3 inline-flex items-center gap-1">
              Run Evaluator &rarr;
            </span>
          </div>

          <div
            onClick={() => navigate('/water-budget')}
            className="bg-emerald-900/40 hover:bg-emerald-900/70 p-4 rounded-2xl border border-emerald-700/50 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white mb-2">
                <Droplets className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Water Budgeting</h4>
              <p className="text-[11px] text-teal-200 leading-snug">
                Volumetric demand estimation with effective rainfall deductions.
              </p>
            </div>
            <span className="text-[10px] text-teal-300 font-bold mt-3 inline-flex items-center gap-1">
              Calculate Hydrology &rarr;
            </span>
          </div>

          <div
            onClick={() => navigate('/crop-rotation')}
            className="bg-emerald-900/40 hover:bg-emerald-900/70 p-4 rounded-2xl border border-emerald-700/50 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-cyan-700 flex items-center justify-center text-white mb-2">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Crop Rotation</h4>
              <p className="text-[11px] text-cyan-200 leading-snug">
                Break pest cycles and alternate botanical families for soil recovery.
              </p>
            </div>
            <span className="text-[10px] text-cyan-300 font-bold mt-3 inline-flex items-center gap-1">
              Analyze Predecessor &rarr;
            </span>
          </div>

          <div
            onClick={() => navigate('/profitability')}
            className="bg-emerald-900/40 hover:bg-emerald-900/70 p-4 rounded-2xl border border-emerald-700/50 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-green-700 flex items-center justify-center text-white mb-2">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white mb-1">Profitability & ROI</h4>
              <p className="text-[11px] text-green-200 leading-snug">
                Cultivation expense breakdowns and farmgate return models.
              </p>
            </div>
            <span className="text-[10px] text-green-300 font-bold mt-3 inline-flex items-center gap-1">
              Model Returns &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SoilHealthChart soilTests={soilTests} stats={stats} />
        <FarmDistributionChart stats={stats} />
      </div>

      {/* Activity Timeline */}
      <RecentActivity farms={farms} soilTests={soilTests} />

      {/* Modals */}
      <FarmModal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
        onSubmit={handleCreateFarm}
      />

      <SoilTestModal
        isOpen={isSoilModalOpen}
        onClose={() => setIsSoilModalOpen(false)}
        farms={farms}
        onSubmit={handleCreateSoilTest}
      />
    </div>
  );
};
