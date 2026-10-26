import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FlaskConical,
  Plus,
  Filter,
  Layers,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { farmService } from '../services/farmService';
import { soilService, CreateSoilTestDto } from '../services/soilService';
import { SoilTest, Farm } from '../types';
import { SoilTestCard } from '../components/soil/SoilTestCard';
import { SoilTestModal } from '../components/soil/SoilTestModal';

export const SoilTestsPage: React.FC = () => {
  const { profile, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [soilTests, setSoilTests] = useState<SoilTest[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedFarmId, setSelectedFarmId] = useState<string>('ALL');
  const [selectedRating, setSelectedRating] = useState<string>('ALL');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testToEdit, setTestToEdit] = useState<SoilTest | null>(null);

  const userId = user?.uid || profile?.uid || '';

  const loadData = async () => {
    try {
      setLoading(true);
      const [allFarms, allTests] = await Promise.all([
        farmService.getFarms(userId),
        soilService.getSoilTests(userId),
      ]);
      setFarms(allFarms);
      setSoilTests(allTests);
    } catch (err) {
      console.error('Failed to load soil test records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (searchParams.get('action') === 'new') {
      setIsModalOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams);
    }
  }, [userId]);

  const handleSaveTest = async (data: CreateSoilTestDto) => {
    if (testToEdit) {
      await soilService.updateSoilTest(testToEdit.id, data, userId);
      setTestToEdit(null);
    } else {
      await soilService.createSoilTest(data, userId);
    }
    await loadData();
  };

  const handleDeleteTest = async (test: SoilTest) => {
    if (confirm('Are you sure you want to delete this soil test record?')) {
      await soilService.deleteSoilTest(test.id, userId);
      await loadData();
    }
  };

  const filteredTests = soilTests.filter((test) => {
    const matchesFarm = selectedFarmId === 'ALL' || test.farmId === selectedFarmId;
    const matchesRating = selectedRating === 'ALL' || test.fertilityRating === selectedRating;
    return matchesFarm && matchesRating;
  });

  const farmMap = new Map(farms.map((f) => [f.id, f]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900">Soil Health &amp; Chemical Records</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              {soilTests.length} Total Assays
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Precision laboratory assays, N-P-K nutrient diagnostics, and pH balancing advisories
          </p>
        </div>

        <button
          onClick={() => {
            setTestToEdit(null);
            setIsModalOpen(true);
          }}
          disabled={farms.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Record Soil Test</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter By Plot:</span>
          </label>
          <select
            value={selectedFarmId}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Farm Parcels ({farms.length})</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <label className="text-xs font-semibold text-slate-500 uppercase ml-2">
            Status:
          </label>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Ratings</option>
            <option value="OPTIMAL">Optimal</option>
            <option value="DEFICIENT">Deficient</option>
            <option value="EXCESSIVE">Excessive</option>
            <option value="MODERATE">Moderate</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredTests.length} of {soilTests.length} tests
        </span>
      </div>

      {/* Scientific Reference Callout */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-emerald-950">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold">Agronomic Reference Standards:</span>
            <span className="text-emerald-800 ml-1">
              pH (6.0 - 7.5: Optimal) • Available N (&gt;280 kg/ha) • Available P (&gt;15 kg/ha) •
              Available K (&gt;120 kg/ha).
            </span>
          </div>
        </div>
      </div>

      {/* Soil Tests Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading soil tests...</div>
      ) : filteredTests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-3">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Soil Tests Recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {farms.length === 0
              ? 'Please register a farm parcel first before logging soil tests.'
              : 'Log your laboratory soil chemical assay to get automated recommendations.'}
          </p>
          {farms.length > 0 && (
            <button
              onClick={() => {
                setTestToEdit(null);
                setIsModalOpen(true);
              }}
              className="mt-4 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold"
            >
              Log First Soil Test
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <SoilTestCard
              key={test.id}
              test={test}
              farm={farmMap.get(test.farmId)}
              onEdit={(t) => {
                setTestToEdit(t);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteTest}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <SoilTestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTestToEdit(null);
        }}
        onSubmit={handleSaveTest}
        farms={farms}
        testToEdit={testToEdit}
      />
    </div>
  );
};
