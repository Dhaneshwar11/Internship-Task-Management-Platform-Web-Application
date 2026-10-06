import React, { useState } from 'react';
import { FileText, Send, CheckCircle, Shield, Calendar, User, Building, Printer } from 'lucide-react';
import { Candidate } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { SignaturePad } from '../common/SignaturePad';

interface OfferLetterModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OfferLetterModal: React.FC<OfferLetterModalProps> = ({
  candidate,
  isOpen,
  onClose,
}) => {
  const { generateAndSendOffer, signOffer, settings, currentUser } = useApp();
  const [stipend, setStipend] = useState('₹25,000 / month');
  const [durationMonths, setDurationMonths] = useState(candidate?.durationMonths || 3);
  const [isSigning, setIsSigning] = useState(false);

  if (!candidate) return null;

  const offer = candidate.offer;
  const isAccepted = offer?.status === 'accepted';
  const isSent = offer?.status === 'sent';

  const handleSendOffer = () => {
    generateAndSendOffer(candidate.id, {
      stipend,
      durationMonths,
      position: candidate.position,
      department: candidate.departmentName,
    });
  };

  const handleApplySignature = (signatureDataUrl: string) => {
    signOffer(candidate.id, signatureDataUrl);
    setIsSigning(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Offer Letter · ${candidate.fullName}`}
      subtitle={`Position: ${candidate.position} · ${candidate.departmentName}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Status banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Status:</span>
            {isAccepted ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Digitally Signed & Accepted on{' '}
                {new Date(offer?.acceptedDate || '').toLocaleDateString()}
              </span>
            ) : isSent ? (
              <span className="text-black font-semibold font-medium">
                Sent to candidate ({candidate.email}) · Awaiting Digital Signature
              </span>
            ) : (
              <span className="text-amber-400 font-medium">Draft Offer · Ready to Dispatch</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 rounded hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Offer Letter Document Preview (White/Clean Paper Canvas) */}
        <div className="bg-white text-slate-900 rounded-lg p-6 sm:p-10 shadow-xl border border-slate-200 space-y-6 font-sans text-sm leading-relaxed">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                  H
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  {settings.companyName}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                {settings.companyAddress}
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="font-semibold text-slate-800">INTERNSHIP APPOINTMENT LETTER</p>
              <p className="mt-1">Date: {offer?.sentDate ? new Date(offer.sentDate).toLocaleDateString() : new Date().toLocaleDateString()}</p>
              <p className="font-mono text-[11px] text-slate-400 mt-0.5">REF: HLX-OFF-{candidate.id.toUpperCase()}</p>
            </div>
          </div>

          {/* Recipient Details */}
          <div>
            <p className="font-semibold text-slate-800">To,</p>
            <p className="font-bold text-slate-900 text-base">{candidate.fullName}</p>
            <p className="text-xs text-slate-600">{candidate.address}, {candidate.city}, {candidate.state} - {candidate.postalCode}</p>
            <p className="text-xs text-slate-600">{candidate.email} · {candidate.phone}</p>
          </div>

          {/* Letter Body */}
          <div className="space-y-3 text-xs sm:text-sm text-slate-700">
            <p>
              Dear <strong>{candidate.firstName}</strong>,
            </p>
            <p>
              On behalf of <strong>{settings.companyName}</strong>, we are pleased to offer you an appointment as an{' '}
              <strong>{candidate.position}</strong> within our <strong>{candidate.departmentName}</strong> team.
            </p>
            <p>
              During this period, you will be mentored by designated senior leads and will contribute to innovative, high-impact software engineering and product milestones.
            </p>
          </div>

          {/* Key Terms Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="bg-slate-50 px-4 py-2 font-semibold text-slate-800 border-b border-slate-200">
              Internship Specifics & Terms
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Role & Position:</span>
                  <span className="font-medium text-slate-800">{candidate.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-medium text-slate-800">{candidate.departmentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Joining Date:</span>
                  <span className="font-medium text-slate-800">{candidate.joiningDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-medium text-slate-800">{candidate.durationMonths} Months</span>
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Stipend:</span>
                  <span className="font-medium text-slate-800">{offer?.stipend || stipend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Working Hours:</span>
                  <span className="font-medium text-slate-800">9:30 AM - 6:30 PM (Mon-Fri)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Max Task Duration:</span>
                  <span className="font-medium text-slate-800">7 Days (Strict BR-005)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Leave Entitlement:</span>
                  <span className="font-medium text-slate-800">1 Casual + 1 Sick / Month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Policies Clause */}
          <div className="text-[11px] text-slate-500 space-y-1.5 border-t border-slate-200 pt-3">
            <p><strong>General Terms & Confidentiality:</strong></p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Candidate must upload valid identity and educational documents for HR verification prior to account onboarding.</li>
              <li>Attendance clock-in and daily work report submission upon clock-out are mandatory requirements.</li>
              <li>Excess leaves taken beyond entitlement shall automatically extend the internship duration by the exact excess days (BR-008).</li>
              <li>Repeated task failures trigger automated formal performance escalation letters leading up to termination.</li>
            </ol>
          </div>

          {/* Signatures Row */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200">
            {/* Company Signatory */}
            <div className="space-y-2">
              <div className="h-14 flex items-end">
                <span className="font-serif italic text-lg text-slate-800">
                  {settings.authorizedSignatory}
                </span>
              </div>
              <div className="border-t border-slate-300 pt-1 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">{settings.authorizedSignatory}</p>
                <p className="text-[11px] text-slate-500">{settings.signatoryTitle}</p>
                <p className="text-[10px] text-slate-400">{settings.companyName}</p>
              </div>
            </div>

            {/* Candidate Digital Signature */}
            <div className="space-y-2">
              <div className="h-14 flex items-end">
                {offer?.signatureDataUrl ? (
                  <img
                    src={offer.signatureDataUrl}
                    alt="Candidate Signature"
                    className="max-h-12 object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    [Awaiting Digital Acceptance]
                  </span>
                )}
              </div>
              <div className="border-t border-slate-300 pt-1 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">{candidate.fullName}</p>
                <p className="text-[11px] text-slate-500">Candidate Digital Acceptance</p>
                {offer?.acceptedDate && (
                  <p className="text-[10px] text-emerald-600 font-mono">
                    Signed: {new Date(offer.acceptedDate).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Signature Interactive Pad Modal Section */}
        {isSigning && (
          <div className="p-4 bg-slate-950 border border-black rounded-xl space-y-3">
            <h4 className="text-xs font-semibold text-black font-semibold flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Candidate E-Signature Terminal (BR-001)
            </h4>
            <p className="text-xs text-slate-400">
              By applying your signature, you legally accept the terms of the offer letter and proceed to document submission.
            </p>
            <SignaturePad
              candidateName={candidate.fullName}
              onSave={handleApplySignature}
              onCancel={() => setIsSigning(false)}
            />
          </div>
        )}

        {/* Bottom Actions based on Role & State */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Candidate ID: <span className="font-mono text-slate-200">{candidate.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isSent && !isAccepted && (
              <button
                type="button"
                onClick={handleSendOffer}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-black hover:bg-slate-800 text-white rounded-lg transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Offer to Candidate
              </button>
            )}

            {!isAccepted && isSent && !isSigning && (
              <button
                type="button"
                onClick={() => setIsSigning(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors shadow-sm"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Digitally Accept & Sign Offer (Candidate / Testing)
              </button>
            )}

            {isAccepted && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                <CheckCircle className="w-4 h-4" /> Offer Completed · Ready for Document Verification
              </span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
