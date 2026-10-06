import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Shield,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Candidate } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { OfferLetterModal } from './OfferLetterModal';
import { DocumentVerificationModal } from './DocumentVerificationModal';
import { UserAvatar } from '../common/UserAvatar';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  isOpen,
  onClose,
}) => {
  const { availableUsers, activateInternship, updateCandidateStatus, currentUser } = useApp();
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState('user-mentor-1');

  if (!candidate) return null;

  const isHRorAdmin = currentUser.role === 'hr_admin' || currentUser.role === 'super_admin';
  const mentors = availableUsers.filter((u) => u.role === 'mentor');

  const handleActivate = () => {
    activateInternship(candidate.id, selectedMentorId);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={candidate.fullName}
        subtitle={`${candidate.position} · ${candidate.departmentName}`}
        maxWidth="4xl"
      >
        <div className="space-y-6">
          {/* Top Profile Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-4">
              <UserAvatar
                name={candidate.fullName}
                role="candidate"
                size="xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100">{candidate.fullName}</h3>
                  <Badge status={candidate.status} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{candidate.qualification}</p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {candidate.email}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {candidate.phone}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {candidate.city}, {candidate.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-black font-semibold border border-slate-300 hover:bg-slate-100 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Offer Letter
              </button>

              <button
                type="button"
                onClick={() => setIsDocModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Documents ({candidate.documents.filter((d) => d.status === 'approved').length}/{candidate.documents.length})
              </button>
            </div>
          </div>

          {/* Key Internship Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
              <span className="text-slate-500">Duration & Type</span>
              <p className="text-sm font-semibold text-slate-200 mt-1">
                {candidate.durationMonths} Months ({candidate.internshipType})
              </p>
            </div>

            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
              <span className="text-slate-500">Joining Date</span>
              <p className="text-sm font-semibold text-slate-200 mt-1">{candidate.joiningDate}</p>
            </div>

            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
              <span className="text-slate-500">Relieving Date</span>
              <p className="text-sm font-semibold text-slate-200 mt-1">
                {candidate.expectedRelievingDate}
                {candidate.extensionDays > 0 && (
                  <span className="text-[10px] text-amber-400 ml-1 font-mono">
                    (+{candidate.extensionDays}d ext)
                  </span>
                )}
              </p>
            </div>

            <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg">
              <span className="text-slate-500">Assigned Mentor</span>
              <p className="text-sm font-semibold text-slate-200 mt-1">
                {candidate.assignedMentorName || 'Unassigned'}
              </p>
            </div>
          </div>

          {/* Leave Entitlement & Extension Rules (Section 20 & 21) */}
          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Leave Entitlement & Automatic Extensions (BR-008, BR-009)
              </h4>
              <span className="text-[11px] text-slate-400">
                Policy: 1 Casual + 1 Sick Leave per Month
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500">Casual Leaves</span>
                <p className="font-mono text-sm text-slate-200 mt-0.5">
                  {candidate.leaveEntitlement.usedCasual} used / {candidate.leaveEntitlement.casual} total
                </p>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500">Sick Leaves</span>
                <p className="font-mono text-sm text-slate-200 mt-0.5">
                  {candidate.leaveEntitlement.usedSick} used / {candidate.leaveEntitlement.sick} total
                </p>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500">Excess Leaves</span>
                <p className="font-mono text-sm text-amber-400 mt-0.5">
                  {candidate.leaveEntitlement.excessDays} Day(s)
                </p>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500">Internship Extension</span>
                <p className="font-mono text-sm text-orange-400 mt-0.5">
                  +{candidate.extensionDays} Day(s)
                </p>
              </div>
            </div>

            {candidate.extensionReason && (
              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5" />
                {candidate.extensionReason}
              </div>
            )}
          </div>

          {/* Onboarding Progress (Section 16) */}
          <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Onboarding & Training Completion
              </h4>
              <span className="text-xs font-bold text-black font-semibold font-mono">
                {candidate.onboardingProgress}% Complete
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-black to-slate-700 transition-all duration-500"
                style={{ width: `${candidate.onboardingProgress}%` }}
              />
            </div>

            {/* Stage-based Activation Trigger */}
            {isHRorAdmin && (candidate.status === 'onboarding_completed' || candidate.status === 'internship_pending') && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-semibold text-emerald-300">
                    Candidate completed 100% mandatory onboarding requirements!
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Assign a dedicated mentor to activate the internship workspace.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedMentorId}
                    onChange={(e) => setSelectedMentorId(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-200"
                  >
                    {mentors.map((m) => (
                      <option key={m.id} value={m.id}>
                        Mentor: {m.name} ({m.departmentName || 'Eng'})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleActivate}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Activate Internship (BR-004)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Embedded Offer Modal */}
      <OfferLetterModal
        candidate={candidate}
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
      />

      {/* Embedded Document Verification Modal */}
      <DocumentVerificationModal
        candidate={candidate}
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
      />
    </>
  );
};
