/**
 * HighStudy Teacher Dashboard & Workspace
 * Interactive tools for batch attendance marking, assignment evaluation,
 * study material uploads, and student performance tracking.
 */

import React, { useState } from 'react';
import { 
  TeacherProfile, 
  Batch, 
  StudyMaterial, 
  Assignment, 
  AssignmentSubmission, 
  AttendanceRecord 
} from '@highstudy/shared-types';
import { 
  Users, 
  BookOpen, 
  FileCheck2, 
  CalendarCheck, 
  Upload, 
  Check, 
  Clock, 
  Search,
  MessageSquare
} from 'lucide-react';

interface TeacherDashboardProps {
  teacher: TeacherProfile;
  batches: Batch[];
  materials: StudyMaterial[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  attendanceRecords: AttendanceRecord[];
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  batches,
  materials,
  assignments,
  submissions,
  attendanceRecords,
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || 'batch-01');
  const [attendanceRoster, setAttendanceRoster] = useState<Array<{ id: string; name: string; roll: string; status: 'PRESENT' | 'ABSENT' | 'LATE' }>>([
    { id: 'stud-001', name: 'Aarav Sharma', roll: '26A1-14', status: 'PRESENT' },
    { id: 'stud-002', name: 'Pooja Verma', roll: '26A1-15', status: 'PRESENT' },
    { id: 'stud-003', name: 'Rohan Mehra', roll: '26A1-16', status: 'LATE' },
    { id: 'stud-004', name: 'Kavya Nair', roll: '26A1-17', status: 'PRESENT' },
    { id: 'stud-005', name: 'Aditya Gupta', roll: '26A1-18', status: 'ABSENT' },
  ]);
  const [attendanceSavedMessage, setAttendanceSavedMessage] = useState<string | null>(null);

  // Submissions state
  const [submissionList, setSubmissionList] = useState(submissions);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [evalMarks, setEvalMarks] = useState<number>(47);
  const [evalFeedback, setEvalFeedback] = useState<string>('Exceptional grasp of torque equilibrium!');

  const handleToggleAttendance = (studentId: string, newStatus: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceRoster((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s))
    );
  };

  const handleSaveAttendance = () => {
    setAttendanceSavedMessage('Attendance successfully recorded to central PostgreSQL database!');
    setTimeout(() => setAttendanceSavedMessage(null), 3500);
  };

  const handleSaveEvaluation = () => {
    if (!selectedSubmission) return;
    setSubmissionList((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubmission.id
          ? {
              ...sub,
              status: 'EVALUATED',
              obtainedMarks: evalMarks,
              teacherFeedback: evalFeedback,
              evaluatedAt: new Date().toISOString(),
            }
          : sub
      )
    );
    setSelectedSubmission(null);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Profile & Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Faculty Workspace — {teacher.fullName}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>Specialization: {teacher.specialization}</span>
            <span aria-hidden="true">·</span>
            <span>Employee ID: {teacher.employeeCode}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">Rating: {teacher.rating} / 5.0</span>
          </div>
        </div>

        <button
          onClick={() => alert('New study material upload drawer: select batch, attach PDF/Video URL, and specify chapter.')}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Study Material / VOD</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Assigned Batches</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {teacher.assignedBatches.length} Active Cohorts
          </div>
          <div className="text-[11px] text-slate-500">
            Total 76 students under mentorship
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Published Study Resources</span>
            <BookOpen className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {materials.length} Documents &amp; VODs
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
            455 total student downloads
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Pending Homework Evaluations</span>
            <FileCheck2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {assignments.reduce((acc, a) => acc + (a.totalStudents - a.submissionsCount), 0)} Pending
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400">
            Due this Friday
          </div>
        </div>
      </div>

      {/* Attendance Marking Module */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-blue-600" />
              <span>Mark Lecture Attendance</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Batch: NEET 2026 Achievers A1 · Subject: Physics for Medical · Hall 302
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAttendance}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Attendance Record</span>
            </button>
          </div>
        </div>

        {attendanceSavedMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{attendanceSavedMessage}</span>
          </div>
        )}

        <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
          {attendanceRoster.map((student) => (
            <div
              key={student.id}
              className="px-4 py-3 flex items-center justify-between text-xs bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{student.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{student.roll}</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {(['PRESENT', 'ABSENT', 'LATE'] as const).map((status) => {
                  const isActive = student.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => handleToggleAttendance(student.id, status)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                        isActive
                          ? status === 'PRESENT'
                            ? 'bg-emerald-600 text-white'
                            : status === 'ABSENT'
                            ? 'bg-red-600 text-white'
                            : 'bg-amber-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Evaluation Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Assignment Evaluation Desk</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review submitted solutions, award rubric marks, and return personalized pedagogical feedback
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {submissionList.map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {sub.studentName}
                  </span>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Submitted: {new Date(sub.submittedAt).toLocaleString()} · Assignment: Rotational Motion Set 03
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-600 font-bold tabular-nums">
                    {sub.obtainedMarks !== undefined ? `${sub.obtainedMarks} / 50 Marks` : 'Pending Review'}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setEvalMarks(sub.obtainedMarks || 45);
                      setEvalFeedback(sub.teacherFeedback || '');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 rounded-lg hover:opacity-90"
                  >
                    {sub.status === 'EVALUATED' ? 'Edit Evaluation' : 'Evaluate'}
                  </button>
                </div>
              </div>

              {sub.teacherFeedback && (
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">Teacher Feedback: </strong>
                  {sub.teacherFeedback}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inline Evaluation Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Evaluate Submission — {selectedSubmission.studentName}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Marks Awarded (Max 50)</label>
                <input
                  type="number"
                  value={evalMarks}
                  onChange={(e) => setEvalMarks(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Pedagogical Feedback</label>
                <textarea
                  rows={3}
                  value={evalFeedback}
                  onChange={(e) => setEvalFeedback(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvaluation}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Evaluation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
