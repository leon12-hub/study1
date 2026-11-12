/**
 * Add Batch / Cohort Modal
 * Schedules a new student batch linked to physical branch and curriculum
 */

import React, { useState } from 'react';
import { X, CalendarCheck } from 'lucide-react';
import { useHighStudy } from '../../context/HighStudyContext';

interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBatchModal: React.FC<AddBatchModalProps> = ({ isOpen, onClose }) => {
  const { branches, courses, teachers, addBatch } = useHighStudy();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    branchId: branches[0]?.id || '',
    courseId: courses[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    academicYear: '2026-2027',
    startDate: '2026-04-15',
    endDate: '2027-04-30',
    roomNumber: 'Hall 101',
    timing: '09:00 AM - 02:00 PM',
    maxCapacity: 50,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const selectedBranch = branches.find((b) => b.id === formData.branchId) || branches[0];
    const selectedCourse = courses.find((c) => c.id === formData.courseId) || courses[0];

    addBatch({
      name: formData.name.trim(),
      code: formData.code.trim() || `BATCH-${Date.now().toString().slice(-4)}`,
      branchId: selectedBranch ? selectedBranch.id : 'branch-01',
      branchName: selectedBranch ? selectedBranch.name : 'Main Campus',
      courseId: selectedCourse ? selectedCourse.id : 'course-01',
      courseName: selectedCourse ? selectedCourse.name : 'Comprehensive Curriculum',
      academicYear: formData.academicYear,
      startDate: formData.startDate,
      endDate: formData.endDate,
      roomNumber: formData.roomNumber,
      timing: formData.timing,
      maxCapacity: Number(formData.maxCapacity) || 50,
      teacherIds: formData.teacherId ? [formData.teacherId] : (teachers[0] ? [teachers[0].id] : []),
      status: 'ONGOING',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Schedule New Student Batch</h3>
              <p className="text-[11px] text-slate-500">Configure classroom allocation, timing, and capacity</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Batch Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. JEE 2027 Super-Rankers"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Batch Code</label>
              <input
                type="text"
                placeholder="e.g. JEE-27-SR"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono uppercase focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Assigned Branch *</label>
              <select
                value={formData.branchId}
                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                {branches.length === 0 ? (
                  <option value="">No branch created yet</option>
                ) : (
                  branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Target Course *</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                {courses.length === 0 ? (
                  <option value="">No course created yet</option>
                ) : (
                  courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Room / Hall</label>
              <input
                type="text"
                placeholder="Hall 204"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Daily Timing</label>
              <input
                type="text"
                placeholder="09:00 AM - 02:00 PM"
                value={formData.timing}
                onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Seat Capacity</label>
              <input
                type="number"
                min="10"
                max="200"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 50 })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono tabular-nums focus:outline-hidden"
              />
            </div>
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
              className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Create Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
