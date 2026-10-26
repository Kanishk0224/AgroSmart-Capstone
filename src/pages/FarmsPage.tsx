import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Tractor,
  Plus,
  Search,
  Filter,
  Layers,
  Droplets,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { farmService, CreateFarmDto, UpdateFarmDto } from '../services/farmService';
import { soilService, CreateSoilTestDto } from '../services/soilService';
import { Farm, SoilType, IrrigationSource } from '../types';
import { FarmCard } from '../components/farms/FarmCard';
import { FarmModal } from '../components/farms/FarmModal';
import { DeleteFarmDialog } from '../components/farms/DeleteFarmDialog';
import { SoilTestModal } from '../components/soil/SoilTestModal';

export const FarmsPage: React.FC = () => {
  const { profile, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSoilType, setSelectedSoilType] = useState<string>('ALL');
  const [selectedIrrigation, setSelectedIrrigation] = useState<string>('ALL');

  // Modals
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [farmToEdit, setFarmToEdit] = useState<Farm | null>(null);

  const [farmToDelete, setFarmToDelete] = useState<Farm | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Soil modal shortcut
  const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);
  const [selectedFarmForSoil, setSelectedFarmForSoil] = useState<string | undefined>();

  const userId = user?.uid || profile?.uid || '';

  const loadFarms = async () => {
    try {
      setLoading(true);
      const data = await farmService.getFarms(userId);
      setFarms(data);
    } catch (err) {
      console.error('Failed to load farms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
    if (searchParams.get('action') === 'new') {
      setIsFarmModalOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams);
    }
  }, [userId]);

  const handleSaveFarm = async (data: CreateFarmDto) => {
    if (farmToEdit) {
      await farmService.updateFarm(farmToEdit.id, data as UpdateFarmDto, userId);
    } else {
      await farmService.createFarm(data, userId);
    }
    setFarmToEdit(null);
    await loadFarms();
  };

  const handleConfirmDelete = async () => {
    if (!farmToDelete) return;
    try {
      setIsDeleting(true);
      await farmService.deleteFarm(farmToDelete.id, userId);
      setFarmToDelete(null);
      await loadFarms();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenSoilForFarm = (farm: Farm) => {
    setSelectedFarmForSoil(farm.id);
    setIsSoilModalOpen(true);
  };

  const handleSaveSoilTest = async (data: CreateSoilTestDto) => {
    await soilService.createSoilTest(data, userId);
    setIsSoilModalOpen(false);
  };

  const filteredFarms = farms.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.primaryCropType && f.primaryCropType.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSoil = selectedSoilType === 'ALL' || f.soilType === selectedSoilType;
    const matchesIrrigation =
      selectedIrrigation === 'ALL' || f.irrigationSource === selectedIrrigation;

    return matchesSearch && matchesSoil && matchesIrrigation;
  });

  const totalAcreage = farms.reduce((acc, f) => acc + (f.totalAreaAcres || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900">My Farm Parcels</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {farms.length} Plots ({totalAcreage.toFixed(1)} Acres)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, monitor, and manage your agricultural lands and soil classifications
          </p>
        </div>

        <button
          onClick={() => {
            setFarmToEdit(null);
            setIsFarmModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Farm</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by farm name, location, or crop type..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Soil Filter */}
          <select
            value={selectedSoilType}
            onChange={(e) => setSelectedSoilType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Soil Types</option>
            <option value="LOAMY">Loamy</option>
            <option value="CLAY">Clay</option>
            <option value="CLAY_LOAM">Clay Loam</option>
            <option value="SANDY">Sandy</option>
            <option value="SANDY_LOAM">Sandy Loam</option>
            <option value="SILT">Silt</option>
            <option value="PEATY">Peaty</option>
            <option value="CHALKY">Chalky</option>
          </select>

          {/* Irrigation Filter */}
          <select
            value={selectedIrrigation}
            onChange={(e) => setSelectedIrrigation(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          >
            <option value="ALL">All Irrigation</option>
            <option value="DRIP">Drip</option>
            <option value="SPRINKLER">Sprinkler</option>
            <option value="CANAL">Canal</option>
            <option value="BOREWELL">Borewell</option>
            <option value="WELL">Well</option>
            <option value="RAIN_FED">Rain Fed</option>
          </select>

          {(searchTerm || selectedSoilType !== 'ALL' || selectedIrrigation !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSoilType('ALL');
                setSelectedIrrigation('ALL');
              }}
              title="Reset filters"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Farm Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-xs text-slate-400">
          Loading farm inventory...
        </div>
      ) : filteredFarms.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-3">
            <Tractor className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Farm Parcels Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {searchTerm || selectedSoilType !== 'ALL'
              ? 'No farms match your search or filter criteria. Try resetting filters.'
              : 'You have not registered any farm parcels yet. Click below to register your first plot.'}
          </p>
          <button
            onClick={() => {
              setFarmToEdit(null);
              setIsFarmModalOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold"
          >
            Add Your First Farm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => (
            <FarmCard
              key={farm.id}
              farm={farm}
              onEdit={(f) => {
                setFarmToEdit(f);
                setIsFarmModalOpen(true);
              }}
              onDelete={(f) => setFarmToDelete(f)}
              onLogSoil={handleOpenSoilForFarm}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <FarmModal
        isOpen={isFarmModalOpen}
        onClose={() => {
          setIsFarmModalOpen(false);
          setFarmToEdit(null);
        }}
        onSubmit={handleSaveFarm}
        farmToEdit={farmToEdit}
      />

      <DeleteFarmDialog
        isOpen={!!farmToDelete}
        onClose={() => setFarmToDelete(null)}
        onConfirm={handleConfirmDelete}
        farm={farmToDelete}
        isDeleting={isDeleting}
      />

      <SoilTestModal
        isOpen={isSoilModalOpen}
        onClose={() => setIsSoilModalOpen(false)}
        onSubmit={handleSaveSoilTest}
        farms={farms}
        defaultFarmId={selectedFarmForSoil}
      />
    </div>
  );
};
