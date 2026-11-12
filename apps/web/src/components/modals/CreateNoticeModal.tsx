/**
 * Create Announcement Modal
 * Real-world notice composer targeted by user roles, urgency, and physical branch
 */

import React, { useState } from 'react';
import { X, Bell } from 'lucide-react';
import { useHighStudy } from '../../context/HighStudyContext';
import { UserRole } from '@highstudy/shared-types';

interface CreateNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateNoticeModal: React.FC<CreateNoticeModalProps> = ({ isOpen, onClose }) => {
  const { publishAnnouncement, currentUser } = useHighStudy();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'HIGH' as 'NORMAL' | 'HIGH' | 'URGENT',
    targetRoles: ['STUDENT', 'PARENT', 'TEACHER'] as UserRole[],
  });

  if (!isOpen) return null;

  const handleRoleToggle = (role: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter((r) => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    publishAnnouncement({
      title: formData.title.trim(),
      content: formData.content.trim(),
      priority: formData.priority,
      targetRoles: formData.targetRoles.length > 0 ? formData.targetRoles : ['STUDENT', 'PARENT', 'TEACHER'],
      senderName: currentUser.name,
      senderRole: currentUser.role.replace('_', ' '),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Broadcast Institutional Notice</h3>
              <p className="text-[11px] text-slate-500">Notice displays immediately across all linked dashboards</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-500 font-medium mb-1">Notice Headline *</label>
            <input
              type="text"
              required
              placeholder="e.g. Schedule Revision for National Diagnostic Test"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Priority Level</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="NORMAL">Normal Advisory</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent Action Required</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Issued By</label>
              <input
                type="text"
                disabled
                value={`${currentUser.name} (${currentUser.role.replace('_', ' ')})`}
                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1.5">Target Audience</label>
            <div className="flex items-center gap-3">
              {(['STUDENT', 'PARENT', 'TEACHER'] as UserRole[]).map((role) => (
                <label key={role} className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.targetRoles.includes(role)}
                    onChange={() => handleRoleToggle(role)}
                    className="rounded-sm text-blue-600 focus:ring-0"
                  />
                  <span>{role === 'STUDENT' ? 'Students' : role === 'PARENT' ? 'Parents' : 'Teachers'}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Announcement Body Content *</label>
            <textarea
              rows={4}
              required
              placeholder="Provide complete instructions, venue details, timing, and prerequisites..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden leading-relaxed"
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
              Broadcast Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
