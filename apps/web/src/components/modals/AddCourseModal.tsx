/**
 * Add Course & Curriculum Modal
 * Allows administrators to add new preparation curricula
 */

import React, { useState } from 'react';
import { X, FolderKanban } from 'lucide-react';
import { useHighStudy } from '../../context/HighStudyContext';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({ isOpen, onClose }) => {
  const { addCourse } = useHighStudy();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Medical' as 'Medical' | 'Engineering' | 'Foundation' | 'Boards' | 'Commerce',
    targetExam: 'NEET-UG 2027',
    durationMonths: 24,
    totalFee: 145000,
    description: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addCourse({
      name: formData.name.trim(),
      code: formData.code.trim() || `CRS-${Date.now().toString().slice(-4)}`,
      category: formData.category,
      targetExam: formData.targetExam,
      durationMonths: Number(formData.durationMonths) || 24,
      totalFee: Number(formData.totalFee) || 120000,
      description: formData.description.trim() || 'Comprehensive coaching program designed for competitive excellence.',
      isActive: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create Course Curriculum</h3>
              <p className="text-[11px] text-slate-500">Define target exam, duration, and tuition fee structure</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Course Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. NEET Ultimate 2-Year Masterclass"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Course Code</label>
              <input
                type="text"
                placeholder="e.g. NEET-MED-2Y"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono uppercase focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Curriculum Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="Medical">Medical (NEET / AIIMS)</option>
                <option value="Engineering">Engineering (JEE Main &amp; Adv)</option>
                <option value="Foundation">Foundation (CBSE / Olympiad)</option>
                <option value="Boards">Senior Secondary Boards</option>
                <option value="Commerce">Commerce &amp; CA Foundation</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Target Examination</label>
              <input
                type="text"
                placeholder="e.g. NEET-UG 2027"
                value={formData.targetExam}
                onChange={(e) => setFormData({ ...formData, targetExam: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Duration (Months)</label>
              <input
                type="number"
                min="1"
                max="48"
                value={formData.durationMonths}
                onChange={(e) => setFormData({ ...formData, durationMonths: parseInt(e.target.value) || 12 })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono tabular-nums focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Total Course Fee (INR) *</label>
              <input
                type="number"
                min="5000"
                value={formData.totalFee}
                onChange={(e) => setFormData({ ...formData, totalFee: parseInt(e.target.value) || 100000 })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono tabular-nums focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Program Overview &amp; Highlights</label>
            <textarea
              rows={2}
              placeholder="Describe analytical problem banks, revision schedules, and test cadence..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
            >
              Publish Curriculum
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
