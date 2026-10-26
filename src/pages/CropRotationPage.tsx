import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  RefreshCw,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Plus,
  Trash2,
  Info,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { farmService } from '../services/farmService';
import { rotationService } from '../services/rotationService';
import { Farm, CropHistoryEntry, CropRotationEvaluation } from '../types';
import { VERIFIED_CROP_CATALOG } from '../services/cropService';

export const CropRotationPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // History entries for selected farm
  const [historyList, setHistoryList] = useState<CropHistoryEntry[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Evaluator State
  const [candidateCrop, setCandidateCrop] = useState<string>('Yellow Hybrid Maize (Corn)');
  const [previousCrop, setPreviousCrop] = useState<string>('Desi & Kabuli Chickpea');
  const [evaluation, setEvaluation] = useState<CropRotationEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // New History Entry Form State
  const [newCropName, setNewCropName] = useState('Basmati & Wetland Rice');
  const [newFamily, setNewFamily] = useState('Poaceae');
  const [newSeason, setNewSeason] = useState('KHARIF');
  const [newSowingDate, setNewSowingDate] = useState('2025-06-15');
  const [newHarvestDate, setNewHarvestDate] = useState('2025-10-20');
  const [newArea, setNewArea] = useState(10);
  const [newYield, setNewYield] = useState(25);
  const [newNotes, setNewNotes] = useState('');

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
          const hist = await rotationService.getHistoryForFarm(initialFarm);
          setHistoryList(hist);
        }
      } catch (err) {
        console.error('Error loading crop rotation:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user, location.state]);

  const handleFarmChange = async (fId: string) => {
    setSelectedFarmId(fId);
    const hist = await rotationService.getHistoryForFarm(fId);
    setHistoryList(hist);
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const res = await rotationService.evaluateRotation(candidateCrop, previousCrop);
      setEvaluation(res);
    } catch (err) {
      console.error('Failed to evaluate rotation:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleAddHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedFarmId) return;

    try {
      await rotationService.addHistoryEntry(selectedFarmId, user.uid, {
        cropName: newCropName,
        botanicalFamily: newFamily,
        season: newSeason,
        sowingDate: newSowingDate,
        harvestDate: newHarvestDate,
        areaPlantedAcres: Number(newArea),
        yieldMetricTons: Number(newYield),
        notes: newNotes,
      });
      setIsAddModalOpen(false);
      const hist = await rotationService.getHistoryForFarm(selectedFarmId);
      setHistoryList(hist);
    } catch (err) {
      console.error('Failed to log history:', err);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    if (!confirm('Delete this history record?')) return;
    await rotationService.deleteHistoryEntry(id);
    setHistoryList((prev) => prev.filter((h) => h.id !== id));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Loading crop rotation advisor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-green-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <RefreshCw className="w-96 h-96 -mr-16 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold mb-3">
            <RefreshCw className="w-3.5 h-3.5" /> Crop Rotation Planner • Pest Cycle Breaking & N-Fixation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Crop Rotation & Succession Planner</h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100 font-normal leading-relaxed">
            Mitigate soil-borne pathogen cycles, reduce root-knot nematode pressures, alternate botanical families, and maximize biological nitrogen fixation credits.
          </p>
        </div>
      </div>

      {/* Farm Selection & Action Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Select Parcel:</label>
          <select
            value={selectedFarmId}
            onChange={(e) => handleFarmChange(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.totalAreaAcres} Acres)
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Log Planted Crop History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Rotation Evaluator (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Crop Sequence Compatibility Checker</h3>
              <p className="text-xs text-slate-500">Test candidate crop against preceding harvest</p>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Preceding Cultivar (Previous Harvest)</label>
            <select
              value={previousCrop}
              onChange={(e) => setPreviousCrop(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            >
              <option value="None">None / Fallow</option>
              {VERIFIED_CROP_CATALOG.map((c) => (
                <option key={c.cropId} value={c.cropName}>
                  {c.cropName} ({c.botanicalFamily})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Cultivar (Planned Sowing)</label>
            <select
              value={candidateCrop}
              onChange={(e) => setCandidateCrop(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            >
              {VERIFIED_CROP_CATALOG.map((c) => (
                <option key={c.cropId} value={c.cropName}>
                  {c.cropName} ({c.botanicalFamily})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isEvaluating ? 'Evaluating Rotation Biology...' : 'Evaluate Rotation Synergy'}
          </button>

          {evaluation && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Rotation Compatibility Score</span>
                <span
                  className={`text-sm font-black px-2.5 py-0.5 rounded-lg ${
                    evaluation.rotationScore >= 80
                      ? 'bg-emerald-100 text-emerald-800'
                      : evaluation.rotationScore >= 60
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {evaluation.rotationScore}/100
                </span>
              </div>

              {evaluation.reasons.length > 0 && (
                <div className="space-y-1">
                  {evaluation.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              )}

              {evaluation.warnings.length > 0 && (
                <div className="space-y-1">
                  {evaluation.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Standard Recommended 3-Year Sequence */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2">ICAR Recommended 4-Season Sequence:</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950">1. Kharif: Yellow Soybean</span>
                  <p className="text-[10px] text-emerald-700">Legume • Fixes biological nitrogen (30 kg/ha)</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700">Restorative</span>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-sky-950">2. Rabi: Bread Wheat</span>
                  <p className="text-[10px] text-sky-700">Cereal • Capitalizes on residual soil nitrogen</p>
                </div>
                <span className="text-[10px] font-bold text-sky-700">Heavy Feeder</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-950">3. Zaid: Green Mungbean / Dhaincha</span>
                  <p className="text-[10px] text-amber-700">Short duration pulse / In-situ Green Manure</p>
                </div>
                <span className="text-[10px] font-bold text-amber-700">Soil Enricher</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Farm Planting History Timeline (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Historical Planting Timeline</h3>
              <p className="text-xs text-slate-500">Documented crops cultivated on this parcel</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{historyList.length} Entries Recorded</span>
          </div>

          {historyList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              No past crops logged for this farm yet. Click <strong>"Log Planted Crop History"</strong> to establish your rotation baseline.
            </div>
          ) : (
            <div className="space-y-4">
              {historyList.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{entry.cropName}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {entry.season}
                      </span>
                      {entry.botanicalFamily && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-700">
                          {entry.botanicalFamily}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Sown: {entry.sowingDate || 'N/A'} • Harvested: {entry.harvestDate || 'N/A'} • Area: {entry.areaPlantedAcres || 0} Acres
                    </p>
                    {entry.yieldMetricTons && (
                      <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                        Yield Harvested: {entry.yieldMetricTons} Metric Tons
                      </p>
                    )}
                    {entry.notes && <p className="text-[11px] text-slate-600 mt-1 italic">"{entry.notes}"</p>}
                  </div>

                  <button
                    onClick={() => handleDeleteHistory(entry.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg self-end sm:self-center transition-all"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Log History Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Log Planted Crop History</h3>
            <form onSubmit={handleAddHistory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop Name *</label>
                <select
                  value={newCropName}
                  onChange={(e) => {
                    setNewCropName(e.target.value);
                    const found = VERIFIED_CROP_CATALOG.find((c) => c.cropName === e.target.value);
                    if (found && found.botanicalFamily) setNewFamily(found.botanicalFamily);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                >
                  {VERIFIED_CROP_CATALOG.map((c) => (
                    <option key={c.cropId} value={c.cropName}>
                      {c.cropName} ({c.botanicalFamily})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Botanical Family</label>
                  <input
                    type="text"
                    value={newFamily}
                    onChange={(e) => setNewFamily(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Season</label>
                  <select
                    value={newSeason}
                    onChange={(e) => setNewSeason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  >
                    <option value="KHARIF">Kharif</option>
                    <option value="RABI">Rabi</option>
                    <option value="ZAID">Zaid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sowing Date</label>
                  <input
                    type="date"
                    value={newSowingDate}
                    onChange={(e) => setNewSowingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harvest Date</label>
                  <input
                    type="date"
                    value={newHarvestDate}
                    onChange={(e) => setNewHarvestDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Planted Acres</label>
                  <input
                    type="number"
                    value={newArea}
                    onChange={(e) => setNewArea(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Yield Achieved (MT)</label>
                  <input
                    type="number"
                    value={newYield}
                    onChange={(e) => setNewYield(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Field Observation / Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Mild rust observed in late harvest phase..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
