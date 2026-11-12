/**
 * HighStudy Super Admin Dashboard
 * Enterprise-level multi-branch administrative overview, financial analytics,
 * faculty allocations, and security audit logs.
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  CreditCard, 
  CalendarCheck, 
  Plus, 
  Search, 
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Branch, Batch, Course, ActivityLog, Announcement } from '@highstudy/shared-types';

interface SuperAdminDashboardProps {
  branches: Branch[];
  batches: Batch[];
  courses: Course[];
  activityLogs: ActivityLog[];
  announcements: Announcement[];
  onAddBranchClick?: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  branches,
  batches,
  courses,
  activityLogs,
  announcements,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('ALL');

  const totalStudents = branches.reduce((acc, b) => acc + b.totalStudents, 0);
  const totalTeachers = branches.reduce((acc, b) => acc + b.totalTeachers, 0);
  const totalBatches = batches.length;
  const totalRevenue = branches.reduce((acc, b) => acc + b.activeRevenue, 0);

  const filteredBatches = batches.filter((batch) => {
    const matchesBranch = selectedBranchId === 'ALL' || batch.branchId === selectedBranchId;
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          batch.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Super Administrator Console
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>HighStudy Apex Academy</span>
            <span aria-hidden="true">·</span>
            <span>Central Management Hub</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{branches.length} Active Physical Campuses</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('New physical branch onboarding modal initialized. Configures classrooms, branch admin assignment, and quota.')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Physical Branch</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Tabular Numerals, Clean surfaces) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Enrolled Students</span>
            <GraduationCap className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {totalStudents.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% YoY growth across 2 branches</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Faculty &amp; Staff</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {totalTeachers}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            <span>Ratio: 1 faculty per 21 students</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Gross Tuition Revenue</span>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            ₹{(totalRevenue / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
            <span>88.4% collected on schedule</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Institute Attendance Rate</span>
            <CalendarCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            94.2%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            <span>Based on biometric campus logs</span>
          </div>
        </div>
      </div>

      {/* Multi-Branch Performance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Physical Branch Overview</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Centralized monitoring for physical facilities, enrollments, and heads of operations
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">{branches.length} Registered Locations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-medium">
                <th className="py-3 px-5">Branch Name &amp; Code</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Branch Director</th>
                <th className="py-3 px-4 text-right">Students</th>
                <th className="py-3 px-4 text-right">Teachers</th>
                <th className="py-3 px-4 text-right">Batches</th>
                <th className="py-3 px-5 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {branches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-slate-900 dark:text-white">
                    <div>{b.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{b.code}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{b.city}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{b.branchAdminName}</td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-900 dark:text-white">
                    {b.totalStudents}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-900 dark:text-white">
                    {b.totalTeachers}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-900 dark:text-white">
                    {b.totalBatches}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                    ₹{(b.activeRevenue / 100000).toFixed(1)} Lakhs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batches & Schedules Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Batches &amp; Class Schedules</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active student cohorts across medical and engineering curricula
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search batches..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-hidden"
            >
              <option value="ALL">All Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {filteredBatches.map((batch) => (
            <div
              key={batch.id}
              className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{batch.name}</span>
                <span className="font-mono text-[10px] text-slate-500 uppercase">{batch.code}</span>
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                {batch.courseName}
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span>{batch.timing}</span>
                <span className="font-mono tabular-nums">
                  {batch.enrolledStudentsCount} / {batch.maxCapacity} Seats
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Logs & Announcements Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Institutional Announcements */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Central Announcements</h3>
            <button
              onClick={() => alert('Announcement publisher opened: select target roles, branch scoping, and priority')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              + Create Notice
            </button>
          </div>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">{a.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(a.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                  {a.content}
                </p>
                <div className="text-[10px] text-slate-400">
                  By {a.senderName} ({a.senderRole})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Audit Logs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Security &amp; Audit Trail</h3>
            <span className="text-xs font-mono text-slate-400">IP Tagged</span>
          </div>
          <div className="space-y-2.5">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">{log.userName}</span>
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums">{log.ipAddress}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300">{log.details}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{log.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
