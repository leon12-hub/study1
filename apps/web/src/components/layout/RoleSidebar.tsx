/**
 * HighStudy RoleSidebar Component
 * Provides clean, role-tailored navigation tabs with zero pills and clear visual hierarchy
 */

import React from 'react';
import { UserRole } from '@highstudy/shared-types';
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  BookOpen,
  FileCheck2,
  HelpCircle,
  FolderKanban,
  ClipboardList,
  Sparkles,
} from 'lucide-react';

interface RoleSidebarProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const RoleSidebar: React.FC<RoleSidebarProps> = ({
  currentRole,
  activeTab,
  onTabChange,
}) => {
  const getNavItems = () => {
    switch (currentRole) {
      case 'SUPER_ADMIN':
      case 'INSTITUTE_ADMIN':
        return [
          { id: 'overview', label: 'Executive Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'branches', label: 'Branch Operations', icon: <Building2 className="w-4 h-4" /> },
          { id: 'courses', label: 'Courses & Curriculum', icon: <FolderKanban className="w-4 h-4" /> },
          { id: 'batches', label: 'Batch Schedules', icon: <CalendarCheck className="w-4 h-4" /> },
          { id: 'students', label: 'Admissions & Students', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'teachers', label: 'Faculty Directory', icon: <Users className="w-4 h-4" /> },
          { id: 'finance', label: 'Fees & Collections', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'audit', label: 'Security & Logs', icon: <ClipboardList className="w-4 h-4" /> },
        ];
      case 'BRANCH_ADMIN':
        return [
          { id: 'overview', label: 'Branch Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'batches', label: 'Branch Batches', icon: <CalendarCheck className="w-4 h-4" /> },
          { id: 'students', label: 'Enrolled Students', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'attendance', label: 'Attendance Desk', icon: <CalendarCheck className="w-4 h-4" /> },
          { id: 'fees', label: 'Branch Fee Counter', icon: <CreditCard className="w-4 h-4" /> },
        ];
      case 'TEACHER':
        return [
          { id: 'overview', label: 'Teacher Workspace', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'batches', label: 'My Batches & Students', icon: <Users className="w-4 h-4" /> },
          { id: 'attendance', label: 'Mark Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
          { id: 'materials', label: 'Study Materials & VOD', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'assignments', label: 'Assignment Grading', icon: <FileCheck2 className="w-4 h-4" /> },
          { id: 'exams', label: 'Test Creation Desk', icon: <ClipboardList className="w-4 h-4" /> },
        ];
      case 'STUDENT':
        return [
          { id: 'overview', label: 'Smart Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'mylearning', label: 'My Learning & VOD', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'live', label: 'Live & Schedule', icon: <CalendarCheck className="w-4 h-4" /> },
          { id: 'exams', label: 'Online Tests & Mocks', icon: <ClipboardList className="w-4 h-4" /> },
          { id: 'assignments', label: 'Assignments & Tasks', icon: <FileCheck2 className="w-4 h-4" /> },
          { id: 'ai', label: 'AI Tutor Mentorship', icon: <Sparkles className="w-4 h-4 text-blue-500" /> },
          { id: 'fees', label: 'Fee Records', icon: <CreditCard className="w-4 h-4" /> },
        ];
      case 'PARENT':
        return [
          { id: 'overview', label: 'Child Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'attendance', label: 'Attendance Records', icon: <CalendarCheck className="w-4 h-4" /> },
          { id: 'performance', label: 'Exam Results & Marks', icon: <ClipboardList className="w-4 h-4" /> },
          { id: 'fees', label: 'Fee Invoices & Pay', icon: <CreditCard className="w-4 h-4" /> },
        ];
      default:
        return [{ id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> }];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Horizontal Navigation Tabs */}
      <div className="md:hidden flex overflow-x-auto py-2.5 px-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 gap-1.5 shrink-0 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical Sidebar */}
      <aside className="w-64 shrink-0 hidden md:flex flex-col bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 transition-colors">
        <div className="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-3 mb-2">
          Navigation
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`group relative w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-xl text-left transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 shadow-xs font-semibold ring-1 ring-slate-200/90 dark:ring-slate-700/70'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-900/90'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-blue-600 dark:bg-blue-400" />
                )}
                <span className={`shrink-0 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Institute Info Tagline footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="font-semibold text-slate-700 dark:text-slate-300">HighStudy v1.0</div>
          <div>New Delhi &amp; Gurugram</div>
        </div>
      </aside>
    </>
  );
};
