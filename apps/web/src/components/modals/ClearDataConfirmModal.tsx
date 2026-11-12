/**
 * Clear / Reset Data Confirmation Modal
 * Allows switching between a completely fresh slate (0 records)
 * and an authentic loaded sample dataset.
 */

import React from 'react';
import { X, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { useHighStudy } from '../../context/HighStudyContext';

interface ClearDataConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClearDataConfirmModal: React.FC<ClearDataConfirmModalProps> = ({ isOpen, onClose }) => {
  const { clearAllData, loadSampleData } = useHighStudy();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Institute Database Controls</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          You can clear all preloaded mock data to start with a fresh, clean slate and build your institute records from scratch, or re-load the complete demonstration dataset at any time.
        </p>

        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              clearAllData();
              onClose();
            }}
            className="w-full p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 hover:bg-red-100/60 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data (Clean Slate — 0 Records)</span>
          </button>

          <button
            onClick={() => {
              loadSampleData();
              onClose();
            }}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-blue-500" />
            <span>Restore Complete Institute Dataset</span>
          </button>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
