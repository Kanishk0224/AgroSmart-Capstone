import React from 'react';
import { Tractor, Layers, FlaskConical, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { DashboardStats } from '../../types';

interface MetricCardsProps {
  stats: DashboardStats | null;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ stats }) => {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* 1. Total Farm Acreage */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Landholding
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Tractor className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.totalAcres}
          </span>
          <span className="text-xs font-semibold text-slate-500">Acres</span>
        </div>
        <div className="mt-2 flex items-center text-xs text-slate-500">
          <span className="font-semibold text-emerald-700 mr-1">{stats.totalFarms}</span>
          <span>registered agricultural plots</span>
        </div>
      </div>

      {/* 2. Soil Tests Logged */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Soil Health Tests
          </span>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
            <FlaskConical className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.totalSoilTests}
          </span>
          <span className="text-xs font-semibold text-slate-500">Records</span>
        </div>
        <div className="mt-2 flex items-center text-xs text-slate-500">
          <span className="font-semibold text-blue-700 mr-1">{stats.optimalSoilPercent}%</span>
          <span>within optimal fertility index</span>
        </div>
      </div>

      {/* 3. Soil pH Profile */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Mean Soil pH
          </span>
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.averagePh > 0 ? stats.averagePh : '—'}
          </span>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
            {stats.averagePh >= 6.0 && stats.averagePh <= 7.5
              ? 'Optimal Range'
              : stats.averagePh < 6.0
              ? 'Acidic'
              : 'Alkaline'}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Target neutral range: 6.0 – 7.5 pH
        </div>
      </div>

      {/* 4. Nutrient Deficiencies Alert */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Nutrient Deficits
          </span>
          <div
            className={`p-2.5 rounded-xl border ${
              stats.deficientTestsCount > 0
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
            }`}
          >
            {stats.deficientTestsCount > 0 ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.deficientTestsCount}
          </span>
          <span className="text-xs font-semibold text-slate-500">Plots Flagged</span>
        </div>
        <div className="mt-2 text-xs">
          {stats.deficientTestsCount > 0 ? (
            <span className="text-amber-700 font-medium">Requires fertilizer adjustment</span>
          ) : (
            <span className="text-emerald-700 font-medium">No severe macronutrient deficits</span>
          )}
        </div>
      </div>
    </div>
  );
};
