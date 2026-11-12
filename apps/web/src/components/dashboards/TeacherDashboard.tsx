/**
 * HighStudy Teacher Dashboard & Workspace
 * Interactive attendance marking, study material uploader,
 * assignment evaluations, curriculum management, and exam desk across all tabs.
 */

import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  FileCheck2, 
  CalendarCheck, 
  Upload, 
  Check, 
  Plus,
  Eye,
  Clock,
  ClipboardList,
  Award,
  TrendingUp,
  Search,
  Trash2
} from 'lucide-react';
import { useHighStudy } from '../../context/HighStudyContext';
import { UploadMaterialModal } from '../modals/UploadMaterialModal';
import { AssignmentSubmission } from '@highstudy/shared-types';

interface TeacherDashboardProps {
  activeTab?: string;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ activeTab = 'overview' }) => {
  const { 
    batches, 
    students, 
    materials, 
    assignments, 
    submissions, 
    markBatchAttendance, 
    evaluateSubmission,
    currentUser,
    addAssignment,
    exams,
    createExam,
    examAttempts,
    deleteStudyMaterial
  } = useHighStudy();

  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddAsnOpen, setIsAddAsnOpen] = useState(false);
  const [attendanceSavedMessage, setAttendanceSavedMessage] = useState<string | null>(null);

  // Filter students by selected batch, or show all if batch has no explicit filter
  const batchStudents = students.filter((s) => !selectedBatchId || s.batchId === selectedBatchId);
  const displayStudents = batchStudents.length > 0 ? batchStudents : students;

  // Local attendance status tracking before save
  const [attendanceStatusMap, setAttendanceStatusMap] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});

  // Submissions review
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [evalMarks, setEvalMarks] = useState<number>(45);
  const [evalFeedback, setEvalFeedback] = useState<string>('Strong analytical approach and clear steps.');

  // New Assignment form state
  const [newAsnTitle, setNewAsnTitle] = useState('');
  const [newAsnMaxMarks, setNewAsnMaxMarks] = useState(50);

  // New Exam creation state
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamDuration, setNewExamDuration] = useState(45);
  const [newExamMarks, setNewExamMarks] = useState(20);

  const getStudentStatus = (studentId: string): 'PRESENT' | 'ABSENT' | 'LATE' => {
    return attendanceStatusMap[studentId] || 'PRESENT';
  };

  const handleToggleAttendance = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceStatusMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = () => {
    if (displayStudents.length === 0) return;
    const currentBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
    const records = displayStudents.map((s) => ({
      studentId: s.id,
      studentName: s.fullName,
      roll: s.rollNumber,
      status: getStudentStatus(s.id),
    }));

    markBatchAttendance(
      currentBatch?.id || 'batch-01',
      currentBatch?.name || 'Assigned Cohort',
      records,
      currentUser.name
    );

    setAttendanceSavedMessage(`Attendance logged for ${records.length} students! Data synced to student & parent portals.`);
    setTimeout(() => setAttendanceSavedMessage(null), 4000);
  };

  const handleSaveEvaluation = () => {
    if (!selectedSubmission) return;
    evaluateSubmission(selectedSubmission.id, evalMarks, evalFeedback);
    setSelectedSubmission(null);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsnTitle.trim()) return;

    addAssignment({
      title: newAsnTitle.trim(),
      description: 'Solve all numerical calculation exercises and show complete free-body force equations.',
      subjectId: 'subj-01',
      subjectName: 'Physics for Medical',
      batchId: selectedBatchId || batches[0]?.id || 'batch-01',
      batchName: batches.find((b) => b.id === selectedBatchId)?.name || 'NEET Achievers A1',
      assignedByTeacherName: currentUser.name,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      maxMarks: Number(newAsnMaxMarks) || 50,
    });

    setNewAsnTitle('');
    setIsAddAsnOpen(false);
  };

  const handleCreateExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle.trim()) return;

    createExam({
      title: newExamTitle.trim(),
      courseId: 'course-01',
      courseName: 'NEET Ultimate 2-Year Medical Masterclass',
      batchIds: [selectedBatchId || batches[0]?.id || 'batch-01'],
      batchNames: [batches.find((b) => b.id === selectedBatchId)?.name || 'NEET Achievers A1'],
      totalQuestions: 5,
      totalMarks: Number(newExamMarks) || 20,
      passingMarks: Math.round((Number(newExamMarks) || 20) * 0.4),
      durationMinutes: Number(newExamDuration) || 45,
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      type: 'MOCK_TEST',
      questions: [
        {
          id: `q-new-${Date.now()}-1`,
          subjectId: 'subj-01',
          subjectName: 'Physics',
          questionText: 'Which of the following is true regarding work done by conservative forces along a closed trajectory?',
          difficulty: 'MEDIUM',
          options: [
            { id: 'opt-a', optionText: 'Strictly zero', isCorrect: true },
            { id: 'opt-b', optionText: 'Depends on velocity', isCorrect: false },
            { id: 'opt-c', optionText: 'Infinite', isCorrect: false },
            { id: 'opt-d', optionText: 'Proportional to path length', isCorrect: false },
          ],
          explanation: 'The circulation integral of a conservative vector field along any closed loop evaluates identically to zero.',
          marks: 4,
          negativeMarks: 1,
        }
      ],
    });

    setNewExamTitle('');
    setIsCreateExamOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Faculty Workspace — {currentUser.name}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>HighStudy Academic Division</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{batches.length} Assigned Batches</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{students.length} Enrolled Students</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Material / VOD</span>
          </button>

          <button
            onClick={() => setIsAddAsnOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-blue-500" />
            <span>Post Assignment</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Overview) */}
      {(activeTab === 'overview' || !activeTab) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Assigned Batches</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {batches.length} Cohorts
            </div>
            <div className="text-[11px] text-slate-500">
              {students.length} active students
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Study Materials &amp; VODs</span>
              <BookOpen className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {materials.length} Resources
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
              Available across all student devices
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Submissions for Review</span>
              <FileCheck2 className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {submissions.filter((s) => s.status === 'PENDING').length} Pending
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400">
              {submissions.filter((s) => s.status === 'EVALUATED').length} Evaluated
            </div>
          </div>
        </div>
      )}

      {/* TAB: BATCHES */}
      {activeTab === 'batches' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">My Academic Cohorts &amp; Student Roster</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Classroom timings, student enrollments, and syllabus progress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batches.map((batch) => {
              const enrolled = students.filter((s) => s.batchId === batch.id);
              return (
                <div
                  key={batch.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{batch.name}</div>
                      <div className="text-slate-500 text-[11px]">{batch.courseName}</div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {batch.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                    <div>
                      <div className="text-slate-400">Room</div>
                      <div className="font-semibold text-slate-900 dark:text-white">{batch.roomNumber}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Schedule</div>
                      <div className="font-semibold text-slate-900 dark:text-white">{batch.timing}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Enrolled</div>
                      <div className="font-semibold text-blue-600 font-mono">{enrolled.length} Students</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Physical Campus: Main Center</span>
                    <button
                      onClick={() => {
                        setSelectedBatchId(batch.id);
                        handleToggleAttendance(batch.id, 'PRESENT');
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Student Roster →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Attendance Marking Module */}
      {(activeTab === 'overview' || activeTab === 'attendance') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-blue-600" />
                <span>Mark Lecture Attendance</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select batch and toggle individual student attendance status
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {batches.length === 0 ? (
                  <option value="">No batch created</option>
                ) : (
                  batches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.roomNumber})</option>
                  ))
                )}
              </select>

              <button
                onClick={handleSaveAttendance}
                disabled={displayStudents.length === 0}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1.5"
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

          {displayStudents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              No students enrolled in this batch yet. Use the Super Admin portal to admit students.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              {displayStudents.map((student) => {
                const currentStatus = getStudentStatus(student.id);
                return (
                  <div
                    key={student.id}
                    className="px-4 py-3 flex items-center justify-between text-xs bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs">
                        {student.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{student.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {student.rollNumber} · Current Rate: {student.attendanceRate}%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {(['PRESENT', 'ABSENT', 'LATE'] as const).map((status) => {
                        const isActive = currentStatus === status;
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
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {status}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Materials List Section (if activeTab is 'materials' or 'overview') */}
      {(activeTab === 'materials' || activeTab === 'overview') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Uploaded Study Materials &amp; VODs</h2>
              <p className="text-xs text-slate-500">Resources published by faculty</p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              + Upload New Resource
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {materials.map((mat) => (
              <div key={mat.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-blue-600">{mat.subjectName}</span>
                    <span className="font-mono text-[10px] text-slate-400">{mat.type.replace('_', ' ')}</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">{mat.title}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{mat.description}</div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {mat.fileSizeBytes ? `${(mat.fileSizeBytes / 1000000).toFixed(1)} MB` : `${mat.durationMinutes} mins`}
                  </span>
                  <button
                    onClick={() => deleteStudyMaterial(mat.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove resource"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignment Evaluation Section */}
      {(activeTab === 'overview' || activeTab === 'assignments') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Student Homework Submissions</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Grade student solution files and return personalized comments
              </p>
            </div>
            <button
              onClick={() => setIsAddAsnOpen(true)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Create Assignment
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              No homework submissions turned in yet.
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
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
                        Submitted: {new Date(sub.submittedAt).toLocaleDateString()} {sub.remarks && `· "${sub.remarks}"`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-600 font-bold tabular-nums">
                        {sub.obtainedMarks !== undefined ? `${sub.obtainedMarks} Marks Awarded` : 'Pending Review'}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setEvalMarks(sub.obtainedMarks || 45);
                          setEvalFeedback(sub.teacherFeedback || 'Well structured calculations.');
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
          )}
        </div>
      )}

      {/* TAB: EXAMS / TEST CREATION DESK */}
      {activeTab === 'exams' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-purple-600" />
                <span>Test Creation &amp; Examination Desk</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Design mock exams, schedule diagnostic assessments, and analyze cohort attempts
              </p>
            </div>

            <button
              onClick={() => setIsCreateExamOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Mock Assessment</span>
            </button>
          </div>

          <div className="space-y-3">
            {exams.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{ex.title}</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                    {ex.status}
                  </span>
                </div>

                <div className="text-slate-500 text-[11px]">
                  Course: {ex.courseName} · Batches: {ex.batchNames.join(', ')}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-400">
                  <span className="font-mono tabular-nums">{ex.durationMinutes} Minutes</span>
                  <span className="font-mono tabular-nums">{ex.totalQuestions} Questions · {ex.totalMarks} Marks</span>
                  <span className="font-mono tabular-nums text-blue-600 font-semibold">
                    {examAttempts.filter((a) => a.examId === ex.id).length} Attempts Recorded
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {isCreateExamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Design Online Mock Assessment</h3>
            <form onSubmit={handleCreateExamSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Exam Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NEET Grand Physics Mock — Rotational Dynamics & Gravitation"
                  value={newExamTitle}
                  onChange={(e) => setNewExamTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Duration (Mins)</label>
                  <input
                    type="number"
                    value={newExamDuration}
                    onChange={(e) => setNewExamDuration(parseInt(e.target.value) || 45)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Total Marks</label>
                  <input
                    type="number"
                    value={newExamMarks}
                    onChange={(e) => setNewExamMarks(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateExamOpen(false)}
                  className="px-3 py-1.5 text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Publish Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Assignment Modal */}
      {isAddAsnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Post New Assignment Task</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thermodynamics Carnot Cycle Practice Set 04"
                  value={newAsnTitle}
                  onChange={(e) => setNewAsnTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Max Marks</label>
                <input
                  type="number"
                  value={newAsnMaxMarks}
                  onChange={(e) => setNewAsnMaxMarks(parseInt(e.target.value) || 50)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono tabular-nums"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddAsnOpen(false)}
                  className="px-3 py-1.5 text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evaluate Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Evaluate Homework — {selectedSubmission.studentName}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Award Marks</label>
                <input
                  type="number"
                  value={evalMarks}
                  onChange={(e) => setEvalMarks(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Pedagogical Review &amp; Remarks</label>
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
                Save Marks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Study Material Modal */}
      <UploadMaterialModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        teacherName={currentUser.name}
      />
    </div>
  );
};
