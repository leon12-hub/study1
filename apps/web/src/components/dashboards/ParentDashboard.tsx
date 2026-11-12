/**
 * HighStudy Parent Portal — Student Monitoring System
 * Real interactive attendance logs, exam mark analysis, online fee payments,
 * and official GST invoice receipt generation across all tabs.
 */

import React, { useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  CreditCard, 
  Award, 
  CheckCircle2, 
  Download, 
  ShieldCheck,
  Eye,
  TrendingUp,
  FileCheck2,
  Check
} from 'lucide-react';
import { useHighStudy } from '../../context/HighStudyContext';
import { ReceiptViewModal } from '../modals/ReceiptViewModal';
import { FeePaymentRecord } from '@highstudy/shared-types';

interface ParentDashboardProps {
  activeTab?: string;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ activeTab = 'overview' }) => {
  const { 
    students, 
    attendance, 
    feePayments, 
    examAttempts, 
    processFeePayment 
  } = useHighStudy();

  const student = students[0];

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<FeePaymentRecord | null>(null);
  const [paymentSuccessRecord, setPaymentSuccessRecord] = useState<FeePaymentRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(student?.pendingFee || 0);
  const [paymentChannel, setPaymentChannel] = useState<'UPI' | 'NET_BANKING' | 'CREDIT_CARD'>('UPI');

  if (!student) {
    return (
      <div className="p-12 text-center space-y-3 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="text-base font-bold text-slate-900 dark:text-white">No Linked Ward Records</div>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          No student records are currently enrolled or linked under this parent profile in the institute database.
        </p>
      </div>
    );
  }

  const latestAttempt = examAttempts[0] || null;
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);

  const handlePayFee = async (e: React.FormEvent) => {
    e.preventDefault();
    const record = await processFeePayment({
      studentId: student.id,
      amount: Number(paymentAmount) || 45000,
      paymentMethod: paymentChannel,
      feeType: 'SECOND_INSTALLMENT',
    });

    setShowPaymentModal(false);
    setPaymentSuccessRecord(record);
    setTimeout(() => setPaymentSuccessRecord(null), 8000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Parent Monitoring Desk
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>Linked Ward: <strong className="text-slate-900 dark:text-white">{student.fullName}</strong></span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{student.enrollmentNumber}</span>
            <span aria-hidden="true">·</span>
            <span>{student.branchName}</span>
          </div>
        </div>

        {student.pendingFee > 0 && (
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pay Pending Fee (₹{student.pendingFee.toLocaleString()})</span>
          </button>
        )}
      </div>

      {paymentSuccessRecord && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold">Fee payment of ₹{paymentSuccessRecord.amount.toLocaleString()} confirmed!</div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Receipt #{paymentSuccessRecord.receiptNumber} generated via {paymentSuccessRecord.paymentMethod}.
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedReceipt(paymentSuccessRecord)}
            className="px-3 py-1.5 font-semibold text-xs text-emerald-800 dark:text-emerald-200 bg-white dark:bg-emerald-900/60 rounded-lg border border-emerald-300 dark:border-emerald-700 shadow-xs hover:bg-emerald-100/50"
          >
            View Official Invoice
          </button>
        </div>
      )}

      {/* Ward Status Cards (shown on Overview) */}
      {(activeTab === 'overview' || !activeTab) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Student Attendance Status</span>
              <CalendarCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {student.attendanceRate}%
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
              {studentAttendance.length} attendance sessions recorded
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Latest Mock Examination</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {latestAttempt ? `${latestAttempt.percentage}%` : `${student.overallScorePercent}%`}
            </div>
            <div className="text-[11px] text-slate-500">
              {latestAttempt ? `Scored ${latestAttempt.score}/${latestAttempt.totalMarks}` : 'Cumulative test score'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Course Fee Ledger</span>
              <CreditCard className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              ₹{(student.paidFee / 1000).toFixed(0)}k Paid
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400">
              Pending Due: ₹{(student.pendingFee / 1000).toFixed(0)}k
            </div>
          </div>
        </div>
      )}

      {/* TAB: ATTENDANCE RECORDS */}
      {(activeTab === 'overview' || activeTab === 'attendance') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Physical Classroom Attendance Record</h2>
            <span className="text-xs font-mono text-slate-400">Biometric &amp; Faculty Verified</span>
          </div>

          {studentAttendance.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              No attendance marked yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              {studentAttendance.map((att) => (
                <div key={att.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white font-mono tabular-nums">
                      {att.date}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Marked by {att.markedByTeacherName} {att.remarks && `(${att.remarks})`}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      att.status === 'PRESENT'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {att.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: PERFORMANCE & RESULTS */}
      {(activeTab === 'overview' || activeTab === 'performance') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Diagnostic Assessment Results &amp; Analytics</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Performance tracking on All-India institute mock examinations
              </p>
            </div>
          </div>

          {examAttempts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              No examination attempts completed yet. Your ward can take live diagnostic tests from their student portal.
            </div>
          ) : (
            <div className="space-y-3">
              {examAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{attempt.examTitle}</div>
                      <div className="text-slate-500 text-[11px]">
                        Taken on {new Date(attempt.submittedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {attempt.score} / {attempt.totalMarks} Marks
                      </div>
                      <div className="text-emerald-600 font-semibold text-[11px]">
                        {attempt.percentage}% ({attempt.accuracy}% accuracy) · Rank #{attempt.rank}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${attempt.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: FEES & RECEIPTS */}
      {(activeTab === 'overview' || activeTab === 'fees') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Payment Receipts &amp; Ledger</h2>
            {student.pendingFee > 0 && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                + Make Payment
              </button>
            )}
          </div>

          {feePayments.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              No payments recorded yet. Click &quot;Pay Pending Fee&quot; to test.
            </div>
          ) : (
            <div className="space-y-2.5">
              {feePayments.map((pay) => (
                <div
                  key={pay.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                      ₹{pay.amount.toLocaleString()} · {pay.paymentMethod}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Receipt: {pay.receiptNumber} · Date: {pay.paymentDate}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedReceipt(pay)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Invoice</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Online Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Tuition Installment Checkout</h3>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>

            <form onSubmit={handlePayFee} className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{student.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Course:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{student.courseName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pending Dues:</span>
                  <span className="font-mono text-amber-600 font-bold">₹{student.pendingFee.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Payment Amount (INR) *</label>
                <input
                  type="number"
                  min="1000"
                  max={student.pendingFee || 100000}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono tabular-nums text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentChannel('UPI')}
                    className={`p-2 rounded-lg border font-semibold text-center transition-colors ${
                      paymentChannel === 'UPI' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentChannel('NET_BANKING')}
                    className={`p-2 rounded-lg border font-semibold text-center transition-colors ${
                      paymentChannel === 'NET_BANKING' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    NetBanking
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentChannel('CREDIT_CARD')}
                    className={`p-2 rounded-lg border font-semibold text-center transition-colors ${
                      paymentChannel === 'CREDIT_CARD' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    Cards
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-3.5 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Receipt Modal */}
      {selectedReceipt && (
        <ReceiptViewModal payment={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
};
