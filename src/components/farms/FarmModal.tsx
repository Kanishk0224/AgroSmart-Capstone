import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Tractor, Save } from 'lucide-react';
import { Farm, SoilType, IrrigationSource } from '../../types';
import { CreateFarmDto } from '../../services/farmService';

const farmSchema = z.object({
  name: z.string().min(2, 'Farm name must be at least 2 characters').max(120, 'Maximum 120 characters'),
  location: z.string().min(2, 'Location is required').max(200, 'Maximum 200 characters'),
  totalAreaAcres: z
    .number()
    .positive('Area must be greater than zero')
    .max(50000, 'Please enter a valid acreage'),
  soilType: z.enum([
    'CLAY',
    'SANDY',
    'LOAMY',
    'SILT',
    'PEATY',
    'CHALKY',
    'CLAY_LOAM',
    'SANDY_LOAM',
  ] as const),
  irrigationSource: z.enum([
    'CANAL',
    'BOREWELL',
    'DRIP',
    'SPRINKLER',
    'RAIN_FED',
    'RIVER_LIFT',
    'WELL',
  ] as const),
  primaryCropType: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
});

type FarmFormData = z.infer<typeof farmSchema>;

interface FarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFarmDto) => Promise<void>;
  farmToEdit?: Farm | null;
}

export const FarmModal: React.FC<FarmModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  farmToEdit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FarmFormData>({
    resolver: zodResolver(farmSchema),
    defaultValues: {
      name: '',
      location: '',
      totalAreaAcres: 10,
      soilType: 'LOAMY',
      irrigationSource: 'DRIP',
      primaryCropType: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (farmToEdit) {
      reset({
        name: farmToEdit.name,
        location: farmToEdit.location,
        totalAreaAcres: farmToEdit.totalAreaAcres,
        soilType: farmToEdit.soilType,
        irrigationSource: farmToEdit.irrigationSource,
        primaryCropType: farmToEdit.primaryCropType || '',
        notes: farmToEdit.notes || '',
      });
    } else {
      reset({
        name: '',
        location: '',
        totalAreaAcres: 5,
        soilType: 'LOAMY',
        irrigationSource: 'DRIP',
        primaryCropType: '',
        notes: '',
      });
    }
  }, [farmToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: FarmFormData) => {
    await onSubmit({
      ...data,
      totalAreaAcres: Number(data.totalAreaAcres),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {farmToEdit ? 'Update Farm Details' : 'Register Agricultural Farm'}
              </h3>
              <p className="text-xs text-slate-500">
                Enter your agricultural parcel metrics and soil texture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Farm Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Green Valley Farm, North Sector"
              {...register('name')}
              className={`w-full px-3.5 py-2 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
                errors.name ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Location / District *
              </label>
              <input
                type="text"
                placeholder="e.g. Nashik, Maharashtra"
                {...register('location')}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
                  errors.location ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                }`}
              />
              {errors.location && (
                <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Total Area (Acres) *
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 12.5"
                {...register('totalAreaAcres', { valueAsNumber: true })}
                className={`w-full px-3.5 py-2 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
                  errors.totalAreaAcres ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                }`}
              />
              {errors.totalAreaAcres && (
                <p className="text-xs text-red-500 mt-1">{errors.totalAreaAcres.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Soil Classification *
              </label>
              <select
                {...register('soilType')}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              >
                <option value="LOAMY">Loamy Soil (Balanced)</option>
                <option value="CLAY">Clay Soil (High Retention)</option>
                <option value="CLAY_LOAM">Clay Loam</option>
                <option value="SANDY">Sandy Soil (Fast Draining)</option>
                <option value="SANDY_LOAM">Sandy Loam</option>
                <option value="SILT">Silt Soil</option>
                <option value="PEATY">Peaty Soil (High Organic)</option>
                <option value="CHALKY">Chalky Soil (Alkaline)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Irrigation Source *
              </label>
              <select
                {...register('irrigationSource')}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              >
                <option value="DRIP">Drip Irrigation (High Efficiency)</option>
                <option value="SPRINKLER">Sprinkler System</option>
                <option value="CANAL">Government Canal Supply</option>
                <option value="BOREWELL">Deep Borewell</option>
                <option value="WELL">Open Surface Well</option>
                <option value="RIVER_LIFT">River Lift Scheme</option>
                <option value="RAIN_FED">Rain-Fed (Monsoon Dependent)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Primary Cultivated Crop
            </label>
            <input
              type="text"
              placeholder="e.g. Wheat, Basmati Rice, Pomegranate, Cotton"
              {...register('primaryCropType')}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Agronomic Notes &amp; Topography
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Gentle eastern slope, fertile black cotton soil with micro-nutrient history"
              {...register('notes')}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : farmToEdit ? 'Update Farm' : 'Save Farm'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
