/**
 * HighStudy Branch Admin Dashboard
 * Scoped physical branch operations, classroom allocation,
 * batch monitoring, and local fee desks.
 */

import React, { useState } from 'react';
import { Branch, Batch } from '@highstudy/shared-types';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  CreditCard, 
  CalendarCheck,
  DoorOpen,
  Search
} from 'lucide-react';

interface BranchAdminDashboardProps {
  branch: Branch;
  batches: Batch[];
}

export const BranchAdminDashboard: React.FC<BranchAdminDashboardProps> = ({ branch, batches }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const branchBatches = batches.filter((b) => b.branchId === branch.id);
  const filteredBatches = branchBatches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Branch Operations — {branch.name}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>Branch Code: {branch.code}</span>
            <span aria-hidden="true">·</span>
            <span>{branch.address}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{branch.phone}</span>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg font-mono">
          Branch Admin: {branch.branchAdminName}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Branch Students</span>
            <GraduationCap className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {branch.totalStudents}
          </div>
          <div className="text-[11px] text-slate-500">Across 10 ongoing batches</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Branch Faculty</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {branch.totalTeachers}
          </div>
          <div className="text-[11px] text-slate-500">Physical &amp; visiting teachers</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Classroom Utilization</span>
            <DoorOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            88%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400">8 of 9 halls active today</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Branch Collections</span>
            <CreditCard className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            ₹{(branch.activeRevenue / 100000).toFixed(1)} Lakhs
          </div>
          <div className="text-[11px] text-slate-500">92% collection target reached</div>
        </div>
      </div>

      {/* Batches in this branch */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Cohorts at this Branch</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assigned physical classrooms, timing slots, and faculty in charge
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter batches..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{batch.name}</span>
                <span className="font-mono text-[10px] text-slate-400 uppercase">{batch.code}</span>
              </div>
              <div className="text-slate-600 dark:text-slate-300 font-medium">
                {batch.courseName}
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[11px] pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span>Room: <strong className="text-slate-700 dark:text-slate-300">{batch.roomNumber}</strong></span>
                <span>{batch.timing}</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                  {batch.enrolledStudentsCount} Students
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
