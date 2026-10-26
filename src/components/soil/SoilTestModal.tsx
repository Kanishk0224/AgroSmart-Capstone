import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, FlaskConical, Save, Sparkles } from 'lucide-react';
import { SoilTest, Farm } from '../../types';
import { CreateSoilTestDto, analyzeSoilHealth } from '../../services/soilService';

const soilSchema = z.object({
  farmId: z.string().min(1, 'Please select a farm plot'),
  testDate: z.string().min(1, 'Test date is required'),
  phLevel: z.number().min(0).max(14, 'pH must be between 0 and 14'),
  nitrogenLevel: z.number().min(0, 'Must be positive').max(2000, 'Check value range'),
  phosphorusLevel: z.number().min(0, 'Must be positive').max(500, 'Check value range'),
  potassiumLevel: z.number().min(0, 'Must be positive').max(1000, 'Check value range'),
  organicMatter: z.number().min(0).max(100).optional(),
  moistureContent: z.number().min(0).max(100).optional(),
  electricalConductivity: z.number().min(0).max(20).optional(),
});

type SoilFormData = z.infer<typeof soilSchema>;

interface SoilTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSoilTestDto) => Promise<void>;
  farms?: Farm[];
  testToEdit?: SoilTest | null;
  defaultFarmId?: string;
}

export const SoilTestModal: React.FC<SoilTestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  farms = [],
  testToEdit,
  defaultFarmId,
}) => {
  const safeFarms = Array.isArray(farms) ? farms : [];
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SoilFormData>({
    resolver: zodResolver(soilSchema),
    defaultValues: {
      farmId: defaultFarmId || (safeFarms.length > 0 ? safeFarms[0].id : ''),
      testDate: new Date().toISOString().split('T')[0],
      phLevel: 6.5,
      nitrogenLevel: 320,
      phosphorusLevel: 22,
      potassiumLevel: 180,
      organicMatter: 1.8,
      moistureContent: 20,
      electricalConductivity: 0.5,
    },
  });

  const watchPh = watch('phLevel') || 6.5;
  const watchN = watch('nitrogenLevel') || 320;
  const watchP = watch('phosphorusLevel') || 22;
  const watchK = watch('potassiumLevel') || 180;
  const watchOm = watch('organicMatter');

  const previewAnalysis = analyzeSoilHealth(
    Number(watchPh),
    Number(watchN),
    Number(watchP),
    Number(watchK),
    watchOm ? Number(watchOm) : undefined
  );

  useEffect(() => {
    if (testToEdit) {
      reset({
        farmId: testToEdit.farmId,
        testDate: testToEdit.testDate,
        phLevel: testToEdit.phLevel,
        nitrogenLevel: testToEdit.nitrogenLevel,
        phosphorusLevel: testToEdit.phosphorusLevel,
        potassiumLevel: testToEdit.potassiumLevel,
        organicMatter: testToEdit.organicMatter ?? 1.5,
        moistureContent: testToEdit.moistureContent ?? 18,
        electricalConductivity: testToEdit.electricalConductivity ?? 0.4,
      });
    } else {
      reset({
        farmId: defaultFarmId || (safeFarms.length > 0 ? safeFarms[0].id : ''),
        testDate: new Date().toISOString().split('T')[0],
        phLevel: 6.5,
        nitrogenLevel: 320,
        phosphorusLevel: 22,
        potassiumLevel: 180,
        organicMatter: 1.8,
        moistureContent: 20,
        electricalConductivity: 0.5,
      });
    }
  }, [testToEdit, defaultFarmId, farms, reset, isOpen]);

  if (!isOpen) return null;

  const onFormSubmit = async (data: SoilFormData) => {
    await onSubmit({
      ...data,
      phLevel: Number(data.phLevel),
      nitrogenLevel: Number(data.nitrogenLevel),
      phosphorusLevel: Number(data.phosphorusLevel),
      potassiumLevel: Number(data.potassiumLevel),
      organicMatter: data.organicMatter !== undefined ? Number(data.organicMatter) : undefined,
      moistureContent:
        data.moistureContent !== undefined ? Number(data.moistureContent) : undefined,
      electricalConductivity:
        data.electricalConductivity !== undefined
          ? Number(data.electricalConductivity)
          : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {testToEdit ? 'Edit Soil Test Record' : 'Record Laboratory Soil Test'}
              </h3>
              <p className="text-xs text-slate-500">
                Log chemical assay metrics for scientific fertility diagnostics
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Target Farm Plot *
              </label>
              <select
                {...register('farmId')}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.totalAreaAcres} ac)
                  </option>
                ))}
              </select>
              {errors.farmId && (
                <p className="text-xs text-red-500 mt-1">{errors.farmId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Sampling / Test Date *
              </label>
              <input
                type="date"
                {...register('testDate')}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
              {errors.testDate && (
                <p className="text-xs text-red-500 mt-1">{errors.testDate.message}</p>
              )}
            </div>
          </div>

          {/* Primary Chemistry: pH & N-P-K */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
              <span>Macronutrient Assay &amp; pH</span>
              <span className="text-[11px] text-slate-400 font-normal">Optimal range: 6.0 - 7.5 pH</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Soil pH *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('phLevel', { valueAsNumber: true })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-emerald-800 mb-1">
                  Nitrogen (N) *
                </label>
                <input
                  type="number"
                  placeholder="kg/ha"
                  {...register('nitrogenLevel', { valueAsNumber: true })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-amber-800 mb-1">
                  Phosphorus (P) *
                </label>
                <input
                  type="number"
                  placeholder="kg/ha"
                  {...register('phosphorusLevel', { valueAsNumber: true })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-blue-800 mb-1">
                  Potassium (K) *
                </label>
                <input
                  type="number"
                  placeholder="kg/ha"
                  {...register('potassiumLevel', { valueAsNumber: true })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Secondary Physical Factors */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Organic Matter (%)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 2.1"
                {...register('organicMatter', { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Moisture (%)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 22"
                {...register('moistureContent', { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Cond. (dS/m)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 0.45"
                {...register('electricalConductivity', { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Live Diagnostic Preview */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Live Agronomic Diagnostic
              </span>
              <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900">
                Rating: {previewAnalysis.rating}
              </span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              {previewAnalysis.recommendations}
            </p>
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
              <span>
                {isSubmitting
                  ? 'Saving...'
                  : testToEdit
                  ? 'Update Test Record'
                  : 'Save Test Record'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
