import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  CheckSquare,
  Clock,
  CalendarDays,
  AlertTriangle,
  Award,
  BarChart3,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type NavTab =
  | 'dashboard'
  | 'candidates'
  | 'onboarding'
  | 'internships'
  | 'tasks'
  | 'attendance'
  | 'leaves'
  | 'performance'
  | 'completion'
  | 'reports'
  | 'audit'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser, candidates, tasks, leaves, warnings, attendance } = useApp();

  // Calculate quick badges
  const pendingVerificationCount = candidates.filter((c) => c.status === 'under_hr_verification').length;
  const pendingReviewTasks = tasks.filter((t) => t.status === 'submitted').length;
  const pendingLeavesCount = leaves.filter((l) => l.status === 'pending').length;
  const activeWarningsCount = warnings.length;

  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
    roles?: string[];
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'candidates',
      label: 'Hiring & Candidates',
      icon: Users,
      badge: pendingVerificationCount > 0 ? pendingVerificationCount : undefined,
      badgeColor: 'bg-purple-500/20 text-purple-400',
    },
    {
      id: 'onboarding',
      label: 'Onboarding & Training',
      icon: GraduationCap,
    },
    {
      id: 'internships',
      label: 'Internship Directory',
      icon: Briefcase,
    },
    {
      id: 'tasks',
      label: 'Task Management',
      icon: CheckSquare,
      badge: pendingReviewTasks > 0 ? pendingReviewTasks : undefined,
      badgeColor: 'bg-black text-white',
    },
    {
      id: 'attendance',
      label: 'Attendance & Reports',
      icon: Clock,
    },
    {
      id: 'leaves',
      label: 'Leave & Extensions',
      icon: CalendarDays,
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-400',
    },
    {
      id: 'performance',
      label: 'Performance & Warnings',
      icon: AlertTriangle,
      badge: activeWarningsCount > 0 ? activeWarningsCount : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-400',
    },
    {
      id: 'completion',
      label: 'Evaluation & Certificates',
      icon: Award,
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      roles: ['super_admin', 'hr_admin', 'dept_admin'],
    },
    {
      id: 'audit',
      label: 'Audit Trail (BR-015)',
      icon: ShieldCheck,
      roles: ['super_admin', 'hr_admin'],
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: Settings,
      roles: ['super_admin', 'hr_admin'],
    },
  ];

  // Filter based on role if specified
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(currentUser.role);
  });

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 flex-1 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Platform Modules
        </div>

        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-black text-white shadow-xs font-semibold'
                  : 'text-slate-700 hover:text-black hover:bg-slate-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-black'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                    item.badgeColor || (isActive ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Current User Snapshot Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/60">
        <div className="text-[11px] text-slate-500">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Role Context</span>
            <span className="font-mono text-[10px] uppercase text-black font-bold">{currentUser.role.replace('_', ' ')}</span>
          </div>
          <p className="text-slate-800 font-medium truncate">{currentUser.name}</p>
          <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
        </div>
      </div>
    </aside>
  );
};
