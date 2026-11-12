/**
 * Add Faculty / Teacher Modal
 * Onboard faculty members with specialization and qualifications
 */

import React, { useState } from 'react';
import { X, Users } from 'lucide-react';
import { useHighStudy } from '../../context/HighStudyContext';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ isOpen, onClose }) => {
  const { addTeacher, branches } = useHighStudy();

  const [formData, setFormData] = useState({
    fullName: '',
    employeeCode: `HST-${Math.floor(200 + Math.random() * 800)}`,
    email: '',
    phone: '',
    specialization: 'Rotational Dynamics & Thermodynamics',
    qualification: 'M.Sc. Physics (IIT Delhi)',
    experienceYears: 8,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    addTeacher({
      userId: `user-teach-${Date.now()}`,
      employeeCode: formData.employeeCode,
      fullName: formData.fullName.trim(),
      email: formData.email.trim() || `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@highstudy.edu`,
      phone: formData.phone.trim() || '+91 98110 55555',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      specialization: formData.specialization,
      qualification: formData.qualification,
      experienceYears: Number(formData.experienceYears) || 5,
      assignedBranchIds: branches.map((b) => b.id),
      assignedSubjectIds: ['subj-01'],
      assignedSubjects: [formData.specialization],
      assignedBatches: [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Register Faculty Member</h3>
              <p className="text-[11px] text-slate-500">Add teaching staff with academic credentials and specialization</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Teacher Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. K. V. Raman"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Employee Code</label>
              <input
                type="text"
                value={formData.employeeCode}
                onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Email Address</label>
              <input
                type="email"
                placeholder="faculty@highstudy.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Phone Contact</label>
              <input
                type="text"
                placeholder="+91 98110 12000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Subject Specialization</label>
              <input
                type="text"
                placeholder="e.g. Organic Chemistry & Mechanisms"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Qualifications &amp; Degrees</label>
              <input
                type="text"
                placeholder="e.g. Ph.D. Chemistry, IIT Bombay"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Teaching Experience (Years)</label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 5 })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono tabular-nums focus:outline-hidden"
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
              className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Register Faculty
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
