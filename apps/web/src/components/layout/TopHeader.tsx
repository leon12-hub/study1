/**
 * HighStudy TopHeader Component
 * Conforms to Top Bar Contract: Brand zone, Navigation/Role Switcher, Action/Profile zone
 */

import React from 'react';
import { User, UserRole } from '@highstudy/shared-types';
import { 
  Building2, 
  Sun, 
  Moon, 
  Bell, 
  ShieldCheck, 
  GraduationCap, 
  UserCheck, 
  BookOpen, 
  Users, 
  ChevronDown 
} from 'lucide-react';

interface TopHeaderProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  unreadAnnouncementsCount: number;
  onOpenAnnouncements: () => void;
  onOpenAiTutor: () => void;
}

const ROLES_LIST: Array<{ role: UserRole; label: string; icon: React.ReactNode }> = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', icon: <ShieldCheck className="w-4 h-4 text-amber-500" /> },
  { role: 'INSTITUTE_ADMIN', label: 'Institute Admin', icon: <Building2 className="w-4 h-4 text-blue-500" /> },
  { role: 'BRANCH_ADMIN', label: 'Branch Admin', icon: <Building2 className="w-4 h-4 text-emerald-500" /> },
  { role: 'TEACHER', label: 'Teacher Portal', icon: <UserCheck className="w-4 h-4 text-indigo-500" /> },
  { role: 'STUDENT', label: 'Student Portal', icon: <GraduationCap className="w-4 h-4 text-sky-500" /> },
  { role: 'PARENT', label: 'Parent Portal', icon: <Users className="w-4 h-4 text-purple-500" /> },
];

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  onRoleChange,
  isDark,
  onToggleTheme,
  unreadAnnouncementsCount,
  onOpenAnnouncements,
  onOpenAiTutor,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Brand Wordmark & Institute Indicator */}
      <div className="flex items-center gap-4">
        <a href="#home" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-sm">
            H
          </div>
          <span>HighStudy</span>
        </a>
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Apex Academy</span>
          <span aria-hidden="true">·</span>
          <span>Single-Institute EMS + LMS</span>
        </div>
      </div>

      {/* Zone 2: Role Switcher & Context Bar */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
            title="Switch User Role to test specific dashboard workflows"
          >
            <span className="text-slate-500 dark:text-slate-400">Active View:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{currentUser.role.replace('_', ' ')}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Select Workspace Role
              </div>
              {ROLES_LIST.map((item) => (
                <button
                  key={item.role}
                  onClick={() => {
                    onRoleChange(item.role);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                    currentUser.role === item.role
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {currentUser.role === 'STUDENT' && (
          <button
            onClick={onOpenAiTutor}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>AI Study Tutor</span>
          </button>
        )}
      </div>

      {/* Zone 3: Actions & Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenAnnouncements}
          className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Announcements & Broadcasts"
        >
          <Bell className="w-4 h-4" />
          {unreadAnnouncementsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          )}
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
              {currentUser.branchName || 'HighStudy Central HQ'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
