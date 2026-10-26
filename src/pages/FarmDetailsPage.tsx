import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Tractor,
  ArrowLeft,
  MapPin,
  Maximize2,
  Droplets,
  Sprout,
  FlaskConical,
  Edit2,
  Trash2,
  Plus,
  Layers,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { farmService, CreateFarmDto, UpdateFarmDto } from '../services/farmService';
import { soilService, CreateSoilTestDto } from '../services/soilService';
import { Farm, SoilTest } from '../types';
import { SoilHealthChart } from '../components/dashboard/SoilHealthChart';
import { SoilTestCard } from '../components/soil/SoilTestCard';
import { FarmModal } from '../components/farms/FarmModal';
import { DeleteFarmDialog } from '../components/farms/DeleteFarmDialog';
import { SoilTestModal } from '../components/soil/SoilTestModal';

export const FarmDetailsPage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  const { profile, user } = useAuth();

  const [farm, setFarm] = useState<Farm | null>(null);
  const [soilTests, setSoilTests] = useState<SoilTest[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);
  const [testToEdit, setTestToEdit] = useState<SoilTest | null>(null);

  const userId = user?.uid || profile?.uid || '';

  const loadFarmData = async () => {
    if (!farmId) return;
    try {
      setLoading(true);
      const [farmData, tests] = await Promise.all([
        farmService.getFarmById(farmId, userId),
        soilService.getSoilTests(userId, farmId),
      ]);
      setFarm(farmData);
      setSoilTests(tests);
    } catch (err) {
      console.error('Failed to load farm details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarmData();
  }, [farmId, userId]);

  const handleUpdateFarm = async (data: CreateFarmDto) => {
    if (!farmId) return;
    await farmService.updateFarm(farmId, data as UpdateFarmDto, userId);
    setIsEditModalOpen(false);
    await loadFarmData();
  };

  const handleDeleteFarm = async () => {
    if (!farmId) return;
    try {
      setIsDeleting(true);
      await farmService.deleteFarm(farmId, userId);
      navigate('/farms');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveSoilTest = async (data: CreateSoilTestDto) => {
    if (testToEdit) {
      await soilService.updateSoilTest(testToEdit.id, data, userId);
      setTestToEdit(null);
    } else {
      await soilService.createSoilTest(data, userId);
    }
    setIsSoilModalOpen(false);
    await loadFarmData();
  };

  const handleDeleteSoilTest = async (test: SoilTest) => {
    if (confirm('Are you sure you want to delete this soil test record?')) {
      await soilService.deleteSoilTest(test.id, userId);
      await loadFarmData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-xs text-slate-400">
        Loading farm parcel record...
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
        <h3 className="font-bold text-slate-800 text-lg">Farm Plot Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          This parcel does not exist or you do not have permission to view it.
        </p>
        <button
          onClick={() => navigate('/farms')}
          className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold"
        >
          Back to Farm List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/farms')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Farms</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Farm</span>
          </button>
          <button
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Farm Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
              <Tractor className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{farm.name}</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  Active Parcel
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{farm.location}</span>
              </p>
              {farm.notes && (
                <p className="text-xs text-slate-600 mt-2 max-w-xl italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  "{farm.notes}"
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              setTestToEdit(null);
              setIsSoilModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log Soil Test</span>
          </button>
        </div>

        {/* Parcel Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Area</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-0.5">
              {farm.totalAreaAcres} Acres
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Soil Texture</span>
            <span className="text-base font-extrabold text-slate-900 capitalize block mt-0.5">
              {farm.soilType.toLowerCase().replace('_', ' ')}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Irrigation Infrastructure
            </span>
            <span className="text-base font-extrabold text-slate-900 block mt-0.5">
              {farm.irrigationSource.replace('_', ' ')}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Primary Cultivar
            </span>
            <span className="text-base font-extrabold text-emerald-800 block mt-0.5 truncate">
              {farm.primaryCropType || 'Unassigned'}
            </span>
          </div>
        </div>
      </div>

      {/* Soil Telemetry Chart for This Farm */}
      {soilTests.length > 0 && <SoilHealthChart soilTests={soilTests} />}

      {/* Soil Test Records Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-blue-700" />
            <h3 className="text-lg font-bold text-slate-900">Soil Test History</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {soilTests.length} Records
            </span>
          </div>
        </div>

        {soilTests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300">
            <p className="text-xs text-slate-500">
              No laboratory soil tests logged for this farm parcel yet.
            </p>
            <button
              onClick={() => {
                setTestToEdit(null);
                setIsSoilModalOpen(true);
              }}
              className="mt-3 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold"
            >
              Log First Soil Test
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {soilTests.map((test) => (
              <SoilTestCard
                key={test.id}
                test={test}
                farm={farm}
                onEdit={(t) => {
                  setTestToEdit(t);
                  setIsSoilModalOpen(true);
                }}
                onDelete={handleDeleteSoilTest}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <FarmModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateFarm}
        farmToEdit={farm}
      />

      <DeleteFarmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteFarm}
        farm={farm}
        isDeleting={isDeleting}
      />

      <SoilTestModal
        isOpen={isSoilModalOpen}
        onClose={() => {
          setIsSoilModalOpen(false);
          setTestToEdit(null);
        }}
        onSubmit={handleSaveSoilTest}
        farms={[farm]}
        testToEdit={testToEdit}
        defaultFarmId={farm.id}
      />
    </div>
  );
};
