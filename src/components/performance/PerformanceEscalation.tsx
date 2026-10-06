import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  FileText,
  UserX,
  CheckCircle,
  Eye,
  Printer,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { WarningRecord } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

export const PerformanceEscalation: React.FC = () => {
  const { warnings, candidates, tasks, terminateInternship, settings, currentUser } = useApp();

  const [selectedWarning, setSelectedWarning] = useState<WarningRecord | null>(null);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [termCandidateId, setTermCandidateId] = useState(candidates[0]?.id || '');
  const [termReason, setTermReason] = useState('');

  const isHRorAdmin = currentUser.role === 'hr_admin' || currentUser.role === 'super_admin';

  const handleOpenLetter = (warn: WarningRecord) => {
    setSelectedWarning(warn);
    setIsLetterModalOpen(true);
  };

  const handleTerminateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termReason.trim()) return;
    terminateInternship(termCandidateId, termReason);
    setIsTermModalOpen(false);
    setTermReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Performance Escalation & Disciplinary Engine (Sections 30–33)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated tracking of repeated failed task reviews: {settings.warningThreshold} failures → Warning Letter, {settings.finalWarningThreshold} failures → Final Warning, {settings.terminationThreshold} failures → Termination.
          </p>
        </div>

        {isHRorAdmin && (
          <button
            onClick={() => setIsTermModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 rounded-lg text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
          >
            <UserX className="w-4 h-4" />
            Initiate Termination Action
          </button>
        )}
      </div>

      {/* Escalation Policy Banner (Section 59) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-400" />
          Automated Disciplinary Thresholds (Configured in System Settings)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-amber-300">Level 1: Official Warning</span>
              <span className="font-mono text-amber-400 font-bold">{settings.warningThreshold} Failures</span>
            </div>
            <p className="text-[11px] text-slate-400">
              System generates formal warning letter with task history & required improvement guidelines.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-orange-950/20 border border-orange-900/40">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-orange-300">Level 2: Final Warning</span>
              <span className="font-mono text-orange-400 font-bold">{settings.finalWarningThreshold} Failures</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Mandatory intervention notice. Candidate placed on strict improvement probation.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-rose-300">Level 3: Contract Termination</span>
              <span className="font-mono text-rose-400 font-bold">{settings.terminationThreshold} Failures</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Contract terminated under Section 33. Task submission locked (BR-013) & data preserved.
            </p>
          </div>
        </div>
      </div>

      {/* Warnings & Disciplinary Letters Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Active Disciplinary Records & Issued Letters
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {warnings.length} Active Records
          </span>
        </div>

        {warnings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No disciplinary cases or warning letters recorded.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {warnings.map((warn) => (
              <div
                key={warn.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                        warn.type === 'termination'
                          ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
                          : warn.type === 'final_warning'
                          ? 'bg-orange-950/80 text-orange-400 border border-orange-800/80'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
                      }`}
                    >
                      {warn.type.replace('_', ' ')}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-100">{warn.candidateName}</h4>
                    <span className="text-xs text-slate-400">({warn.departmentName})</span>
                  </div>

                  <p className="text-xs text-slate-300 max-w-2xl">{warn.reason}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 font-mono">
                    <span>Issued Date: {warn.issueDate}</span>
                    <span>·</span>
                    <span>Mentor: {warn.mentorName}</span>
                    <span>·</span>
                    <span className="text-rose-400">{warn.failedTaskCount} Task Rejections</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenLetter(warn)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Formal Letter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disciplinary Letter Viewer Modal */}
      {selectedWarning && (
        <Modal
          isOpen={isLetterModalOpen}
          onClose={() => setIsLetterModalOpen(false)}
          title={`Formal Disciplinary Notice · ${selectedWarning.type.toUpperCase()}`}
          subtitle={`Issued to: ${selectedWarning.candidateName} on ${selectedWarning.issueDate}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="bg-white text-slate-900 rounded-lg p-6 sm:p-8 shadow-xl border border-slate-200 space-y-4 font-sans text-xs leading-relaxed">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{settings.companyName}</h3>
                  <p className="text-[11px] text-slate-500">{settings.companyAddress}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-rose-600 font-bold uppercase text-[11px]">
                    OFFICIAL DISCIPLINARY LETTER
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">REF: HLX-DISC-{selectedWarning.id.toUpperCase()}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-800">To,</p>
                <p className="font-bold text-slate-900 text-sm">{selectedWarning.candidateName}</p>
                <p className="text-slate-600">Department of {selectedWarning.departmentName}</p>
              </div>

              <div className="space-y-2 text-slate-700">
                <p>
                  <strong>Subject: Official {selectedWarning.type.replace('_', ' ').toUpperCase()} regarding Performance Criteria</strong>
                </p>
                <p>
                  This official notice is issued due to repeated failures to meet the standard task completion, code quality, and delivery benchmarks established during your internship appointment.
                </p>
                <p>
                  <strong>Documented Reason:</strong> {selectedWarning.reason}
                </p>
                <p>
                  <strong>Required Remedial Improvement:</strong> {selectedWarning.requiredImprovement}
                </p>
                <p className="text-[11px] text-slate-500 italic pt-2">
                  Failure to demonstrate prompt and sustained improvement will lead directly to escalation under Section 32 (Final Warning) or immediate termination under Section 33.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <p className="font-serif italic text-base text-slate-800">{selectedWarning.signatory}</p>
                <p className="font-semibold text-slate-800 mt-1">{selectedWarning.signatory}</p>
                <p className="text-[10px] text-slate-500">{settings.signatoryTitle}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save Notice
              </button>

              <button
                type="button"
                onClick={() => setIsLetterModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Manual HR Termination Modal */}
      <Modal
        isOpen={isTermModalOpen}
        onClose={() => setIsTermModalOpen(false)}
        title="Initiate Termination Process (Section 33)"
        subtitle="Historical candidate records are strictly preserved, while task submission is disabled."
        maxWidth="md"
      >
        <form onSubmit={handleTerminateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Target Intern *</label>
            <select
              value={termCandidateId}
              onChange={(e) => setTermCandidateId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
            >
              {candidates
                .filter((c) => c.status !== 'terminated' && c.status !== 'internship_completed')
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({c.position})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Termination Cause & Related Tasks *</label>
            <textarea
              rows={3}
              required
              value={termReason}
              onChange={(e) => setTermReason(e.target.value)}
              placeholder="State verified task failures and rationale for contract termination..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsTermModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-white rounded-lg shadow-sm"
            >
              Confirm Termination (BR-013)
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
