import React, { useState } from 'react';
import {
  Bell,
  Download,
  RotateCcw,
  LogOut,
  ChevronDown,
  UserCheck,
  Cloud,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { ExportZipModal } from '../common/ExportZipModal';
import { UserAvatar } from '../common/UserAvatar';

const roleBadgeMap: Record<UserRole, { label: string; color: string }> = {
  super_admin: { label: 'Super Admin', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  hr_admin: { label: 'HR Admin', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  dept_admin: { label: 'Dept Head', color: 'bg-slate-100 text-slate-900 border-slate-300' },
  mentor: { label: 'Tech Mentor', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  intern: { label: 'Intern', color: 'bg-black text-white border-black' },
};

export const Navbar: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    availableUsers,
    isRealtimeSyncing,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    resetAllData,
    logout,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isExportZipOpen, setIsExportZipOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center shadow-md shadow-black/10 text-white font-black text-lg tracking-tighter">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                  Heloix WorkHub
                </span>
                <span className="hidden sm:inline-block text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono border border-slate-200">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Heloix Startup Minds Pvt. Ltd.
              </p>
            </div>
          </div>

          {/* Center: Live Sync & Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs">
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                isRealtimeSyncing ? 'bg-black animate-ping' : 'bg-emerald-500'
              }`}
            />
            <Cloud className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600 font-medium">
              {isRealtimeSyncing ? 'Cloud Syncing...' : 'Cloud Synchronized (PostgreSQL)'}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick ZIP Export */}
            <button
              onClick={() => setIsExportZipOpen(true)}
              title="Download Complete Source Code, Schema & Data ZIP"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Download ZIP</span>
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-black animate-pulse" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-3 overflow-hidden">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-900 border border-slate-300 font-semibold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                            n.read
                              ? 'bg-slate-50/60 border-slate-200 text-slate-500'
                              : 'bg-slate-100/90 border-slate-300 text-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between font-medium mb-1">
                            <span className="text-slate-900 font-semibold">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Reset */}
            <button
              onClick={() => {
                if (confirm('Reset application state to initial demo data?')) {
                  resetAllData();
                }
              }}
              title="Reset Demo Data"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors hidden sm:flex cursor-pointer"
              aria-label="Reset all demo data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Active User Switcher / Profile */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-left cursor-pointer"
                aria-expanded={isRoleDropdownOpen}
              >
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {roleBadgeMap[currentUser.role]?.label}
                  </div>
                </div>
                <UserAvatar
                  name={currentUser.name}
                  role={currentUser.role}
                  size="sm"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                      <UserCheck className="w-3.5 h-3.5 text-black" />
                      <span>Switch Role / Persona</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Explore the system from any role perspective
                    </p>
                  </div>

                  <div className="space-y-1">
                    {availableUsers.map((user) => {
                      const isSelected = user.id === currentUser.id;
                      return (
                        <button
                          key={user.id}
                          onClick={() => {
                            setCurrentUser(user);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-black text-white font-semibold shadow-xs'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <UserAvatar
                              name={user.name}
                              role={user.role}
                              size="sm"
                            />
                            <div>
                              <div className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-slate-900'}`}>{user.name}</div>
                              <div className={`flex items-center gap-1 text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                <span>{roleBadgeMap[user.role]?.label}</span>
                                {user.departmentName && (
                                  <>
                                    <span>·</span>
                                    <span className="font-mono text-[9px]">{user.departmentName}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Export ZIP Modal */}
      <ExportZipModal
        isOpen={isExportZipOpen}
        onClose={() => setIsExportZipOpen(false)}
      />
    </>
  );
};
