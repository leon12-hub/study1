/**
 * HighStudy Master App Component
 * Integrates HighStudyProvider, TopHeader, RoleSidebar, and dynamic role-tailored workspaces.
 */

import React, { useState, useEffect } from 'react';
import { UserRole } from '@highstudy/shared-types';
import { HighStudyProvider, useHighStudy } from './context/HighStudyContext';
import { TopHeader } from './components/layout/TopHeader';
import { RoleSidebar } from './components/layout/RoleSidebar';
import { SuperAdminDashboard } from './components/dashboards/SuperAdminDashboard';
import { BranchAdminDashboard } from './components/dashboards/BranchAdminDashboard';
import { TeacherDashboard } from './components/dashboards/TeacherDashboard';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { ParentDashboard } from './components/dashboards/ParentDashboard';
import { LiveExamModal } from './components/exam/LiveExamModal';
import { AiTutorModal } from './components/ai/AiTutorModal';
import { ClearDataConfirmModal } from './components/modals/ClearDataConfirmModal';
import { Bell, X } from 'lucide-react';

function HighStudyWorkspace() {
  const { 
    currentUser, 
    currentRole, 
    setCurrentRole, 
    announcements, 
    exams, 
    recordExamAttempt, 
    students 
  } = useHighStudy();

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
  const [isDataControlsOpen, setIsDataControlsOpen] = useState<boolean>(false);

  // Sync dark mode class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    setActiveTab('overview');
  };

  const activeExam = exams[0] || null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Header */}
      <TopHeader
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        unreadAnnouncementsCount={announcements.length}
        onOpenAnnouncements={() => setIsAnnouncementsOpen(true)}
        onOpenAiTutor={() => setIsAiTutorOpen(true)}
        onOpenDataControls={() => setIsDataControlsOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Role-Specific Navigation Sidebar */}
        <RoleSidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'ai') {
              setIsAiTutorOpen(true);
            }
          }}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentRole === 'SUPER_ADMIN' || currentRole === 'INSTITUTE_ADMIN' ? (
            <SuperAdminDashboard activeTab={activeTab} />
          ) : currentRole === 'BRANCH_ADMIN' ? (
            <BranchAdminDashboard activeTab={activeTab} />
          ) : currentRole === 'TEACHER' ? (
            <TeacherDashboard activeTab={activeTab} />
          ) : currentRole === 'STUDENT' ? (
            <StudentDashboard
              activeTab={activeTab}
              onLaunchExam={() => setIsExamModalOpen(true)}
              onOpenAiTutor={() => setIsAiTutorOpen(true)}
            />
          ) : (
            <ParentDashboard activeTab={activeTab} />
          )}
        </main>
      </div>

      {/* Live Online Examination Modal */}
      {isExamModalOpen && activeExam && (
        <LiveExamModal
          exam={activeExam}
          onClose={() => setIsExamModalOpen(false)}
          onComplete={() => {
            setIsExamModalOpen(false);
          }}
        />
      )}

      {/* Gemini AI Learning Assistant Modal */}
      <AiTutorModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        studentName={students[0]?.fullName || 'Aarav Sharma'}
      />

      {/* Clear / Reset Data Modal */}
      <ClearDataConfirmModal
        isOpen={isDataControlsOpen}
        onClose={() => setIsDataControlsOpen(false)}
      />

      {/* Announcements Drawer Modal */}
      {isAnnouncementsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <span>Institutional Notices &amp; Circulars</span>
              </h3>
              <button
                onClick={() => setIsAnnouncementsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {announcements.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No active notices. Create one from the Super Admin dashboard!
                </div>
              ) : (
                announcements.map((a) => (
                  <div
                    key={a.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1.5 text-xs"
                  >
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
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <HighStudyProvider>
      <HighStudyWorkspace />
    </HighStudyProvider>
  );
}
