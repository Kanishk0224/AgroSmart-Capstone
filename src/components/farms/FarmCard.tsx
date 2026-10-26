import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tractor,
  MapPin,
  Maximize2,
  Droplets,
  Sprout,
  FlaskConical,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Farm } from '../../types';

interface FarmCardProps {
  farm: Farm;
  onEdit: (farm: Farm) => void;
  onDelete: (farm: Farm) => void;
  onLogSoil: (farm: Farm) => void;
}

export const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  onEdit,
  onDelete,
  onLogSoil,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      {/* Card Header & Badges */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                {farm.name}
              </h3>
              <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{farm.location}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Plot Area
            </span>
            <span className="font-bold text-slate-900 text-sm">
              {farm.totalAreaAcres} Acres
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Soil Type
            </span>
            <span className="font-bold text-slate-800 capitalize truncate block">
              {farm.soilType.toLowerCase().replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
            <Droplets className="w-3 h-3 text-blue-500" />
            {farm.irrigationSource.replace('_', ' ')}
          </span>

          {farm.primaryCropType && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              <Sprout className="w-3 h-3 text-emerald-600" />
              {farm.primaryCropType}
            </span>
          )}
        </div>

        {farm.notes && (
          <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 italic">
            "{farm.notes}"
          </p>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => navigate(`/farms/${farm.id}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-white transition-colors border border-transparent hover:border-slate-200"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          <span>Details</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onLogSoil(farm)}
            title="Record Soil Test"
            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100/70 transition-colors"
          >
            <FlaskConical className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(farm)}
            title="Edit Farm"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(farm)}
            title="Delete Farm"
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
