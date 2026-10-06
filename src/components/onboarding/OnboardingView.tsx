import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle,
  PlayCircle,
  FileText,
  ShieldCheck,
  ExternalLink,
  Clock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OnboardingItem } from '../../types';

export const OnboardingView: React.FC = () => {
  const {
    currentUser,
    candidates,
    onboardingItems,
    toggleOnboardingItem,
    requestInternshipActivation,
    activateInternship,
    availableUsers,
  } = useApp();

  // Find candidate corresponding to current user if intern, or allow selecting candidate for HR/Admin preview
  const internCandidate = candidates.find((c) => c.id === currentUser.id) || candidates[0];
  const [selectedCandidateId, setSelectedCandidateId] = useState(internCandidate?.id || 'cand-aarav');
  const [activeItem, setActiveItem] = useState<OnboardingItem | null>(null);

  const currentCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const mandatoryItems = onboardingItems.filter((i) => i.isMandatory);
  const completedMandatory = mandatoryItems.filter((i) => i.isCompleted).length;
  const progressPercent = Math.round((completedMandatory / mandatoryItems.length) * 100);

  const canRequestActivation = progressPercent === 100 && (currentCandidate.status === 'onboarding' || currentCandidate.status === 'onboarding_completed');
  const isHRorSuperAdmin = currentUser.role === 'hr_admin' || currentUser.role === 'super_admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Onboarding & Training Modules</h2>
          <p className="text-xs text-slate-400 mt-1">
            Mandatory training, department architecture, NDA compliance, and internship activation checklist (SRS Sections 14–17).
          </p>
        </div>

        {/* Candidate Selector for Admins */}
        {isHRorSuperAdmin && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Viewing Candidate:</span>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Progress & Activation Request Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-100">
                Onboarding Readiness: {currentCandidate?.fullName}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-black font-semibold font-mono">
                {currentCandidate?.departmentName}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {completedMandatory} of {mandatoryItems.length} mandatory modules completed. 100% required before internship activation request (BR-004).
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-black font-semibold font-mono">{progressPercent}%</span>
            <span className="text-xs text-slate-500 block">Completion</span>
          </div>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Section 17 Activation Request Workflow */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
          <div className="text-xs text-slate-400">
            Current Status: <strong className="text-slate-200 capitalize">{currentCandidate?.status.replace('_', ' ')}</strong>
          </div>

          <div className="flex items-center gap-2">
            {canRequestActivation && currentCandidate?.status !== 'internship_pending' && (
              <button
                type="button"
                onClick={() => requestInternshipActivation(currentCandidate.id)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-slate-950 rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Submit Request to Start Internship
              </button>
            )}

            {currentCandidate?.status === 'internship_pending' && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-lg">
                <Clock className="w-3.5 h-3.5" />
                Internship activation requested · Awaiting HR assignment of mentor
              </div>
            )}

            {isHRorSuperAdmin && currentCandidate?.status === 'internship_pending' && (
              <button
                type="button"
                onClick={() => activateInternship(currentCandidate.id, 'user-mentor-1')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                HR Approve & Activate Workspace
              </button>
            )}

            {currentCandidate?.status === 'internship_active' && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Internship Workspace Active · Mentor: {currentCandidate.assignedMentorName}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Onboarding Items List */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Curated Onboarding Curriculum
        </h4>

        <div className="space-y-3">
          {onboardingItems.map((item, index) => {
            const isCompleted = item.isCompleted;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-900/60 border-slate-800/60 opacity-90'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleOnboardingItem(currentCandidate.id, item.id)}
                      className={`w-6 h-6 mt-0.5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'border border-slate-700 bg-slate-950 hover:border-black text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">0{index + 1}</span>
                        <h4
                          className={`text-sm font-semibold ${
                            isCompleted ? 'text-slate-300 line-through' : 'text-slate-100'
                          }`}
                        >
                          {item.title}
                        </h4>
                        {item.isMandatory ? (
                          <span className="text-[10px] text-rose-400 font-medium bg-rose-950/40 px-1.5 py-0.2 rounded border border-rose-900/40">
                            Mandatory
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                            Optional
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded uppercase font-mono">
                          {item.type}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                        {item.description}
                      </p>

                      {item.contentText && (
                        <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 mt-2">
                          {item.contentText}
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Est. {item.estimatedMinutes} mins
                        </span>
                        {isCompleted && item.completedAt && (
                          <span className="text-emerald-400">
                            Completed on {new Date(item.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleOnboardingItem(currentCandidate.id, item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isCompleted
                          ? 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          : 'bg-slate-100 text-black font-semibold border border-black hover:bg-slate-100'
                      }`}
                    >
                      {isCompleted ? 'Mark Incomplete' : 'Complete & Acknowledge'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
