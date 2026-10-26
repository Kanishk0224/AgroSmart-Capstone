import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Farm } from '../../types';

interface DeleteFarmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  farm: Farm | null;
  isDeleting: boolean;
}

export const DeleteFarmDialog: React.FC<DeleteFarmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  farm,
  isDeleting,
}) => {
  if (!isOpen || !farm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-200 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Delete Farm Plot?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-800">"{farm.name}"</span>? This will
              remove this parcel ({farm.totalAreaAcres} acres) from your active farm dashboard.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Confirm Deletion'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
