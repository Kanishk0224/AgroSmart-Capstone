import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, FlaskConical, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Farm, SoilTest } from '../../types';

interface RecentActivityProps {
  farms?: Farm[];
  soilTests?: SoilTest[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ farms = [], soilTests = [] }) => {
  const navigate = useNavigate();

  const safeFarms = Array.isArray(farms) ? farms : [];
  const safeSoilTests = Array.isArray(soilTests) ? soilTests : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Farm Plots */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Tractor className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">Registered Farm Plots</h3>
          </div>
          <button
            onClick={() => navigate('/farms')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            Manage All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3 divide-y divide-slate-100">
          {safeFarms.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No farms added yet.</p>
          ) : (
            safeFarms.slice(0, 3).map((farm) => (
              <div
                key={farm.id}
                onClick={() => navigate(`/farms/${farm.id}`)}
                className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{farm.name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {farm.location}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-800 shrink-0">
                      {farm.totalAreaAcres} Acres
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 shrink-0">
                  {farm.irrigationSource ? farm.irrigationSource.replace('_', ' ') : 'Standard'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Soil Health Tests */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-blue-700" />
            <h3 className="font-bold text-slate-900 text-sm">Recent Soil Test Records</h3>
          </div>
          <button
            onClick={() => navigate('/soil-tests')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            All Logs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3 divide-y divide-slate-100">
          {safeSoilTests.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No soil tests logged yet.</p>
          ) : (
            safeSoilTests.slice(0, 3).map((test) => {
              const ratingColor =
                test.fertilityRating === 'OPTIMAL'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : test.fertilityRating === 'DEFICIENT'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200';

              return (
                <div
                  key={test.id}
                  onClick={() => navigate('/soil-tests')}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        pH {typeof test.phLevel === 'number' ? test.phLevel.toFixed(1) : test.phLevel}
                      </span>
                      <span className="text-[11px] text-slate-400">|</span>
                      <span className="text-[11px] text-slate-600">
                        N:{test.nitrogenLevel} P:{test.phosphorusLevel} K:{test.potassiumLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{test.testDate}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${ratingColor}`}
                  >
                    {test.fertilityRating}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
