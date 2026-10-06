import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle,
  Sparkles,
  UserCheck,
  Cloud,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { ExportZipModal } from '../common/ExportZipModal';

export const LoginPage: React.FC = () => {
  const { login, availableUsers } = useApp();

  const [email, setEmail] = useState('dhaneshwarbirade@gmail.com');
  const [password, setPassword] = useState('Heloix@11');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExportZipOpen, setIsExportZipOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your company email address');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      if (!res.success) {
        setError(res.error || 'Invalid credentials');
      }
      setIsLoading(false);
    }, 250);
  };

  const handleQuickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('Heloix@11');
    setIsLoading(true);
    setTimeout(() => {
      const res = login(userEmail, 'Heloix@11');
      if (!res.success) {
        setError(res.error || 'Failed to authenticate');
      }
      setIsLoading(false);
    }, 200);
  };

  const demoAccounts = [
    {
      name: 'Dhaneshwar Birade',
      role: 'Super Admin / Founder',
      roleKey: 'super_admin',
      email: 'dhaneshwarbirade@gmail.com',
      badgeColor: 'border-rose-500/40 text-rose-700 bg-rose-50',
    },
    {
      name: 'Priya Sharma',
      role: 'HR Admin',
      roleKey: 'hr_admin',
      email: 'priya.hr@heloix.com',
      badgeColor: 'border-purple-500/40 text-purple-700 bg-purple-50',
    },
    {
      name: 'Vikram Patel',
      role: 'Lead Mentor',
      roleKey: 'mentor',
      email: 'vikram.mentor@heloix.com',
      badgeColor: 'border-emerald-500/40 text-emerald-700 bg-emerald-50',
    },
    {
      name: 'Aarav Mehta',
      role: 'Active Intern',
      roleKey: 'intern',
      email: 'aarav.mehta@example.com',
      badgeColor: 'border-slate-300 text-slate-800 bg-slate-100',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-black selection:text-white">
      {/* Top Floating Download Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setIsExportZipOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 text-xs font-semibold transition-all shadow-sm hover:shadow cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-black" />
          <span>Download Project ZIP</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-black items-center justify-center shadow-lg shadow-black/10 text-white font-black text-2xl tracking-tighter mx-auto mb-2">
            H
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Heloix WorkHub
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Heloix Startup Minds Pvt. Ltd. · Internship & Sprint Task Management Platform
          </p>
        </div>

        {/* Cloud Sync Status Pill */}
        <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Cloud className="w-3.5 h-3.5 text-slate-400" />
          <span>Cloud Sync & Database Online (PostgreSQL)</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Main Card */}
        <div className="bg-white py-8 px-6 sm:px-8 border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Company Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@heloix.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">
                  Secure Password
                </label>
                <span className="text-[10px] text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-semibold">
                  Password: Heloix@11
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Heloix@11"
                  className="w-full pl-9 pr-9 py-2 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 bg-white text-black focus:ring-black"
                />
                <span className="text-slate-600">Remember credentials</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Universal password for all accounts is: Heloix@11')}
                className="text-slate-900 hover:text-black text-xs font-semibold underline underline-offset-2 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-black hover:bg-slate-800 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-all shadow-md shadow-black/10 flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to WorkHub</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Persona Switcher for Evaluation */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Instant 1-Click Persona Sign-In
              </span>
              <span className="text-[10px] text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300 font-mono font-semibold">
                Auto-fill
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleQuickLogin(account.email)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-black hover:bg-slate-100 transition-all text-left group cursor-pointer"
                >
                  <UserAvatar
                    name={account.name}
                    role={account.roleKey}
                    size="md"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-black truncate">
                      {account.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {account.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Download ZIP Banner */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsExportZipOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-black text-slate-900 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-black" />
              <span>Download Project ZIP Archive</span>
            </button>
          </div>

          {/* Footer Security Badges */}
          <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              RBAC Protected
            </span>
            <span>·</span>
            <span>SRS BR-001 to BR-015</span>
            <span>·</span>
            <span>Audit Trail Enabled</span>
          </div>
        </div>
      </div>

      {/* Export ZIP Modal */}
      <ExportZipModal
        isOpen={isExportZipOpen}
        onClose={() => setIsExportZipOpen(false)}
      />
    </div>
  );
};
