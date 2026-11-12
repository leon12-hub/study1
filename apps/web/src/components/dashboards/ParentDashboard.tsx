/**
 * HighStudy Parent Portal — Student Monitoring System
 * Complete visibility into student attendance, test scorecards,
 * fee installments, and teacher remarks.
 */

import React, { useState } from 'react';
import { 
  ParentProfile, 
  StudentProfile, 
  AttendanceRecord, 
  FeePaymentRecord, 
  ExamAttempt 
} from '@highstudy/shared-types';
import { 
  Users, 
  CalendarCheck, 
  CreditCard, 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Download,
  ShieldCheck,
  Send
} from 'lucide-react';

interface ParentDashboardProps {
  parent: ParentProfile;
  student: StudentProfile;
  attendanceRecords: AttendanceRecord[];
  feePayments: FeePaymentRecord[];
  latestAttempt: ExamAttempt | null;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  parent,
  student,
  attendanceRecords,
  feePayments,
  latestAttempt,
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  const handlePayFee = () => {
    setShowPaymentModal(false);
    setPaymentSuccessMessage('Fee installment of ₹45,000 processed successfully via UPI Gateway. Digital receipt generated!');
    setTimeout(() => setPaymentSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Parent Monitoring Desk — {parent.fullName}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>Linked Ward: <strong className="text-slate-900 dark:text-white">{student.fullName}</strong></span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{student.enrollmentNumber}</span>
            <span aria-hidden="true">·</span>
            <span>{student.branchName}</span>
          </div>
        </div>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Pay Pending Installment (₹45,000)</span>
        </button>
      </div>

      {paymentSuccessMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{paymentSuccessMessage}</span>
        </div>
      )}

      {/* Ward Status Cards */}
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
            Present in 24 of 25 past lectures
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Latest Mock Examination</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {latestAttempt ? `${latestAttempt.percentage}%` : '89.2%'}
          </div>
          <div className="text-[11px] text-slate-500">
            NEET Grand Diagnostic Test · Cohort Rank #3
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
            Pending Due: ₹{(student.pendingFee / 1000).toFixed(0)}k (Due this month)
          </div>
        </div>
      </div>

      {/* Attendance & Faculty Remarks Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attendance Log */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Attendance Logs</h2>
            <span className="text-xs font-mono text-slate-400">Biometric Verified</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            {attendanceRecords.map((att) => (
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
        </div>

        {/* Fee Receipts & Invoice History */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Payment Receipts &amp; Ledger</h2>
            <span className="text-xs text-emerald-600 font-semibold">Authorized Invoices</span>
          </div>

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
                  onClick={() => alert(`Downloading HighStudy Official GST Invoice Receipt ${pay.receiptNumber}`)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Invoice</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Online Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Tuition Installment Checkout</h3>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>

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
                <span className="text-slate-500">Installment Due:</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">Final 3rd Installment</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-sm">
                <span>Total Amount:</span>
                <span className="font-mono text-emerald-600">₹45,000</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-500 font-medium">Select Instant Payment Channel</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2.5 rounded-lg border border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 font-semibold text-blue-700 dark:text-blue-300 text-center">
                  UPI / QR Code
                </button>
                <button className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-center">
                  Net Banking
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-3.5 py-2 text-xs text-slate-600 dark:text-slate-400 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handlePayFee}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
              >
                Confirm Payment &amp; Get Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
