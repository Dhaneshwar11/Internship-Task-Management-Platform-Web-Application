import React from 'react';
import { CandidateStatus, TaskStatus, DocumentStatus } from '../../types';

interface BadgeProps {
  status: CandidateStatus | TaskStatus | DocumentStatus | string;
  variant?: 'subtle' | 'outline' | 'dot';
}

const statusConfig: Record<string, { label: string; text: string; bg: string; dot: string }> = {
  // Candidate Statuses
  draft: { label: 'Draft', text: 'text-slate-500', bg: 'bg-slate-100', dot: 'bg-slate-400' },
  offer_pending: { label: 'Offer Pending', text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  offer_sent: { label: 'Offer Sent', text: 'text-slate-900', bg: 'bg-slate-100', dot: 'bg-black' },
  offer_accepted: { label: 'Offer Signed', text: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  offer_rejected: { label: 'Offer Rejected', text: 'text-rose-700', bg: 'bg-rose-50', dot: 'bg-rose-500' },
  documents_pending: { label: 'Docs Pending', text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  documents_submitted: { label: 'Docs Submitted', text: 'text-slate-900', bg: 'bg-slate-100', dot: 'bg-black' },
  under_hr_verification: { label: 'HR Verification', text: 'text-purple-700', bg: 'bg-purple-50', dot: 'bg-purple-500' },
  documents_rejected: { label: 'Docs Rejected', text: 'text-rose-700', bg: 'bg-rose-50', dot: 'bg-rose-500' },
  approved: { label: 'Approved', text: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  onboarding: { label: 'Onboarding', text: 'text-slate-900', bg: 'bg-slate-100', dot: 'bg-black' },
  onboarding_completed: { label: 'Onboarding Done', text: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  internship_pending: { label: 'Activation Pending', text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  internship_active: { label: 'Active Intern', text: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  internship_extended: { label: 'Extended (+Days)', text: 'text-orange-700', bg: 'bg-orange-50', dot: 'bg-orange-500' },
  internship_completed: { label: 'Completed', text: 'text-slate-900', bg: 'bg-slate-100', dot: 'bg-black' },
  terminated: { label: 'Terminated', text: 'text-rose-700', bg: 'bg-rose-50', dot: 'bg-rose-500' },
  withdrawn: { label: 'Withdrawn', text: 'text-slate-500', bg: 'bg-slate-100', dot: 'bg-slate-500' },

  // Task Statuses
  assigned: { label: 'Assigned', text: 'text-slate-900', bg: 'bg-slate-100', dot: 'bg-black' },
  in_progress: { label: 'In Progress', text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  submitted: { label: 'Submitted', text: 'text-purple-700', bg: 'bg-purple-50', dot: 'bg-purple-500' },
  under_review: { label: 'Under Review', text: 'text-slate-900', bg: 'bg-slate-100', dot: 'bg-black' },
  changes_requested: { label: 'Changes Requested', text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  resubmitted: { label: 'Resubmitted', text: 'text-slate-900', bg: 'bg-slate-100', dot: 'bg-black' },
  overdue: { label: 'Overdue', text: 'text-rose-700', bg: 'bg-rose-50', dot: 'bg-rose-500' },
  rejected: { label: 'Rejected', text: 'text-rose-700', bg: 'bg-rose-50', dot: 'bg-rose-500' },

  // Document Statuses
  not_submitted: { label: 'Not Submitted', text: 'text-slate-500', bg: 'bg-slate-100', dot: 'bg-slate-400' },
  resubmission_required: { label: 'Resubmit Required', text: 'text-rose-700', bg: 'bg-rose-50', dot: 'bg-rose-500' },

  // Priority
  low: { label: 'Low Priority', text: 'text-slate-600', bg: 'bg-slate-100', dot: 'bg-slate-400' },
  medium: { label: 'Medium', text: 'text-slate-900', bg: 'bg-slate-100', dot: 'bg-black' },
  high: { label: 'High Priority', text: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  critical: { label: 'Critical', text: 'text-rose-700', bg: 'bg-rose-50', dot: 'bg-rose-500' },
};

export const Badge: React.FC<BadgeProps> = ({ status, variant = 'subtle' }) => {
  const config = statusConfig[status] || {
    label: status.replace(/_/g, ' '),
    text: 'text-slate-700',
    bg: 'bg-slate-100',
    dot: 'bg-slate-400',
  };

  if (variant === 'dot') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  }

  if (variant === 'outline') {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border border-slate-300 ${config.text}`}
      >
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-slate-200/60 ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
