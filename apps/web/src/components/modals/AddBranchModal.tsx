/**
 * Add Physical Branch Modal
 * Real-world form to onboard new coaching institute branch locations
 */

import React, { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import { useHighStudy } from '../../context/HighStudyContext';

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBranchModal: React.FC<AddBranchModalProps> = ({ isOpen, onClose }) => {
  const { addBranch } = useHighStudy();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    branchAdminName: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.city.trim()) return;

    addBranch({
      name: formData.name.trim(),
      code: formData.code.trim() || `HS-${formData.city.substring(0, 3).toUpperCase()}`,
      city: formData.city.trim(),
      address: formData.address.trim() || `${formData.city} Central Hub`,
      phone: formData.phone.trim() || '+91 11 4920 8000',
      email: formData.email.trim() || `${formData.city.toLowerCase()}@highstudy.edu`,
      branchAdminName: formData.branchAdminName.trim() || 'Assigned Branch Director',
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
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Onboard Physical Campus Branch</h3>
              <p className="text-[11px] text-slate-500">Add a new institute facility under centralized management</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Campus Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. South Ridge Tech Campus"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Branch Code</label>
              <input
                type="text"
                placeholder="e.g. HS-SOUTH"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono uppercase focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">City *</label>
              <input
                type="text"
                required
                placeholder="e.g. Bengaluru"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Branch Director</label>
              <input
                type="text"
                placeholder="e.g. Dr. K. Srinivasan"
                value={formData.branchAdminName}
                onChange={(e) => setFormData({ ...formData, branchAdminName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Full Physical Address</label>
            <input
              type="text"
              placeholder="Plot No., Sector / Road, Landmark"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Desk Phone</label>
              <input
                type="text"
                placeholder="+91 80 4920 1200"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Official Email</label>
              <input
                type="email"
                placeholder="branch@highstudy.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
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
              className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
            >
              Create Branch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
