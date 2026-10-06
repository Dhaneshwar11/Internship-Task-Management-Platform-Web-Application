import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  ArrowRight,
} from 'lucide-react';
import { LeaveRequest, LeaveType } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { UserAvatar } from '../common/UserAvatar';

export const LeaveManagement: React.FC = () => {
  const { leaves, candidates, applyLeave, reviewLeave, currentUser, settings } = useApp();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [candidateId, setCandidateId] = useState(candidates[0]?.id || '');
  const [leaveType, setLeaveType] = useState<LeaveType>('casual');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [totalDays, setTotalDays] = useState(1);
  const [reason, setReason] = useState('');
  const [reviewRemarks, setReviewRemarks] = useState('');

  const isHRorAdmin = currentUser.role === 'hr_admin' || currentUser.role === 'super_admin' || currentUser.role === 'mentor';

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    applyLeave({
      candidateId,
      leaveType,
      startDate,
      endDate,
      totalDays: Number(totalDays),
      reason,
    });

    setIsApplyModalOpen(false);
    setReason('');
  };

  const handleReviewAction = (leaveId: string, action: 'approved' | 'rejected') => {
    reviewLeave(leaveId, action, reviewRemarks || undefined);
    setReviewRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Leave Management & Automatic Extensions (BR-008, BR-009)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Policy: {settings.monthlyCasualLeave} Casual + {settings.monthlySickLeave} Sick Leave per month. Excess leaves automatically push the relieving date.
          </p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Apply for Leave
        </button>
      </div>

      {/* Automatic Extension Rule Banner (Section 21 & BR-008) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-amber-300">
              BR-008 Automated Internship Extension Rule Active
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              When an intern takes leave exceeding their monthly entitlement, the system automatically extends their expected relieving date by the exact excess days. The internship cannot be completed before the revised date.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800 text-amber-300 shrink-0">
          <span>Relieving Date = Original Date + Excess Days</span>
        </div>
      </div>

      {/* Interns Leave Entitlement Snapshot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates
          .filter((c) => c.status === 'internship_active' || c.status === 'internship_extended')
          .map((candidate) => (
            <div
              key={candidate.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <UserAvatar
                    name={candidate.fullName}
                    role="intern"
                    size="md"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{candidate.fullName}</h4>
                    <p className="text-[10px] text-slate-400">{candidate.position}</p>
                  </div>
                </div>
                {candidate.extensionDays > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-orange-950/60 text-orange-400 border border-orange-800/60 font-mono">
                    +{candidate.extensionDays}d Ext
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-800/60">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Casual Left</span>
                  <span className="font-mono text-slate-200">
                    {candidate.leaveEntitlement.casual - candidate.leaveEntitlement.usedCasual} / {candidate.leaveEntitlement.casual}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Sick Left</span>
                  <span className="font-mono text-slate-200">
                    {candidate.leaveEntitlement.sick - candidate.leaveEntitlement.usedSick} / {candidate.leaveEntitlement.sick}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Relieving</span>
                  <span className="font-mono text-black font-semibold text-[11px] truncate block">
                    {candidate.expectedRelievingDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Leave Requests Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Leave Applications & Approval History
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {leaves.length} Applications Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="px-5 py-3">Intern</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Dates</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Remarks / Reviewer</th>
                {isHRorAdmin && <th className="px-5 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {leaves.map((leave) => {
                const isPending = leave.status === 'pending';

                return (
                  <tr key={leave.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-100">{leave.candidateName}</td>
                    <td className="px-5 py-3 uppercase font-mono text-slate-300">{leave.leaveType}</td>
                    <td className="px-5 py-3 font-mono text-slate-400">
                      {leave.startDate} to {leave.endDate}
                    </td>
                    <td className="px-5 py-3 font-mono">
                      {leave.totalDays} Day(s)
                      {leave.isExcessLeave && (
                        <span className="ml-1 text-[10px] text-amber-400">(Excess)</span>
                      )}
                    </td>
                    <td className="px-5 py-3 max-w-xs truncate text-slate-300">{leave.reason}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          leave.status === 'approved'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                            : leave.status === 'rejected'
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                        }`}
                      >
                        {leave.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-[11px]">
                      {leave.remarks || leave.reviewedBy || '-'}
                    </td>
                    {isHRorAdmin && (
                      <td className="px-5 py-3 text-right">
                        {isPending && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleReviewAction(leave.id, 'approved')}
                              className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-medium"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReviewAction(leave.id, 'rejected')}
                              className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Leave"
        subtitle="Entitlement: 1 Casual + 1 Sick Leave per month. Excess leaves extend duration automatically (BR-008)."
        maxWidth="md"
      >
        <form onSubmit={handleApply} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Applying Intern *</label>
            <select
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.position})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Total Days *</label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={totalDays}
                onChange={(e) => setTotalDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Reason for Leave *</label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide reason for absence..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-black hover:bg-slate-800 text-white rounded-lg shadow-sm"
            >
              Submit Leave Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
