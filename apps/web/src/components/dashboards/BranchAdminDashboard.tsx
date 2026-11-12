/**
 * HighStudy Branch Admin Dashboard
 * Scoped physical branch operations, classroom allocation,
 * batch monitoring, local fee desks, and attendance logs.
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  CreditCard, 
  DoorOpen,
  Search,
  Plus,
  CalendarCheck,
  Check,
  Receipt,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  MapPin
} from 'lucide-react';
import { useHighStudy } from '../../context/HighStudyContext';
import { AddBatchModal } from '../modals/AddBatchModal';
import { AdmitStudentModal } from '../modals/AdmitStudentModal';
import { ReceiptViewModal } from '../modals/ReceiptViewModal';
import { FeePaymentRecord } from '@highstudy/shared-types';

interface BranchAdminDashboardProps {
  activeTab?: string;
}

export const BranchAdminDashboard: React.FC<BranchAdminDashboardProps> = ({ activeTab = 'overview' }) => {
  const { 
    branches, 
    batches, 
    students, 
    teachers, 
    attendance, 
    markBatchAttendance, 
    currentUser,
    processFeePayment,
    feePayments
  } = useHighStudy();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || '');
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [isAdmitStudentOpen, setIsAdmitStudentOpen] = useState(false);

  // Fee collection desk state
  const [selectedStudentForFee, setSelectedStudentForFee] = useState<string>('');
  const [feeCollectionAmount, setFeeCollectionAmount] = useState<number>(25000);
  const [feePaymentMethod, setFeePaymentMethod] = useState<'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'CASH'>('UPI');
  const [feeSuccessRecord, setFeeSuccessRecord] = useState<FeePaymentRecord | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<FeePaymentRecord | null>(null);

  // Attendance desk state
  const [attendanceBatchId, setAttendanceBatchId] = useState<string>('');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});
  const [attendanceNotice, setAttendanceNotice] = useState<string | null>(null);

  const activeBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  if (!activeBranch) {
    return (
      <div className="p-12 text-center space-y-3 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="text-base font-bold text-slate-900 dark:text-white">No Campuses Configured</div>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          No physical branch records have been added to the central database yet. Please use the Super Admin console to register the first physical campus.
        </p>
      </div>
    );
  }

  const branchBatches = batches.filter((b) => b.branchId === activeBranch.id);
  const branchStudents = students.filter((s) => s.branchId === activeBranch.id);

  const filteredBatches = branchBatches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = branchStudents.filter((s) =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.batchName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Attendance batch selection
  const currentAttendanceBatch = branchBatches.find((b) => b.id === (attendanceBatchId || branchBatches[0]?.id));
  const attendanceBatchStudents = branchStudents.filter((s) => s.batchId === currentAttendanceBatch?.id);

  const handleToggleAttendance = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    if (!currentAttendanceBatch || attendanceBatchStudents.length === 0) return;
    const records = attendanceBatchStudents.map((s) => ({
      studentId: s.id,
      studentName: s.fullName,
      roll: s.rollNumber,
      status: attendanceMap[s.id] || 'PRESENT',
    }));

    markBatchAttendance(
      currentAttendanceBatch.id,
      currentAttendanceBatch.name,
      records,
      currentUser.name
    );

    setAttendanceNotice(`Recorded attendance for ${records.length} students in ${currentAttendanceBatch.name}. Synced to central server.`);
    setTimeout(() => setAttendanceNotice(null), 4000);
  };

  const handleCollectFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForFee) return;

    const record = await processFeePayment({
      studentId: selectedStudentForFee,
      amount: Number(feeCollectionAmount) || 25000,
      paymentMethod: feePaymentMethod,
      feeType: 'SECOND_INSTALLMENT',
    });

    setFeeSuccessRecord(record);
    setSelectedStudentForFee('');
    setTimeout(() => setFeeSuccessRecord(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Branch Operations Desk — {activeBranch.name}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>Branch Code: <strong className="text-slate-700 dark:text-slate-300 font-mono">{activeBranch.code}</strong></span>
            <span aria-hidden="true">·</span>
            <span>{activeBranch.address}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{activeBranch.phone}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {branches.length > 1 && (
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
              ))}
            </select>
          )}

          <button
            onClick={() => setIsAddBatchOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Batch</span>
          </button>

          <button
            onClick={() => setIsAdmitStudentOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-blue-500" />
            <span>Admit Student</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (shown on overview) */}
      {(activeTab === 'overview' || !activeTab) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Branch Students</span>
              <GraduationCap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {branchStudents.length}
            </div>
            <div className="text-[11px] text-slate-500">Across {branchBatches.length} ongoing cohorts</div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Faculty Allocated</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {teachers.length}
            </div>
            <div className="text-[11px] text-slate-500">Assigned teachers</div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Classroom Capacity</span>
              <DoorOpen className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {branchBatches.length > 0 ? `${branchBatches.length} Active Halls` : '0 Halls'}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Classrooms allocated</div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Branch Revenue</span>
              <CreditCard className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              ₹{((activeBranch.activeRevenue || 0) / 100000).toFixed(1)} L
            </div>
            <div className="text-[11px] text-slate-500">Branch accounts</div>
          </div>
        </div>
      )}

      {/* TAB: BATCHES / OVERVIEW BATCHES LIST */}
      {(activeTab === 'overview' || activeTab === 'batches') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Cohorts at {activeBranch.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Assigned physical classrooms, timing slots, and enrolled student lists
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter cohorts by name or code..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          {filteredBatches.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
              <div>No batches scheduled at this physical branch yet.</div>
              <button
                onClick={() => setIsAddBatchOpen(true)}
                className="px-3.5 py-1.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                + Schedule First Batch
              </button>
            </div>
          ) : (
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
                      {students.filter((s) => s.batchId === batch.id).length} Students
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: STUDENTS */}
      {activeTab === 'students' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Students Enrolled at {activeBranch.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live roster of admitted candidates, enrollment codes, and fee statuses
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <button
                onClick={() => setIsAdmitStudentOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Admit Student</span>
              </button>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              No students enrolled matching &quot;{searchTerm}&quot; at this branch.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              {filteredStudents.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{s.fullName}</span>
                      <span className="font-mono text-[10px] text-slate-400">({s.enrollmentNumber})</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {s.courseName} · Batch: {s.batchName} · Parent: {s.parentName} ({s.parentPhone})
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-[11px] text-slate-500">Attendance</div>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{s.attendanceRate}%</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">Tuition Status</div>
                      <div className="font-mono font-bold text-emerald-600">
                        {s.pendingFee > 0 ? `₹${(s.pendingFee / 1000).toFixed(0)}k Due` : 'Fully Paid'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: ATTENDANCE DESK */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-blue-600" />
                <span>Branch Attendance Desk</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log biometric or roll-call attendance for physical campus sessions
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={attendanceBatchId || branchBatches[0]?.id || ''}
                onChange={(e) => setAttendanceBatchId(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {branchBatches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name} (Room {b.roomNumber})</option>
                ))}
              </select>

              <button
                onClick={handleSaveAttendance}
                disabled={attendanceBatchStudents.length === 0}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Attendance Log</span>
              </button>
            </div>
          </div>

          {attendanceNotice && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{attendanceNotice}</span>
            </div>
          )}

          {attendanceBatchStudents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              No students enrolled in this cohort yet. Click &quot;Admit Student&quot; to register candidates.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              {attendanceBatchStudents.map((s) => {
                const status = attendanceMap[s.id] || 'PRESENT';
                return (
                  <div
                    key={s.id}
                    className="p-3.5 flex items-center justify-between text-xs bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{s.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Roll #{s.rollNumber} · {s.enrollmentNumber}</div>
                    </div>

                    <div className="flex items-center gap-1">
                      {(['PRESENT', 'ABSENT', 'LATE'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleToggleAttendance(s.id, opt)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                            status === opt
                              ? opt === 'PRESENT'
                                ? 'bg-emerald-600 text-white'
                                : opt === 'ABSENT'
                                ? 'bg-red-600 text-white'
                                : 'bg-amber-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: BRANCH FEE COUNTER */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Branch Cash &amp; Digital Fee Collection Counter</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Process walk-in student fee installments, issue signed tax receipts, and update accounting ledgers
              </p>
            </div>

            {feeSuccessRecord && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold">Collection of ₹{feeSuccessRecord.amount.toLocaleString()} Recorded!</div>
                    <div className="text-[11px]">Invoice #{feeSuccessRecord.receiptNumber} generated via {feeSuccessRecord.paymentMethod}.</div>
                  </div>
                </div>
                <button
                  onClick={() => setViewingReceipt(feeSuccessRecord)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 rounded-lg shadow-xs"
                >
                  Print Receipt
                </button>
              </div>
            )}

            <form onSubmit={handleCollectFee} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Select Candidate *</label>
                  <select
                    required
                    value={selectedStudentForFee}
                    onChange={(e) => {
                      setSelectedStudentForFee(e.target.value);
                      const stud = branchStudents.find((s) => s.id === e.target.value);
                      if (stud && stud.pendingFee > 0) {
                        setFeeCollectionAmount(stud.pendingFee);
                      }
                    }}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="">-- Choose enrolled student --</option>
                    {branchStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.enrollmentNumber}) — Due: ₹{s.pendingFee.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Amount to Collect (INR) *</label>
                  <input
                    type="number"
                    required
                    min="500"
                    value={feeCollectionAmount}
                    onChange={(e) => setFeeCollectionAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1">Payment Method *</label>
                  <select
                    value={feePaymentMethod}
                    onChange={(e) => setFeePaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="UPI">UPI / QR Transfer</option>
                    <option value="NET_BANKING">Net Banking / NEFT</option>
                    <option value="CREDIT_CARD">Credit / Debit Card</option>
                    <option value="CASH">Cash at Campus Desk</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="submit"
                  disabled={!selectedStudentForFee}
                  className="px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Process Payment &amp; Issue Receipt</span>
                </button>
              </div>
            </form>
          </div>

          {/* Historical Payments at Branch */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Branch Transaction Receipts</h3>
            {feePayments.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                No fee collections logged yet.
              </div>
            ) : (
              <div className="space-y-2">
                {feePayments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                        ₹{p.amount.toLocaleString()} · {p.paymentMethod}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Candidate: {p.studentName} · Receipt #{p.receiptNumber} · Date: {p.paymentDate}
                      </div>
                    </div>

                    <button
                      onClick={() => setViewingReceipt(p)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Receipt</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddBatchModal isOpen={isAddBatchOpen} onClose={() => setIsAddBatchOpen(false)} />
      <AdmitStudentModal isOpen={isAdmitStudentOpen} onClose={() => setIsAdmitStudentOpen(false)} />
      {viewingReceipt && (
        <ReceiptViewModal payment={viewingReceipt} onClose={() => setViewingReceipt(null)} />
      )}
    </div>
  );
};
