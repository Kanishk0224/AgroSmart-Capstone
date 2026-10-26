import React, { useState } from 'react';
import { Settings, Database, Bell, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const SettingsPage: React.FC = () => {
  const { profile } = useAuth();
  const [measurementUnit, setMeasurementUnit] = useState('ACRES_METRIC');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">Application Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure agronomic units, data preferences, and system behavior
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {/* Measurement Units */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-4 h-4 text-emerald-800" />
          <span>Agricultural Measurement Units</span>
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Acres &amp; Metric Telemetry (Default)
              </span>
              <span className="text-[11px] text-slate-500">
                Land area in Acres, soil nutrients in kg/ha, water in millimeters / cubic meters.
              </span>
            </div>
            <input
              type="radio"
              name="unit"
              checked={measurementUnit === 'ACRES_METRIC'}
              onChange={() => setMeasurementUnit('ACRES_METRIC')}
              className="text-emerald-800 focus:ring-emerald-600 h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Hectares &amp; Metric Telemetry
              </span>
              <span className="text-[11px] text-slate-500">
                Land area in Hectares (ha), macronutrients in mg/kg (ppm).
              </span>
            </div>
            <input
              type="radio"
              name="unit"
              checked={measurementUnit === 'HECTARES'}
              onChange={() => setMeasurementUnit('HECTARES')}
              className="text-emerald-800 focus:ring-emerald-600 h-4 w-4"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Account & Data Privacy Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-800" />
          <span>Security &amp; Data Stewardship</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">Per-Farmer Isolation:</span>
            <span className="text-slate-500">
              Your farm boundaries, soil test reports, and financial calculations are private and
              accessible only by your authenticated login.
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">Verified Reference Science:</span>
            <span className="text-slate-500">
              Crop recommendations, water consumption formulas, and fertility thresholds follow
              standardized FAO and ICAR agricultural guidelines.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
