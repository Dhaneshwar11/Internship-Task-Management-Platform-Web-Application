import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Calendar,
  User,
  Flag,
  Send,
  CheckCircle,
  XCircle,
  RotateCcw,
  FileText,
  Paperclip,
  ExternalLink,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { Task } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose }) => {
  const { submitTask, reviewTask, currentUser, settings } = useApp();

  // Submission Form State (for intern)
  const [completionSummary, setCompletionSummary] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Review Form State (for mentor)
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  if (!task) return null;

  const isAssignedIntern = currentUser.id === task.assignedInternId || currentUser.role === 'intern';
  const isMentorOrAdmin = currentUser.role === 'mentor' || currentUser.role === 'super_admin' || currentUser.role === 'hr_admin' || currentUser.role === 'dept_admin';

  const handleInternSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completionSummary.trim()) return;

    submitTask(task.id, {
      completionSummary,
      deliverableUrl: deliverableUrl || 'https://github.com/heloix/workhub/pull/preview',
      attachments: [{ name: 'work_deliverable_proof.png', size: '1.4 MB' }],
      comments,
    });

    setIsSubmitting(false);
    setCompletionSummary('');
  };

  const handleReviewAction = (action: 'approved' | 'changes_requested' | 'rejected') => {
    if (!reviewFeedback.trim() && action !== 'approved') return;
    reviewTask(task.id, action, reviewFeedback || 'Task approved. Acceptance criteria fully satisfied.');
    setReviewFeedback('');
    setIsReviewing(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task.title}
      subtitle={`Duration: ${task.durationDays} Days (Max 7 Days BR-005) · Department: ${task.departmentName}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Top Badges & Escalation Alert Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            <Badge status={task.status} />
            <Badge status={task.priority} />
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Due: {task.dueDate}
            </span>
            <span>·</span>
            <span className="font-mono text-black font-semibold font-semibold">{task.durationDays}d Sprint</span>
          </div>
        </div>

        {/* Warning / Rejection Alert if Task has repeated failures (Section 30) */}
        {task.rejectionCount > 0 && (
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-300">
            <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-rose-200">
                Performance Escalation Notice ({task.rejectionCount} Rejection/Change Cycles)
              </p>
              <p className="text-[11px] text-rose-300/80 mt-0.5">
                Per Section 30 & 59: Reaching {settings.warningThreshold} rejections automatically issues an official Warning Letter, {settings.finalWarningThreshold} triggers Final Warning, and {settings.terminationThreshold} triggers Termination.
              </p>
            </div>
          </div>
        )}

        {/* Task Details Grid */}
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
            <span className="text-slate-500 font-medium">Task Scope & Description:</span>
            <p className="text-slate-200 mt-1 leading-relaxed whitespace-pre-wrap">{task.description}</p>
          </div>

          {task.instructions && (
            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
              <span className="text-slate-500 font-medium">Technical Instructions & Checklist:</span>
              <p className="text-slate-200 mt-1 leading-relaxed whitespace-pre-wrap">{task.instructions}</p>
            </div>
          )}

          <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
            <span className="text-slate-500 font-medium">Expected Deliverable:</span>
            <p className="text-slate-800 font-medium font-mono mt-1">{task.expectedDeliverable}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
              <span className="text-slate-500">Assigned Intern:</span>
              <p className="text-slate-200 font-medium mt-0.5">{task.assignedInternName}</p>
            </div>
            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
              <span className="text-slate-500">Reporting Mentor:</span>
              <p className="text-slate-200 font-medium mt-0.5">{task.assignedMentorName}</p>
            </div>
          </div>
        </div>

        {/* Submissions & Versions History (Section 27 & 28) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Submission Deliverables ({task.submissions.length})
            </h4>
            {task.submissions.length > 0 && (
              <span className="text-[11px] text-slate-500 font-mono">
                Latest: v{task.submissions[0].version}
              </span>
            )}
          </div>

          {task.submissions.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
              No submissions yet. Intern must submit deliverables for review.
            </p>
          ) : (
            <div className="space-y-2">
              {task.submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold text-slate-200">Version {sub.version} Deliverable</span>
                    <span className="text-[11px] font-mono">{new Date(sub.submittedAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{sub.completionSummary}</p>
                  {sub.deliverableUrl && (
                    <div className="flex items-center gap-1.5 text-black font-semibold hover:text-slate-800 font-medium">
                      <ExternalLink className="w-3 h-3" />
                      <a href={sub.deliverableUrl} target="_blank" rel="noreferrer" className="underline truncate max-w-sm">
                        {sub.deliverableUrl}
                      </a>
                    </div>
                  )}
                  {sub.attachments && sub.attachments.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      {sub.attachments.map((att, i) => (
                        <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                          <Paperclip className="w-3 h-3 text-slate-500" /> {att.name} ({att.size})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mentor Reviews History */}
        {task.reviews.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Mentor Review Log ({task.reviews.length})
            </h4>
            <div className="space-y-2">
              {task.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    rev.action === 'approved'
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                      : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{rev.reviewerName} · {rev.action.replace('_', ' ').toUpperCase()}</span>
                    <span className="text-[10px] opacity-75 font-mono">{new Date(rev.reviewedAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-200 text-xs">{rev.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Intern Submission Form */}
        {isSubmitting && (
          <form onSubmit={handleInternSubmit} className="p-4 bg-slate-950 border border-black rounded-xl space-y-3 text-xs">
            <h4 className="font-semibold text-black font-semibold flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Submit Task Deliverable
            </h4>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Completion Summary & Proof *</label>
              <textarea
                rows={3}
                required
                value={completionSummary}
                onChange={(e) => setCompletionSummary(e.target.value)}
                placeholder="Explain what was accomplished, test results, pull request details..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Deliverable URL (PR / Demo link)</label>
              <input
                type="url"
                value={deliverableUrl}
                onChange={(e) => setDeliverableUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitting(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-black hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm"
              >
                Submit Deliverable
              </button>
            </div>
          </form>
        )}

        {/* Mentor Review Form */}
        {isReviewing && (
          <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-xl space-y-3 text-xs">
            <h4 className="font-semibold text-indigo-400 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" />
              Mentor Review Decision (Section 28)
            </h4>
            <p className="text-slate-400 text-[11px]">
              Provide feedback for the intern. If requesting changes or rejecting, state actionable fixes.
            </p>
            <textarea
              rows={2}
              value={reviewFeedback}
              onChange={(e) => setReviewFeedback(e.target.value)}
              placeholder="Mentor feedback notes..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsReviewing(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleReviewAction('changes_requested')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-medium"
                >
                  Request Changes
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('rejected')}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 font-medium"
                >
                  Reject Deliverable
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewAction('approved')}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-sm"
                >
                  Approve Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Toolbar */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {!isSubmitting && (task.status === 'assigned' || task.status === 'in_progress' || task.status === 'changes_requested') && (
              <button
                type="button"
                onClick={() => setIsSubmitting(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-black hover:bg-slate-800 text-white rounded-lg shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Task Work
              </button>
            )}

            {!isReviewing && isMentorOrAdmin && (task.status === 'submitted' || task.status === 'resubmitted') && (
              <button
                type="button"
                onClick={() => setIsReviewing(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-slate-950 rounded-lg shadow-sm"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Review Deliverable
              </button>
            )}

            {task.status === 'approved' && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                <CheckCircle className="w-4 h-4" /> Task Completed & Approved
              </span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
