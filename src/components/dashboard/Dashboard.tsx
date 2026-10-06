import React from 'react';
import {
  Users,
  CheckSquare,
  Clock,
  CalendarDays,
  AlertTriangle,
  Award,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  Shield,
  Briefcase,
  PlayCircle,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../layout/Sidebar';
import { Badge } from '../common/Badge';

interface DashboardProps {
  onNavigate: (tab: NavTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const {
    currentUser,
    candidates,
    tasks,
    leaves,
    warnings,
    attendance,
    certificates,
    settings,
  } = useApp();

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isHRAdmin = currentUser.role === 'hr_admin';
  const isMentor = currentUser.role === 'mentor';
  const isIntern = currentUser.role === 'intern';

  // Overall KPI counts
  const totalCandidates = candidates.length;
  const activeInterns = candidates.filter((c) => c.status === 'internship_active' || c.status === 'internship_extended');
  const pendingDocsCount = candidates.filter((c) => c.status === 'under_hr_verification').length;
  const pendingReviewTasks = tasks.filter((t) => t.status === 'submitted');
  const pendingLeaves = leaves.filter((l) => l.status === 'pending');
  const activeWarningsCount = warnings.length;
  const completedInternships = certificates.length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-black border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-white font-mono font-semibold uppercase">
              {currentUser.role.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Heloix WorkHub Platform
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight mt-1">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentUser.position || 'Operations Management'} · {settings.companyName}
          </p>
        </div>

        {/* Quick Shortcut Buttons based on Role */}
        <div className="flex flex-wrap items-center gap-2">
          {(isSuperAdmin || isHRAdmin) && (
            <button
              onClick={() => onNavigate('candidates')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-black hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Hiring Pipeline</span>
            </button>
          )}

          {isMentor && (
            <button
              onClick={() => onNavigate('tasks')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-black hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Review Tasks ({pendingReviewTasks.length})</span>
            </button>
          )}

          {isIntern && (
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-sm transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Daily Clock-In / Work Report</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigate('internships')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-1 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Interns</span>
            <Briefcase className="w-4 h-4 text-black font-semibold group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-mono">
            {activeInterns.length}
          </div>
          <span className="text-[10px] text-slate-500 block">Across engineering & design</span>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigate('tasks')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-1 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Tasks in Review</span>
            <CheckSquare className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-indigo-400 font-mono">
            {pendingReviewTasks.length}
          </div>
          <span className="text-[10px] text-slate-500 block">Max 7-day turnaround (BR-005)</span>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigate('candidates')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-1 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Pending HR Docs</span>
            <Shield className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-400 font-mono">
            {pendingDocsCount}
          </div>
          <span className="text-[10px] text-slate-500 block">Awaiting verification (BR-002)</span>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigate('performance')}
          className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-1 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Warnings Issued</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-400 font-mono">
            {activeWarningsCount}
          </div>
          <span className="text-[10px] text-slate-500 block">Performance escalation active</span>
        </div>
      </div>

      {/* Main Grid: Urgent Tasks / Live Activity + Intern Lifecycle Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tasks Pending Action (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Pending Review Queue */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-black font-semibold" />
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Sprint Deliverables Awaiting Evaluation
                </h3>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs text-black font-semibold hover:text-slate-800 font-medium font-medium"
              >
                View all ({tasks.length})
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {pendingReviewTasks.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No deliverables currently awaiting mentor review.
                </div>
              ) : (
                pendingReviewTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onNavigate('tasks')}
                    className="p-4 hover:bg-slate-800/40 cursor-pointer transition-colors flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100">{t.title}</span>
                        <Badge status={t.priority} />
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Intern: <strong className="text-slate-200">{t.assignedInternName}</strong> · Mentor:{' '}
                        {t.assignedMentorName}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-[11px] text-black font-semibold block">Due: {t.dueDate}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{t.durationDays}d duration</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section: Pending Leave Requests */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Pending Leave Applications & Automatic Extension Watch (BR-008)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('leaves')}
                className="text-xs text-black font-semibold hover:text-slate-800 font-medium font-medium"
              >
                Manage leaves
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {pendingLeaves.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No leave applications currently pending approval.
                </div>
              ) : (
                pendingLeaves.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => onNavigate('leaves')}
                    className="p-4 hover:bg-slate-800/40 cursor-pointer transition-colors flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100">{l.candidateName}</span>
                        <span className="uppercase font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/60">
                          {l.leaveType}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{l.reason}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-slate-300 block">{l.totalDays} Day(s)</span>
                      <span className="text-[10px] text-slate-500">{l.startDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Pipeline Health & Rules (1 Col) */}
        <div className="space-y-6">
          {/* Internship Lifecycle Stage Count */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span>Candidate Pipeline Funnel</span>
              <span className="text-slate-500 font-mono">{candidates.length} Total</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {[
                { label: 'Offer Stage', count: candidates.filter((c) => c.status.startsWith('offer')).length, color: 'bg-black text-white' },
                { label: 'Document Verification', count: candidates.filter((c) => c.status === 'under_hr_verification' || c.status === 'documents_pending').length, color: 'bg-purple-500' },
                { label: 'Onboarding & Training', count: candidates.filter((c) => c.status === 'onboarding' || c.status === 'onboarding_completed').length, color: 'bg-indigo-500' },
                { label: 'Active Workspaces', count: activeInterns.length, color: 'bg-emerald-500' },
                { label: 'Completed & Certified', count: certificates.length, color: 'bg-amber-500' },
                { label: 'Terminated', count: candidates.filter((c) => c.status === 'terminated').length, color: 'bg-rose-500' },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${step.color}`} />
                    <span className="text-slate-300">{step.label}</span>
                  </div>
                  <span className="font-mono text-slate-400 font-bold">{step.count}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('candidates')}
              className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              Open Full Hiring Pipeline
            </button>
          </div>

          {/* Business Rules Integrity Check */}
          <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Enforced Business Rules (SRS Section 61)
            </h3>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-black font-semibold font-mono font-bold">BR-001:</span>
                <span>Offer letter must be digitally accepted before document upload.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-black font-semibold font-mono font-bold">BR-002:</span>
                <span>Mandatory documents must be verified by HR before approval.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-black font-semibold font-mono font-bold">BR-005:</span>
                <span>Maximum task duration strictly capped at 7 calendar days.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-black font-semibold font-mono font-bold">BR-007:</span>
                <span>Clock-out requires compulsory daily work report submission.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-black font-semibold font-mono font-bold">BR-008:</span>
                <span>Excess leave automatically extends internship duration.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
