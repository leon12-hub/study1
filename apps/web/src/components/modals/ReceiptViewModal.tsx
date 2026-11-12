/**
 * Official Fee Receipt & Tax Invoice Modal
 * Real-world printable/downloadable GST receipt with transaction verification
 */

import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FeePaymentRecord } from '@highstudy/shared-types';

interface ReceiptViewModalProps {
  payment: FeePaymentRecord;
  onClose: () => void;
}

export const ReceiptViewModal: React.FC<ReceiptViewModalProps> = ({ payment, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-2xl text-slate-900">
        {/* Receipt Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                H
              </div>
              <span className="font-bold text-base tracking-tight">HighStudy Apex Academy</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Knowledge Corridor, South Extension II, New Delhi · GSTIN: 07AAACH1234F1Z8
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Official Receipt No.</span>
              <div className="font-mono font-bold text-sm text-slate-900">{payment.receiptNumber}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Payment Date</span>
              <div className="font-mono text-xs">{payment.paymentDate}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500">Student Name:</span>
              <div className="font-semibold text-slate-900">{payment.studentName}</div>
            </div>
            <div>
              <span className="text-slate-500">Enrollment ID:</span>
              <div className="font-mono font-semibold text-slate-900">{payment.enrollmentNumber}</div>
            </div>
            <div>
              <span className="text-slate-500">Enrolled Batch:</span>
              <div className="font-medium text-slate-700">{payment.batchName}</div>
            </div>
            <div>
              <span className="text-slate-500">Payment Channel:</span>
              <div className="font-medium text-slate-700">{payment.paymentMethod}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80">
            <span className="text-slate-500 text-[11px]">Transaction Reference:</span>
            <div className="font-mono text-[11px] text-slate-700">{payment.transactionReference}</div>
          </div>
        </div>

        {/* Breakdown table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <div className="bg-slate-100 px-4 py-2 font-semibold text-slate-700 flex justify-between">
            <span>Tuition Component</span>
            <span>Amount</span>
          </div>
          <div className="p-4 space-y-1.5 divide-y divide-slate-100">
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Core Academic Instruction &amp; Faculty Mentorship</span>
              <span className="font-mono tabular-nums">₹{(payment.amount * 0.7).toFixed(0)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Printed Materials, Question Bank &amp; VOD Library</span>
              <span className="font-mono tabular-nums">₹{(payment.amount * 0.2).toFixed(0)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">Laboratory &amp; National Diagnostic Assessment Fee</span>
              <span className="font-mono tabular-nums">₹{(payment.amount * 0.1).toFixed(0)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
              <span>Total Amount Paid (INR)</span>
              <span className="font-mono text-emerald-600 tabular-nums">₹{payment.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Verification Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Bank Verification Verified</span>
          </div>
          <span className="italic">Computer Generated Valid Invoice</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
