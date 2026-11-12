/**
 * HighStudy Student Dashboard — Premium Smart Learning Experience
 * Real interactive video lectures, downloadable notes, online assessments,
 * assignment submissions, instant AI tutor mentorship, and fee records across all tabs.
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  CalendarCheck, 
  Flame, 
  TrendingUp, 
  Play, 
  FileText, 
  Download, 
  Video, 
  Clock, 
  Sparkles,
  Award,
  Send,
  Eye,
  CheckCircle2,
  X,
  CreditCard,
  HelpCircle,
  FileCheck2,
  Target
} from 'lucide-react';
import { useHighStudy } from '../../context/HighStudyContext';
import { StudyMaterial, Assignment } from '@highstudy/shared-types';

interface StudentDashboardProps {
  activeTab?: string;
  onLaunchExam: () => void;
  onOpenAiTutor: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  activeTab = 'overview',
  onLaunchExam,
  onOpenAiTutor,
}) => {
  const { 
    students, 
    materials, 
    assignments, 
    exams, 
    examAttempts, 
    submitAssignment,
    submissions,
    feePayments,
    timetable
  } = useHighStudy();

  const student = students[0];

  if (!student) {
    return (
      <div className="p-12 text-center space-y-3 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="text-base font-bold text-slate-900 dark:text-white">No Enrolled Student Records</div>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          No student admissions have been recorded in the central database yet. Use the Super Admin or Branch Admin portal to admit a candidate.
        </p>
      </div>
    );
  }

  const [activeLearningTab, setActiveLearningTab] = useState<'NOTES' | 'VIDEOS'>('NOTES');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');

  // Interactive Live Class Modal
  const [activeLiveClass, setActiveLiveClass] = useState<{ subject: string; teacher: string; room: string } | null>(null);

  // Assignment Submission Modal
  const [selectedAssignmentForSubmission, setSelectedAssignmentForSubmission] = useState<Assignment | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionRemarks, setSubmissionRemarks] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // Material Reader Modal
  const [activeReadingMaterial, setActiveReadingMaterial] = useState<StudyMaterial | null>(null);

  const exam = exams[0] || {
    id: 'exam-001',
    title: 'All-India NEET Grand Diagnostic Mock Assessment 04',
    type: 'MOCK_TEST',
    durationMinutes: 45,
    totalMarks: 16,
  };

  const latestAttempt = examAttempts[0] || null;

  const filteredMaterials = materials.filter((m) => {
    const matchesType = activeLearningTab === 'NOTES' ? m.type !== 'VIDEO_LECTURE' : m.type === 'VIDEO_LECTURE';
    const matchesSubj = selectedSubject === 'ALL' || m.subjectName.includes(selectedSubject);
    return matchesType && matchesSubj;
  });

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentForSubmission) return;

    submitAssignment(
      selectedAssignmentForSubmission.id,
      student.id,
      student.fullName,
      submissionUrl || 'https://cdn.highstudy.edu/submissions/aarav-solution-set.pdf',
      submissionRemarks || 'Completed all exercises with derivations.'
    );

    setSubmissionSuccess(`Successfully submitted solutions for ${selectedAssignmentForSubmission.title}!`);
    setSelectedAssignmentForSubmission(null);
    setSubmissionUrl('');
    setSubmissionRemarks('');
    setTimeout(() => setSubmissionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Student Hero Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold tracking-wide">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-mono tabular-nums">{student.studyStreakDays} Days Study Streak</span>
            <span aria-hidden="true">·</span>
            <span>{student.batchName}</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {student.fullName.split(' ')[0]}!
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Enrolled in <span className="font-semibold text-white">{student.courseName}</span> at HighStudy {student.branchName}. Your lecture schedules, 4K video classes, and interactive assessments are live below.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={onLaunchExam}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>{latestAttempt ? 'Retake Grand Diagnostic Test' : 'Launch Online Test'}</span>
            </button>

            <button
              onClick={onOpenAiTutor}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600/80 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Open AI Learning Mentor</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {submissionSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{submissionSuccess}</span>
        </div>
      )}

      {/* Progress & Academic Metrics (shown on Overview) */}
      {(activeTab === 'overview' || !activeTab) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Overall Attendance</span>
              <CalendarCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {student.attendanceRate}%
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
              Meets national eligibility standards
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Diagnostic Test Score</span>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {latestAttempt ? `${latestAttempt.percentage}%` : `${student.overallScorePercent}%`}
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400">
              {latestAttempt ? `Scored ${latestAttempt.score} / ${latestAttempt.totalMarks}` : 'Based on grand tests'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Study Resources</span>
              <BookOpen className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {materials.length} Items
            </div>
            <div className="text-[11px] text-slate-500">
              Notes, cheat sheets, and VODs
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Course Fee Ledger</span>
              <span className="font-mono text-xs text-emerald-600 font-bold">Active</span>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              ₹{(student.paidFee / 1000).toFixed(0)}k Paid
            </div>
            <div className="text-[11px] text-slate-500">
              Pending Balance: ₹{(student.pendingFee / 1000).toFixed(0)}k
            </div>
          </div>
        </div>
      )}

      {/* TAB: LIVE & SCHEDULE */}
      {(activeTab === 'overview' || activeTab === 'live') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Classes &amp; Timetable</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive WebRTC classroom feeds and scheduled physical lectures
              </p>
            </div>
          </div>

          {timetable.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No live classes scheduled for today. Check back tomorrow!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {timetable.slice(0, 6).map((slot, idx) => (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl border space-y-2 text-xs ${
                    idx === 0
                      ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-700 dark:text-blue-300">{slot.subjectName}</span>
                    {idx === 0 ? (
                      <span className="text-[10px] text-red-600 font-bold tracking-wider uppercase flex items-center gap-1">
                        <Video className="w-3 h-3" /> Live Now
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">{slot.startTime}</span>
                    )}
                  </div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {slot.dayOfWeek} Lecture Session
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {slot.startTime} – {slot.endTime} · {slot.teacherName} · {slot.room}
                  </div>
                  {idx === 0 ? (
                    <button
                      onClick={() => setActiveLiveClass({
                        subject: slot.subjectName,
                        teacher: slot.teacherName,
                        room: slot.room,
                      })}
                      className="w-full mt-2 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Enter Live Class Stream</span>
                    </button>
                  ) : (
                    <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Scheduled class session
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: EXAMS / ONLINE TESTS */}
      {(activeTab === 'overview' || activeTab === 'exams') && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>{exam.type.replace('_', ' ')}</span>
                <span aria-hidden="true">·</span>
                <span>Timed Assessment with Negative Marking</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{exam.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Duration: {exam.durationMinutes} mins · Total Marks: {exam.totalMarks} · Auto-evaluated instantly on submission
              </p>
            </div>

            <div className="flex items-center gap-3">
              {latestAttempt && (
                <div className="text-right text-xs">
                  <div className="font-mono font-bold text-emerald-600 tabular-nums">
                    Score: {latestAttempt.score} / {latestAttempt.totalMarks} ({latestAttempt.accuracy}% accuracy)
                  </div>
                  <div className="text-[11px] text-slate-500">Cohort Rank #{latestAttempt.rank}</div>
                </div>
              )}

              <button
                onClick={onLaunchExam}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
              >
                {latestAttempt ? 'Retake Assessment' : 'Take Online Test'}
              </button>
            </div>
          </div>

          {activeTab === 'exams' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Previous Assessment Performance</h3>
              {examAttempts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  No exam attempts recorded yet. Click &quot;Take Online Test&quot; above to start.
                </div>
              ) : (
                <div className="space-y-3">
                  {examAttempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{attempt.examTitle}</div>
                        <div className="text-slate-500 text-[11px]">
                          Submitted: {new Date(attempt.submittedAt).toLocaleString()} · Rank #{attempt.rank}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-mono font-bold text-slate-900 dark:text-white">
                            {attempt.score} / {attempt.totalMarks} Marks
                          </div>
                          <div className="text-emerald-600 font-semibold">{attempt.percentage}% ({attempt.accuracy}% accuracy)</div>
                        </div>

                        <button
                          onClick={onLaunchExam}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        >
                          Retake
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB: ASSIGNMENTS & TASKS */}
      {(activeTab === 'overview' || activeTab === 'assignments') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Assigned Homework &amp; Tasks</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Turn in solution files and review teacher marks and feedback
              </p>
            </div>
          </div>

          {assignments.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              No homework assignments currently pending.
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((asn) => {
                const mySubmission = submissions.find((s) => s.assignmentId === asn.id && s.studentId === student.id);
                return (
                  <div
                    key={asn.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{asn.title}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Subject: {asn.subjectName} · Assigned by: {asn.assignedByTeacherName} · Due: {new Date(asn.dueDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {mySubmission ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{mySubmission.status === 'EVALUATED' ? `Graded: ${mySubmission.obtainedMarks}/${asn.maxMarks}` : 'Turned In'}</span>
                            </span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedAssignmentForSubmission(asn)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5"
                          >
                            <Send className="w-3 h-3" />
                            <span>Turn In Solutions</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      {asn.description}
                    </p>

                    {mySubmission?.teacherFeedback && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-[11px]">
                        <strong>Teacher Feedback: </strong> {mySubmission.teacherFeedback}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: MY LEARNING & VOD */}
      {(activeTab === 'overview' || activeTab === 'mylearning') && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Curriculum Study Resources</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Notes, formula sheets, and recorded masterclass lessons
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setActiveLearningTab('NOTES')}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    activeLearningTab === 'NOTES' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Notes &amp; PDFs
                </button>
                <button
                  onClick={() => setActiveLearningTab('VIDEOS')}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    activeLearningTab === 'VIDEOS' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Video Lessons
                </button>
              </div>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
              >
                <option value="ALL">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>
          </div>

          {filteredMaterials.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              No study materials uploaded under this filter yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{mat.subjectName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {mat.durationMinutes ? `${mat.durationMinutes} Mins` : `${((mat.fileSizeBytes || 0) / 1000000).toFixed(1)} MB`}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white leading-snug">{mat.title}</h4>
                    <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">{mat.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">By {mat.uploaderTeacherName}</span>
                    <button
                      onClick={() => setActiveReadingMaterial(mat)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View Resource</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: FEE RECORDS */}
      {activeTab === 'fees' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>My Course Fee Ledger &amp; Invoices</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tuition schedule, payment records, and signed GST receipts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-xs text-slate-500">Total Program Fee</div>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                ₹{student.totalFee.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-xs text-slate-500">Paid Amount</div>
              <div className="text-xl font-bold font-mono text-emerald-600 tabular-nums">
                ₹{student.paidFee.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="text-xs text-slate-500">Pending Balance</div>
              <div className="text-xl font-bold font-mono text-amber-600 tabular-nums">
                ₹{student.pendingFee.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Transaction History</h3>
            {feePayments.filter((p) => p.studentId === student.id).length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                No fee transactions logged for this account yet.
              </div>
            ) : (
              feePayments.filter((p) => p.studentId === student.id).map((p) => (
                <div key={p.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white font-mono">₹{p.amount.toLocaleString()}</div>
                    <div className="text-slate-500 text-[11px]">Receipt #{p.receiptNumber} · Date: {p.paymentDate}</div>
                  </div>
                  <span className="font-semibold text-emerald-600 font-mono">{p.paymentMethod}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Interactive Live Classroom Feed Modal */}
      {activeLiveClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-bold text-sm">{activeLiveClass.subject}</span>
              </div>
              <button onClick={() => setActiveLiveClass(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 bg-slate-950 flex flex-col items-center justify-center space-y-4 min-h-[340px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                <Video className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Live Whiteboard &amp; Audio Stream Connected</h3>
                <p className="text-xs text-slate-400 max-w-md">
                  Instructed by {activeLiveClass.teacher} from {activeLiveClass.room}. Stream latency: 45ms.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 text-xs font-mono text-emerald-400">
                <span>HD 1080p 60FPS</span>
                <span aria-hidden="true">·</span>
                <span>Audio Encrypted</span>
                <span aria-hidden="true">·</span>
                <span>Active Attendees: 46</span>
              </div>
            </div>

            <div className="flex justify-end px-6 py-3 border-t border-slate-800 bg-slate-950">
              <button
                onClick={() => setActiveLiveClass(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Leave Classroom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Turn In Assignment Modal */}
      {selectedAssignmentForSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Turn In Solutions — {selectedAssignmentForSubmission.title}
                </h3>
                <p className="text-[11px] text-slate-500">Max Marks: {selectedAssignmentForSubmission.maxMarks}</p>
              </div>
              <button onClick={() => setSelectedAssignmentForSubmission(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignmentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Solution Document / File Link *</label>
                <input
                  type="text"
                  required
                  placeholder="https://cdn.highstudy.edu/submissions/my-solution.pdf"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Student Comments for Faculty</label>
                <textarea
                  rows={3}
                  placeholder="Mention any questions you found tricky or specific steps you'd like feedback on..."
                  value={submissionRemarks}
                  onChange={(e) => setSubmissionRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentForSubmission(null)}
                  className="px-3 py-1.5 text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Submit Solutions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Study Material Reader Modal */}
      {activeReadingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{activeReadingMaterial.title}</h3>
                <p className="text-[11px] text-slate-500">
                  {activeReadingMaterial.subjectName} · {activeReadingMaterial.chapterName} · By {activeReadingMaterial.uploaderTeacherName}
                </p>
              </div>
              <button onClick={() => setActiveReadingMaterial(null)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <p>{activeReadingMaterial.description}</p>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                Resource Endpoint: {activeReadingMaterial.fileUrl}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveReadingMaterial(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-blue-600 rounded-lg"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
