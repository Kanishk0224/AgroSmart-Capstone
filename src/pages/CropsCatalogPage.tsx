import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Search,
  Filter,
  Info,
  Droplets,
  Calendar,
  Layers,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  X,
} from 'lucide-react';
import { cropService } from '../services/cropService';
import { Crop, CropCategory, CropSeason, SoilType } from '../types';

export const CropsCatalogPage: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [soilFilter, setSoilFilter] = useState<string>('ALL');
  const [seasonFilter, setSeasonFilter] = useState<string>('ALL');

  // Selected crop for modal
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

  useEffect(() => {
    const fetchCrops = async () => {
      setLoading(true);
      try {
        const list = await cropService.getAllCrops({
          category: categoryFilter,
          soilType: soilFilter,
          season: seasonFilter,
        });
        setCrops(list);
      } catch (err) {
        console.error('Error fetching crops:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, [categoryFilter, soilFilter, seasonFilter]);

  const filteredCrops = crops.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = c.cropName.toLowerCase().includes(q);
      const matchSci = c.scientificName?.toLowerCase().includes(q);
      const matchFam = c.botanicalFamily?.toLowerCase().includes(q);
      return matchName || matchSci || matchFam;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-green-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-semibold mb-3">
            <Sprout className="w-3.5 h-3.5" /> Explore Crop Varieties • Verified Agronomic Knowledge Base
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Agricultural Crop Catalog & Encyclopedia</h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100 font-normal leading-relaxed">
            Standardized agronomic benchmarks verified against ICAR & FAO research databases with physiological thresholds, N-P-K nutrient envelopes, and rotation compatibility.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by crop name, scientific taxon, or botanical family..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700"
            >
              <option value="ALL">All Categories</option>
              <option value="CEREAL">Cereal</option>
              <option value="PULSE">Pulse (Legume)</option>
              <option value="OILSEED">Oilseed</option>
              <option value="FIBRE">Fibre</option>
              <option value="CASH_CROP">Cash Crop</option>
              <option value="HORTICULTURE">Horticulture</option>
            </select>

            <select
              value={soilFilter}
              onChange={(e) => setSoilFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700"
            >
              <option value="ALL">All Soil Textures</option>
              <option value="LOAMY">Loamy</option>
              <option value="CLAY">Clay</option>
              <option value="CLAY_LOAM">Clay Loam</option>
              <option value="SANDY_LOAM">Sandy Loam</option>
              <option value="SILT">Silt</option>
              <option value="SANDY">Sandy</option>
            </select>

            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700"
            >
              <option value="ALL">All Seasons</option>
              <option value="KHARIF">Kharif (Monsoon)</option>
              <option value="RABI">Rabi (Winter)</option>
              <option value="ZAID">Zaid (Summer)</option>
              <option value="ALL_SEASON">Perennial / All Season</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Showing {filteredCrops.length} verified agronomic cultivars</span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> High Evidence Confidence
          </span>
        </div>
      </div>

      {/* Crop Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 text-xs">Loading cultivar encyclopedia...</div>
      ) : filteredCrops.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          No crops matched your filter criteria. Try resetting filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <div
              key={crop.cropId}
              onClick={() => setSelectedCrop(crop)}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {crop.cropName}
                    </h3>
                    {crop.scientificName && (
                      <p className="text-xs text-slate-400 italic font-medium">{crop.scientificName}</p>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    {crop.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mt-2">
                  {crop.description || 'Verified cultivar profile based on ICAR agronomic research.'}
                </p>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">Water Requirement</span>
                    <p className="font-bold text-sky-800 mt-0.5">{crop.waterRequirementMm} mm</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">pH Band</span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {crop.minimumSuitablePH} - {crop.maximumSuitablePH}
                    </p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">Growing Window</span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {crop.growingDurationDaysMin}-{crop.growingDurationDaysMax} Days
                    </p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">Botanical Family</span>
                    <p className="font-bold text-emerald-800 mt-0.5">{crop.botanicalFamily || 'General'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
                <span>Inspect Full Dossier</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop Detail Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedCrop.cropName}</h3>
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                    {selectedCrop.category}
                  </span>
                </div>
                {selectedCrop.scientificName && (
                  <p className="text-xs text-slate-500 italic mt-0.5">
                    {selectedCrop.scientificName} • Family: {selectedCrop.botanicalFamily}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedCrop.description && (
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedCrop.description}
              </p>
            )}

            {/* Physiological & Agronomic Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Optimal Soil pH</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">
                  {selectedCrop.minimumSuitablePH} - {selectedCrop.maximumSuitablePH}
                </p>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                <span className="text-[10px] text-sky-600 font-bold uppercase">Water Requirement</span>
                <p className="font-bold text-sky-950 text-sm mt-0.5">{selectedCrop.waterRequirementMm} mm</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-[10px] text-amber-700 font-bold uppercase">Thermal Comfort</span>
                <p className="font-bold text-amber-950 text-sm mt-0.5">
                  {selectedCrop.minTemperatureCelsius}° - {selectedCrop.maxTemperatureCelsius}°C
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 font-bold uppercase">Nitrogen Band</span>
                <p className="font-bold text-emerald-950 text-sm mt-0.5">
                  {selectedCrop.minNitrogenKgPerHa} - {selectedCrop.maxNitrogenKgPerHa} kg/ha
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 font-bold uppercase">Phosphorus Band</span>
                <p className="font-bold text-emerald-950 text-sm mt-0.5">
                  {selectedCrop.minPhosphorusKgPerHa} - {selectedCrop.maxPhosphorusKgPerHa} kg/ha
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[10px] text-emerald-700 font-bold uppercase">Potassium Band</span>
                <p className="font-bold text-emerald-950 text-sm mt-0.5">
                  {selectedCrop.minPotassiumKgPerHa} - {selectedCrop.maxPotassiumKgPerHa} kg/ha
                </p>
              </div>
            </div>

            {/* Suitable Soils & Seasons */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Suitable Soil Textures:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCrop.suitableSoilTypes.map((st) => (
                    <span key={st} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Customary Sowing Seasons:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCrop.suitableSeasons.map((season) => (
                    <span key={season} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md font-semibold border border-emerald-200">
                      {season}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCrop.goodFollowers && selectedCrop.goodFollowers.length > 0 && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Synergic Rotation Predecessors / Followers:</span>
                  <p className="text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {selectedCrop.goodFollowers.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Provenance & Citation Metadata (Objective 2) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Agronomic Provenance & Scientific Citation
              </div>
              <p>Reference: {selectedCrop.sourceReferences}</p>
              <p>Last Verified: {selectedCrop.sourceUpdatedAt} • Confidence Level: {selectedCrop.dataConfidence}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCrop(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
