/**
 * HighStudy Super Admin Dashboard
 * Comprehensive multi-tab governance supporting all 8 console modules:
 * Executive Overview, Branch Operations, Courses, Batches, Students,
 * Teachers, Fees & Collections, and Security Audit Logs.
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
  TrendingUp,
  Trash2,
  FolderKanban,
  ClipboardList,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useHighStudy } from '../../context/HighStudyContext';
import { AddBranchModal } from '../modals/AddBranchModal';
import { AddCourseModal } from '../modals/AddCourseModal';
import { AddBatchModal } from '../modals/AddBatchModal';
import { AdmitStudentModal } from '../modals/AdmitStudentModal';
import { AddTeacherModal } from '../modals/AddTeacherModal';
import { CreateNoticeModal } from '../modals/CreateNoticeModal';
import { ReceiptViewModal } from '../modals/ReceiptViewModal';
import { FeePaymentRecord } from '@highstudy/shared-types';

interface SuperAdminDashboardProps {
  activeTab?: string;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ activeTab = 'overview' }) => {
  const { 
    branches, 
    courses, 
    batches, 
    students, 
    teachers, 
    feePayments,
    activityLogs, 
    announcements, 
    deleteBranch,
    loadSampleData
  } = useHighStudy();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('ALL');

  // Modals state
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isAdmitStudentOpen, setIsAdmitStudentOpen] = useState(false);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isCreateNoticeOpen, setIsCreateNoticeOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<FeePaymentRecord | null>(null);

  // Calculations
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalBatches = batches.length;
  const totalRevenue = branches.reduce((acc, b) => acc + (b.activeRevenue || 0), 0) +
                       students.reduce((acc, s) => acc + (s.paidFee || 0), 0);

  const avgAttendance = students.length > 0
    ? (students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / students.length).toFixed(1)
    : '0.0';

  // -----------------------------------------------------------------
  // TAB 1: EXECUTIVE OVERVIEW
  // -----------------------------------------------------------------
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Enrolled Students</span>
            <GraduationCap className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {totalStudents}
          </div>
          <div className="text-[11px] text-slate-500">Across {batches.length} batches</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Faculty Registry</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {totalTeachers}
          </div>
          <div className="text-[11px] text-slate-500">Full-time teaching staff</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Collections</span>
            <CreditCard className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            ₹{(totalRevenue / 100000).toFixed(1)} L
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Gross tuition revenue</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Mean Attendance</span>
            <CalendarCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {avgAttendance}%
          </div>
          <div className="text-[11px] text-slate-500">Calculated from lecture logs</div>
        </div>
      </div>

      {/* Physical Campuses Snapshot */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Physical Campuses Snapshot</h2>
            <p className="text-xs text-slate-500">All facilities operating under unified central governance</p>
          </div>
          <button
            onClick={() => setIsAddBranchOpen(true)}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            + Add Campus
          </button>
        </div>

        {branches.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <div>No branches registered yet.</div>
            <button
              onClick={() => setIsAddBranchOpen(true)}
              className="px-3 py-1.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              + Create First Branch
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-5">Branch Name</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Director</th>
                  <th className="py-3 px-4 text-right">Students</th>
                  <th className="py-3 px-4 text-right">Cohorts</th>
                  <th className="py-3 px-5 text-right">Collections</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {branches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-5 font-medium text-slate-900 dark:text-white">
                      {b.name} <span className="text-[11px] text-slate-400 font-mono">({b.code})</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{b.city}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{b.branchAdminName}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {students.filter((s) => s.branchId === b.id).length}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {batches.filter((bt) => bt.branchId === b.id).length}
                    </td>
                    <td className="py-3 px-5 text-right font-mono tabular-nums font-semibold">
                      ₹{((b.activeRevenue || 0) / 100000).toFixed(1)} L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notices & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Notices</h3>
            <button
              onClick={() => setIsCreateNoticeOpen(true)}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              + Create Notice
            </button>
          </div>
          <div className="space-y-2">
            {announcements.slice(0, 3).map((a) => (
              <div key={a.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-1">
                <div className="font-semibold text-slate-900 dark:text-white">{a.title}</div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{a.content}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent System Operations</h3>
            <span className="text-xs font-mono text-slate-400">Audit Stream</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
            {activityLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">{log.userName}: </span>
                  <span className="text-slate-600 dark:text-slate-300">{log.details}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{log.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // -----------------------------------------------------------------
  // TAB 2: BRANCH OPERATIONS
  // -----------------------------------------------------------------
  const renderBranchesTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Physical Branch Management</h2>
          <p className="text-xs text-slate-500">Manage all institute campus locations, classrooms, and branch directors</p>
        </div>
        <button
          onClick={() => setIsAddBranchOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Physical Campus</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((b) => (
          <div key={b.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{b.name}</span>
                <div className="text-slate-500 text-[11px] font-mono mt-0.5">{b.code} · {b.city}</div>
              </div>
              <button
                onClick={() => deleteBranch(b.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                title="Delete branch"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-slate-600 dark:text-slate-300">
              <div>Address: {b.address}</div>
              <div>Phone: <span className="font-mono">{b.phone}</span> · Email: {b.email}</div>
              <div>Director in Charge: <strong className="text-slate-900 dark:text-white">{b.branchAdminName}</strong></div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="font-bold font-mono text-slate-900 dark:text-white">
                  {students.filter((s) => s.branchId === b.id).length}
                </div>
                <div className="text-[10px] text-slate-500">Students</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="font-bold font-mono text-slate-900 dark:text-white">
                  {batches.filter((bt) => bt.branchId === b.id).length}
                </div>
                <div className="text-[10px] text-slate-500">Batches</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="font-bold font-mono text-emerald-600">
                  ₹{((b.activeRevenue || 0) / 100000).toFixed(1)} L
                </div>
                <div className="text-[10px] text-slate-500">Revenue</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // -----------------------------------------------------------------
  // TAB 3: COURSES & CURRICULUM
  // -----------------------------------------------------------------
  const renderCoursesTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Curriculum &amp; Courses Catalog</h2>
          <p className="text-xs text-slate-500">Medical, Engineering, and Foundation programs</p>
        </div>
        <button
          onClick={() => setIsAddCourseOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((c) => (
          <div key={c.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-blue-600 dark:text-blue-400">{c.category}</span>
                <span className="font-mono text-[10px] text-slate-400">{c.code}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</h3>
              <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">{c.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Exam:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{c.targetExam}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-mono">{c.durationMonths} Months</span>
              </div>
              <div className="flex justify-between font-bold text-sm pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Tuition Fee:</span>
                <span className="font-mono text-emerald-600">₹{c.totalFee.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // -----------------------------------------------------------------
  // TAB 4: BATCH SCHEDULES
  // -----------------------------------------------------------------
  const renderBatchesTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Batch Rosters &amp; Scheduling</h2>
          <p className="text-xs text-slate-500">Physical classroom allocation, daily hours, and cohort capacity</p>
        </div>
        <button
          onClick={() => setIsAddBatchOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule New Batch</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {batches.map((b) => {
          const enrolled = students.filter((s) => s.batchId === b.id).length;
          const percent = Math.min(100, (enrolled / b.maxCapacity) * 100);
          return (
            <div key={b.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{b.name}</span>
                <span className="font-mono text-[10px] text-slate-400 uppercase">{b.code}</span>
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                <div>Curriculum: <strong>{b.courseName}</strong></div>
                <div>Campus: {b.branchName} · Room: <strong>{b.roomNumber}</strong></div>
                <div>Timings: {b.timing}</div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Seat Occupancy:</span>
                  <span className="font-mono font-semibold">{enrolled} / {b.maxCapacity} Seats ({percent.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // -----------------------------------------------------------------
  // TAB 5: ADMISSIONS & STUDENTS
  // -----------------------------------------------------------------
  const renderStudentsTab = () => {
    const filteredStudents = students.filter((s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Admissions &amp; Enrolled Students</h2>
            <p className="text-xs text-slate-500">Complete student roster with parent linkage and fee records</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => setIsAdmitStudentOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Admit Student</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-5">Student Name</th>
                  <th className="py-3 px-4">Enrollment ID</th>
                  <th className="py-3 px-4">Enrolled Batch</th>
                  <th className="py-3 px-4">Parent Contact</th>
                  <th className="py-3 px-4 text-right">Attendance</th>
                  <th className="py-3 px-5 text-right">Fee Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-5 font-medium text-slate-900 dark:text-white">
                      <div>{s.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Roll: {s.rollNumber}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">{s.enrollmentNumber}</td>
                    <td className="py-3 px-4">{s.batchName}</td>
                    <td className="py-3 px-4">
                      <div>{s.parentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.parentPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                      {s.attendanceRate}%
                    </td>
                    <td className="py-3 px-5 text-right font-mono tabular-nums">
                      <div className="font-semibold text-emerald-600">₹{(s.paidFee || 0).toLocaleString()} Paid</div>
                      {s.pendingFee > 0 && (
                        <div className="text-[10px] text-amber-600">₹{s.pendingFee.toLocaleString()} Due</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // -----------------------------------------------------------------
  // TAB 6: FACULTY DIRECTORY
  // -----------------------------------------------------------------
  const renderTeachersTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Faculty &amp; Teaching Registry</h2>
          <p className="text-xs text-slate-500">Academic mentors across Physics, Chemistry, Biology, and Mathematics</p>
        </div>
        <button
          onClick={() => setIsAddTeacherOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Faculty Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teachers.map((t) => (
          <div key={t.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={t.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'}
                alt={t.fullName}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{t.fullName}</span>
                <div className="text-slate-500 text-[11px] font-mono">{t.employeeCode} · {t.experienceYears} Years Exp</div>
              </div>
            </div>

            <div className="space-y-1 text-slate-600 dark:text-slate-300">
              <div>Specialization: <strong>{t.specialization}</strong></div>
              <div>Qualifications: {t.qualification}</div>
              <div>Contact: <span className="font-mono">{t.phone}</span> · {t.email}</div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Student Satisfaction Rating:</span>
              <span className="font-mono font-bold text-amber-500">★ {t.rating} / 5.0</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // -----------------------------------------------------------------
  // TAB 7: FEES & COLLECTIONS
  // -----------------------------------------------------------------
  const renderFinanceTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Fees &amp; Financial Ledgers</h2>
          <p className="text-xs text-slate-500">Verified payment receipts, online transactions, and audit records</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {feePayments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No payment receipts generated yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-5">Receipt No.</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {feePayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-5 font-mono font-bold text-slate-900 dark:text-white">{p.receiptNumber}</td>
                    <td className="py-3 px-4">{p.studentName}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">{p.paymentMethod}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{p.transactionReference}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{p.paymentDate}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-600">
                      ₹{p.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => setViewingReceipt(p)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // -----------------------------------------------------------------
  // TAB 8: SECURITY & AUDIT LOGS
  // -----------------------------------------------------------------
  const renderAuditTab = () => (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security &amp; Audit Trail Console</h2>
        <p className="text-xs text-slate-500">Real-time IP-tagged records of all institutional transactions and admissions</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
        <div className="space-y-2">
          {activityLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 flex items-start gap-3 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0" />
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{log.userName} ({log.userRole})</span>
                  <span className="text-[10px] text-slate-400 font-mono tabular-nums">{new Date(log.timestamp).toLocaleString()} · IP: {log.ipAddress}</span>
                </div>
                <div className="text-slate-700 dark:text-slate-300">{log.details}</div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-semibold">{log.action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Route according to activeTab */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'branches' && renderBranchesTab()}
      {activeTab === 'courses' && renderCoursesTab()}
      {activeTab === 'batches' && renderBatchesTab()}
      {activeTab === 'students' && renderStudentsTab()}
      {activeTab === 'teachers' && renderTeachersTab()}
      {activeTab === 'finance' && renderFinanceTab()}
      {activeTab === 'audit' && renderAuditTab()}

      {/* Interactive Creation Modals */}
      <AddBranchModal isOpen={isAddBranchOpen} onClose={() => setIsAddBranchOpen(false)} />
      <AddCourseModal isOpen={isAddCourseOpen} onClose={() => setIsAddCourseOpen(false)} />
      <AddBatchModal isOpen={isAddBatchOpen} onClose={() => setIsAddBatchOpen(false)} />
      <AdmitStudentModal isOpen={isAdmitStudentOpen} onClose={() => setIsAdmitStudentOpen(false)} />
      <AddTeacherModal isOpen={isAddTeacherOpen} onClose={() => setIsAddTeacherOpen(false)} />
      <CreateNoticeModal isOpen={isCreateNoticeOpen} onClose={() => setIsCreateNoticeOpen(false)} />

      {/* View Official Invoice Modal */}
      {viewingReceipt && (
        <ReceiptViewModal payment={viewingReceipt} onClose={() => setViewingReceipt(null)} />
      )}
    </div>
  );
};
