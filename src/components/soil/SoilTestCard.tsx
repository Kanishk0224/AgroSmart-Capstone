import React from 'react';
import {
  FlaskConical,
  Calendar,
  Layers,
  Sparkles,
  Edit2,
  Trash2,
  Info,
} from 'lucide-react';
import { SoilTest, Farm } from '../../types';

interface SoilTestCardProps {
  test: SoilTest;
  farm?: Farm;
  onEdit: (test: SoilTest) => void;
  onDelete: (test: SoilTest) => void;
}

export const SoilTestCard: React.FC<SoilTestCardProps> = ({
  test,
  farm,
  onEdit,
  onDelete,
}) => {
  const ratingBadgeClass =
    test.fertilityRating === 'OPTIMAL'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : test.fertilityRating === 'DEFICIENT'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : test.fertilityRating === 'EXCESSIVE'
      ? 'bg-red-50 text-red-800 border-red-200'
      : 'bg-blue-50 text-blue-800 border-blue-200';

  const phStatus =
    test.phLevel >= 6.0 && test.phLevel <= 7.5
      ? 'Optimal Neutral'
      : test.phLevel < 6.0
      ? 'Acidic'
      : 'Alkaline';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {farm ? farm.name : `Farm Plot (${test.farmId.slice(0, 8)})`}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${ratingBadgeClass}`}
                >
                  {test.fertilityRating}
                </span>
              </div>
              <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Test Date: {test.testDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(test)}
              title="Edit Record"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(test)}
              title="Delete Record"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Core Metrics: pH, N, P, K */}
        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">pH Level</span>
            <span className="font-extrabold text-slate-900 text-sm">{test.phLevel.toFixed(1)}</span>
            <span className="text-[9px] block text-slate-500 mt-0.5 truncate">{phStatus}</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Nitrogen</span>
            <span className="font-extrabold text-slate-900 text-sm">{test.nitrogenLevel}</span>
            <span className="text-[9px] block text-slate-400 mt-0.5">kg/ha</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">Phosphorus</span>
            <span className="font-extrabold text-slate-900 text-sm">{test.phosphorusLevel}</span>
            <span className="text-[9px] block text-slate-400 mt-0.5">kg/ha</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-blue-700 block">Potassium</span>
            <span className="font-extrabold text-slate-900 text-sm">{test.potassiumLevel}</span>
            <span className="text-[9px] block text-slate-400 mt-0.5">kg/ha</span>
          </div>
        </div>

        {/* Secondary Parameters if available */}
        {(test.organicMatter !== undefined ||
          test.moistureContent !== undefined ||
          test.electricalConductivity !== undefined) && (
          <div className="flex flex-wrap gap-2 mt-3 text-xs text-slate-600">
            {test.organicMatter !== undefined && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                Organic Matter: <strong>{test.organicMatter}%</strong>
              </span>
            )}
            {test.moistureContent !== undefined && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                Moisture: <strong>{test.moistureContent}%</strong>
              </span>
            )}
            {test.electricalConductivity !== undefined && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                EC: <strong>{test.electricalConductivity} dS/m</strong>
              </span>
            )}
          </div>
        )}

        {/* Agronomic Advisory */}
        {test.recommendations && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Agronomic Recommendation</span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              {test.recommendations}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
