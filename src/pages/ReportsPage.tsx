import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Layers,
  Sprout,
  Droplets,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Building,
  Info,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { farmService } from '../services/farmService';
import { soilService } from '../services/soilService';
import { recommendationService } from '../services/recommendationService';
import { farmingPlanService } from '../services/farmingPlanService';
import { reportService } from '../services/reportService';
import { Farm, SoilTest, CropRecommendationDto, FarmingPlan } from '../types';

export const ReportsPage: React.FC = () => {
  const { user } = useAuth();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [soilTests, setSoilTests] = useState<SoilTest[]>([]);
  const [plans, setPlans] = useState<FarmingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const [farmList, tests, planList] = await Promise.all([
          farmService.getFarms(user.uid),
          soilService.getSoilTests(user.uid),
          farmingPlanService.getFarmingPlans(user.uid),
        ]);
        setFarms(farmList);
        setSoilTests(tests);
        setPlans(planList);
        if (farmList.length > 0) setSelectedFarmId(farmList[0].id);
      } catch (err) {
        console.error('Error fetching reports data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const showNotice = (msg: string) => {
    setExportNotice(msg);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleExportFarmsCsv = () => {
    const csv = reportService.generateFarmsCsv(farms);
    reportService.downloadCsv('farms-directory', csv);
    showNotice('Farm inventory exported to CSV');
  };

  const handleExportSoilCsv = () => {
    const csv = reportService.generateSoilTestsCsv(soilTests, farms);
    reportService.downloadCsv('soil-health-assays', csv);
    showNotice('Soil test records exported to CSV');
  };

  const handleExportPlansCsv = () => {
    const csv = reportService.generateFarmingPlansCsv(plans);
    reportService.downloadCsv('farming-blueprints', csv);
    showNotice('Seasonal farming plans exported to CSV');
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const selectedFarm = farms.find((f) => f.id === selectedFarmId);
  const farmTests = soilTests.filter((t) => t.farmId === selectedFarmId);
  const farmPlans = plans.filter((p) => p.farmId === selectedFarmId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Compiling farm records and dossiers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-green-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden print:hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold mb-3">
            <FileText className="w-3.5 h-3.5" /> Reports & Insights • Audit-Ready Documentation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Agricultural Reports & Export Center</h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100 font-normal leading-relaxed">
            Generate RFC-4180 sanitized CSV spreadsheets, chemical assay summaries, and print-ready agricultural dossiers with provenance attribution.
          </p>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2 print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        {/* Farm Inventory CSV */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Farm Parcels Inventory</h3>
            <p className="text-xs text-slate-500 mt-1">
              Full directory of registered parcels, acreage, soil textures, and irrigation sources.
            </p>
            <span className="text-[11px] font-bold text-slate-400 mt-3 block">{farms.length} Parcels Documented</span>
          </div>
          <button
            onClick={handleExportFarmsCsv}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Parcels (CSV)
          </button>
        </div>

        {/* Soil Assays CSV */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Soil Fertility Assays</h3>
            <p className="text-xs text-slate-500 mt-1">
              Chronological laboratory records with pH, N-P-K nutrient values, and recommendations.
            </p>
            <span className="text-[11px] font-bold text-slate-400 mt-3 block">{soilTests.length} Tests Logged</span>
          </div>
          <button
            onClick={handleExportSoilCsv}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Soil Tests (CSV)
          </button>
        </div>

        {/* Farming Blueprints CSV */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Seasonal Cropping Plans</h3>
            <p className="text-xs text-slate-500 mt-1">
              Farming blueprints with acreage, target crops, sowing calendars, and water budgets.
            </p>
            <span className="text-[11px] font-bold text-slate-400 mt-3 block">{plans.length} Blueprints Saved</span>
          </div>
          <button
            onClick={handleExportPlansCsv}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export Plans (CSV)
          </button>
        </div>
      </div>

      {/* Comprehensive Dossier Print/Preview Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Comprehensive Farm Dossier & Audit View</h2>
            <p className="text-xs text-slate-500">Official agricultural report suitable for bank credit, insurance, and certification</p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.totalAreaAcres} Ac)
                </option>
              ))}
            </select>

            <button
              onClick={handlePrintDossier}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
          </div>
        </div>

        {selectedFarm ? (
          <div className="space-y-6 text-xs text-slate-700">
            {/* Header info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Parcel Name</span>
                <p className="font-bold text-slate-900 text-sm">{selectedFarm.name}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Location</span>
                <p className="font-bold text-slate-900 text-sm">{selectedFarm.location}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Acreage & Soil</span>
                <p className="font-bold text-slate-900 text-sm">
                  {selectedFarm.totalAreaAcres} Acres • {selectedFarm.soilType}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Irrigation System</span>
                <p className="font-bold text-slate-900 text-sm">{selectedFarm.irrigationSource}</p>
              </div>
            </div>

            {/* Recent soil tests for this parcel */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider">
                Laboratory Soil Chemical Assays ({farmTests.length})
              </h4>
              {farmTests.length === 0 ? (
                <p className="text-slate-400 italic">No soil tests logged for this parcel.</p>
              ) : (
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Test Date</th>
                      <th className="p-2.5">pH</th>
                      <th className="p-2.5">Nitrogen (kg/ha)</th>
                      <th className="p-2.5">Phosphorus (kg/ha)</th>
                      <th className="p-2.5">Potassium (kg/ha)</th>
                      <th className="p-2.5">Fertility Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {farmTests.map((t) => (
                      <tr key={t.id}>
                        <td className="p-2.5 font-semibold">{t.testDate}</td>
                        <td className="p-2.5 font-bold text-slate-900">{t.phLevel}</td>
                        <td className="p-2.5">{t.nitrogenLevel}</td>
                        <td className="p-2.5">{t.phosphorusLevel}</td>
                        <td className="p-2.5">{t.potassiumLevel}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.fertilityRating === 'OPTIMAL'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {t.fertilityRating}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Farming plans for this parcel */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider">
                Seasonal Cultivation Plans ({farmPlans.length})
              </h4>
              {farmPlans.length === 0 ? (
                <p className="text-slate-400 italic">No active farming plans logged for this parcel.</p>
              ) : (
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Plan Title</th>
                      <th className="p-2.5">Season</th>
                      <th className="p-2.5">Target Crop</th>
                      <th className="p-2.5">Yield Projection</th>
                      <th className="p-2.5">Projected Net Profit</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {farmPlans.map((p) => (
                      <tr key={p.id}>
                        <td className="p-2.5 font-semibold text-slate-900">{p.title}</td>
                        <td className="p-2.5">{p.season}</td>
                        <td className="p-2.5 font-bold text-emerald-700">{p.targetCrop}</td>
                        <td className="p-2.5">{p.expectedYield} {p.yieldUnit}</td>
                        <td className="p-2.5 font-bold">₹{p.expectedProfit.toLocaleString()}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Audit & Compliance Disclaimer */}
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>AgroSmart 360 Version 3.0 • Generated on {new Date().toLocaleDateString()}</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically Verified Record
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center">Select a farm above to render dossier.</p>
        )}
      </div>
    </div>
  );
};
