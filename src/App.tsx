/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, User, ExamAttempt } from '@highstudy/shared-types';
import { 
  INITIAL_USERS, 
  INITIAL_BRANCHES, 
  INITIAL_BATCHES, 
  INITIAL_COURSES, 
  INITIAL_TIMETABLE, 
  INITIAL_STUDY_MATERIALS, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_EXAMINATION, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_ACTIVITY_LOGS,
  INITIAL_ATTENDANCE,
  INITIAL_FEE_PAYMENTS,
  CURRENT_STUDENT,
  CURRENT_TEACHER,
  CURRENT_PARENT
} from './data/mockDatabase';
import { TopHeader } from '../apps/web/src/components/layout/TopHeader';
import { RoleSidebar } from '../apps/web/src/components/layout/RoleSidebar';
import { SuperAdminDashboard } from '../apps/web/src/components/dashboards/SuperAdminDashboard';
import { BranchAdminDashboard } from '../apps/web/src/components/dashboards/BranchAdminDashboard';
import { TeacherDashboard } from '../apps/web/src/components/dashboards/TeacherDashboard';
import { StudentDashboard } from '../apps/web/src/components/dashboards/StudentDashboard';
import { ParentDashboard } from '../apps/web/src/components/dashboards/ParentDashboard';
import { LiveExamModal } from '../apps/web/src/components/exam/LiveExamModal';
import { AiTutorModal } from '../apps/web/src/components/ai/AiTutorModal';
import { Bell, X } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('SUPER_ADMIN');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isExamModalOpen, setIsExamModalOpen] = useState<boolean>(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState<boolean>(false);
  const [completedAttempt, setCompletedAttempt] = useState<ExamAttempt | null>(null);

  // Sync dark mode class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const currentUser: User = INITIAL_USERS.find((u) => u.role === currentRole) || INITIAL_USERS[0];

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Header */}
      <TopHeader
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        unreadAnnouncementsCount={INITIAL_ANNOUNCEMENTS.length}
        onOpenAnnouncements={() => setIsAnnouncementsOpen(true)}
        onOpenAiTutor={() => setIsAiTutorOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Role-Specific Navigation Sidebar */}
        <RoleSidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'ai') {
              setIsAiTutorOpen(true);
            } else if (tab === 'exams' && currentRole === 'STUDENT') {
              setIsExamModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentRole === 'SUPER_ADMIN' || currentRole === 'INSTITUTE_ADMIN' ? (
            <SuperAdminDashboard
              branches={INITIAL_BRANCHES}
              batches={INITIAL_BATCHES}
              courses={INITIAL_COURSES}
              activityLogs={INITIAL_ACTIVITY_LOGS}
              announcements={INITIAL_ANNOUNCEMENTS}
            />
          ) : currentRole === 'BRANCH_ADMIN' ? (
            <BranchAdminDashboard
              branch={INITIAL_BRANCHES[1]} // North Metro Campus
              batches={INITIAL_BATCHES}
            />
          ) : currentRole === 'TEACHER' ? (
            <TeacherDashboard
              teacher={CURRENT_TEACHER}
              batches={INITIAL_BATCHES}
              materials={INITIAL_STUDY_MATERIALS}
              assignments={INITIAL_ASSIGNMENTS}
              submissions={INITIAL_SUBMISSIONS}
              attendanceRecords={INITIAL_ATTENDANCE}
            />
          ) : currentRole === 'STUDENT' ? (
            <StudentDashboard
              student={CURRENT_STUDENT}
              timetable={INITIAL_TIMETABLE}
              materials={INITIAL_STUDY_MATERIALS}
              assignments={INITIAL_ASSIGNMENTS}
              exam={INITIAL_EXAMINATION}
              onLaunchExam={() => setIsExamModalOpen(true)}
              onOpenAiTutor={() => setIsAiTutorOpen(true)}
              completedAttempt={completedAttempt}
            />
          ) : (
            <ParentDashboard
              parent={CURRENT_PARENT}
              student={CURRENT_STUDENT}
              attendanceRecords={INITIAL_ATTENDANCE}
              feePayments={INITIAL_FEE_PAYMENTS}
              latestAttempt={completedAttempt}
            />
          )}
        </main>
      </div>

      {/* Live Online Examination Modal */}
      {isExamModalOpen && (
        <LiveExamModal
          exam={INITIAL_EXAMINATION}
          onClose={() => setIsExamModalOpen(false)}
          onComplete={(attempt) => {
            setCompletedAttempt(attempt);
          }}
        />
      )}

      {/* Gemini AI Learning Assistant Modal */}
      <AiTutorModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        studentName={CURRENT_STUDENT.fullName}
      />

      {/* Announcements Modal */}
      {isAnnouncementsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <span>Institutional Announcements</span>
              </h3>
              <button
                onClick={() => setIsAnnouncementsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {INITIAL_ANNOUNCEMENTS.map((a) => (
                <div key={a.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{a.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(a.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    {a.content}
                  </p>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>From: {a.senderName} ({a.senderRole})</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{a.priority} Priority</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
