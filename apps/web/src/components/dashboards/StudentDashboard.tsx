/**
 * HighStudy Student Dashboard — Premium Smart Learning Experience
 * Personalized learning journey with video classes, chapter notes, online assessments,
 * assignments, and instant AI tutor mentorship.
 */

import React, { useState } from 'react';
import { 
  StudentProfile, 
  TimetableSlot, 
  StudyMaterial, 
  Assignment, 
  Examination,
  ExamAttempt
} from '@highstudy/shared-types';
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
  CheckCircle2, 
  Sparkles,
  Award
} from 'lucide-react';

interface StudentDashboardProps {
  student: StudentProfile;
  timetable: TimetableSlot[];
  materials: StudyMaterial[];
  assignments: Assignment[];
  exam: Examination;
  onLaunchExam: () => void;
  onOpenAiTutor: () => void;
  completedAttempt: ExamAttempt | null;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  timetable,
  materials,
  assignments,
  exam,
  onLaunchExam,
  onOpenAiTutor,
  completedAttempt,
}) => {
  const [activeLearningTab, setActiveLearningTab] = useState<'NOTES' | 'VIDEOS'>('NOTES');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');

  const filteredMaterials = materials.filter((m) => {
    const matchesType = activeLearningTab === 'NOTES' ? m.type !== 'VIDEO_LECTURE' : m.type === 'VIDEO_LECTURE';
    const matchesSubj = selectedSubject === 'ALL' || m.subjectName.includes(selectedSubject);
    return matchesType && matchesSubj;
  });

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
            Keep up the momentum, {student.fullName.split(' ')[0]}!
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            You are enrolled in <span className="font-semibold text-white">{student.courseName}</span> at HighStudy Main Campus. Your next live physics session starts at 08:30 AM in Hall 302.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={onLaunchExam}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>{completedAttempt ? 'Retake Grand Diagnostic Test' : 'Start Live Diagnostic Test'}</span>
            </button>

            <button
              onClick={onOpenAiTutor}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600/80 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI Learning Assistant</span>
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Progress & Academic Metrics */}
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
            Meets 90% exam eligibility criteria
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Cumulative Test Accuracy</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {student.overallScorePercent}%
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400">
            Top 5% in NEET Achievers cohort
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Study Materials Accessed</span>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            18 Chapters
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Physics, Chemistry &amp; Biology
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Fee Installment Status</span>
            <span className="font-mono text-xs text-emerald-600 font-bold">Cleared</span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            ₹{(student.paidFee / 1000).toFixed(0)}k Paid
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Pending Balance: ₹{(student.pendingFee / 1000).toFixed(0)}k
          </div>
        </div>
      </div>

      {/* Today's Classes & Timetable */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Today&apos;s Lecture Schedule</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monday Class Routine · Classroom &amp; Interactive VOD links
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {timetable.map((slot) => (
            <div
              key={slot.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-white">{slot.subjectName}</span>
                {slot.isLiveClass && (
                  <span className="text-[10px] text-red-600 font-bold tracking-wider uppercase flex items-center gap-1">
                    <Video className="w-3 h-3" /> Live
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono tabular-nums">{slot.startTime} – {slot.endTime}</span>
              </div>

              <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span>{slot.teacherName}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{slot.room}</span>
              </div>

              {slot.isLiveClass && (
                <button
                  onClick={() => alert(`Launching HighStudy WebRTC Live Classroom for ${slot.subjectName} with ${slot.teacherName}`)}
                  className="w-full mt-1 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Join Live Lecture</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Online Assessment Banner (Test Engine) */}
      <div className="p-5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
            <span>{exam.type.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>NEET 2026 Diagnostic Test</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{exam.title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Duration: {exam.durationMinutes} mins · Total Marks: {exam.totalMarks} · Negative Marking: -1 per error
          </p>
        </div>

        <div className="flex items-center gap-3">
          {completedAttempt && (
            <div className="text-right text-xs">
              <div className="font-mono font-bold text-emerald-600 tabular-nums">
                Latest Score: {completedAttempt.score} / {completedAttempt.totalMarks} ({completedAttempt.accuracy}%)
              </div>
              <div className="text-[11px] text-slate-500">Cohort Rank #{completedAttempt.rank}</div>
            </div>
          )}

          <button
            onClick={onLaunchExam}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            {completedAttempt ? 'Retake Assessment' : 'Take Online Test'}
          </button>
        </div>
      </div>

      {/* Study Materials & Lecture Library */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Curriculum Study Resources</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hand-annotated masterclass notes, cheat sheets, and high-definition recorded lessons
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
                  onClick={() => alert(`Accessing HighStudy Cloud CDN: ${mat.title}`)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3 h-3" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
