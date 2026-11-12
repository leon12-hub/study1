/**
 * Admit Student Modal
 * Complete student admission workflow with parent linking and fee allocation
 */

import React, { useState } from 'react';
import { X, GraduationCap } from 'lucide-react';
import { useHighStudy } from '../../context/HighStudyContext';

interface AdmitStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdmitStudentModal: React.FC<AdmitStudentModalProps> = ({ isOpen, onClose }) => {
  const { branches, courses, batches, admitStudent } = useHighStudy();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    dateOfBirth: '2008-05-15',
    branchId: branches[0]?.id || '',
    courseId: courses[0]?.id || '',
    batchId: batches[0]?.id || '',
    rollNumber: `26-0${Math.floor(10 + Math.random() * 90)}`,
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentRelation: 'FATHER' as 'FATHER' | 'MOTHER' | 'GUARDIAN',
    totalFee: 145000,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    const selectedBranch = branches.find((b) => b.id === formData.branchId) || branches[0];
    const selectedCourse = courses.find((c) => c.id === formData.courseId) || courses[0];
    const selectedBatch = batches.find((b) => b.id === formData.batchId) || batches[0];

    const enrollmentNum = `HS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    admitStudent({
      userId: `user-stud-${Date.now()}`,
      enrollmentNumber: enrollmentNum,
      fullName: formData.fullName.trim(),
      email: formData.email.trim() || `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@student.highstudy.edu`,
      phone: formData.phone.trim() || '+91 98765 00000',
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      branchId: selectedBranch?.id || 'branch-01',
      branchName: selectedBranch?.name || 'Main Campus',
      courseId: selectedCourse?.id || 'course-01',
      courseName: selectedCourse?.name || 'Medical Prep',
      batchId: selectedBatch?.id || 'batch-01',
      batchName: selectedBatch?.name || 'Achievers A1',
      rollNumber: formData.rollNumber,
      admissionDate: new Date().toISOString().split('T')[0],
      parentName: formData.parentName || 'Parent / Guardian',
      parentPhone: formData.parentPhone || '+91 98765 11111',
      parentEmail: formData.parentEmail || 'parent@highstudy.edu',
      parentRelation: formData.parentRelation,
      totalFee: Number(formData.totalFee) || 145000,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Admit Student &amp; Assign Cohort</h3>
              <p className="text-[11px] text-slate-500">Generates unique enrollment ID and creates financial tuition ledger</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase pt-1">
            Student Personal Credentials
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Priyanshu Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Mobile Contact</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Email Address</label>
              <input
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase pt-2">
            Academic Batch Allocation
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Campus Branch</label>
              <select
                value={formData.branchId}
                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Course Curriculum</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Batch Roster</label>
              <select
                value={formData.batchId}
                onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase pt-2">
            Parent &amp; Financial Ledger
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Parent / Guardian Name</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Sharma"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Parent Mobile</label>
              <input
                type="text"
                placeholder="+91 98110 00000"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Total Course Fee (₹)</label>
              <input
                type="number"
                value={formData.totalFee}
                onChange={(e) => setFormData({ ...formData, totalFee: parseInt(e.target.value) || 100000 })}
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
              className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
            >
              Complete Admission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
