import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileCheck,
  Eye,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { Candidate, CandidateDocument } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface DocumentVerificationModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentVerificationModal: React.FC<DocumentVerificationModalProps> = ({
  candidate,
  isOpen,
  onClose,
}) => {
  const { verifyDocument, submitDocument, approveCandidate, currentUser } = useApp();
  const [selectedDoc, setSelectedDoc] = useState<CandidateDocument | null>(null);
  const [rejectRemark, setRejectRemark] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  if (!candidate) return null;

  const isHRorSuperAdmin = currentUser.role === 'hr_admin' || currentUser.role === 'super_admin';
  const mandatoryDocs = candidate.documents.filter((d) => d.isMandatory);
  const approvedMandatory = mandatoryDocs.filter((d) => d.status === 'approved').length;
  const allMandatoryApproved = approvedMandatory === mandatoryDocs.length;

  const handleSimulateUpload = (docId: string, docName: string) => {
    const ext = docName.toLowerCase().includes('photo') ? 'png' : 'pdf';
    const fakeFileName = `${candidate.firstName.toLowerCase()}_${docName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}`;
    const fakeFileSize = `${(Math.random() * 2 + 0.8).toFixed(1)} MB`;
    submitDocument(candidate.id, docId, fakeFileName, fakeFileSize);
  };

  const handleApprove = (docId: string) => {
    verifyDocument(candidate.id, docId, 'approve', 'Document verified successfully and authenticated against national records.');
    setIsRejecting(false);
  };

  const handleRejectConfirm = (docId: string) => {
    if (!rejectRemark.trim()) return;
    verifyDocument(candidate.id, docId, 'reject', rejectRemark);
    setRejectRemark('');
    setIsRejecting(false);
  };

  const handleApproveCandidate = () => {
    approveCandidate(candidate.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Document Verification · ${candidate.fullName}`}
      subtitle={`Country: ${candidate.country} (${candidate.nationality}) · ${candidate.documents.length} Configured Documents`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Verification Summary Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Mandatory Verification:</span>
              <span className="text-sm font-semibold text-slate-100">
                {approvedMandatory} / {mandatoryDocs.length} Approved
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Candidate cannot be approved until 100% of mandatory documents are verified by HR (BR-002).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {allMandatoryApproved ? (
              <button
                type="button"
                onClick={handleApproveCandidate}
                disabled={candidate.status === 'onboarding' || candidate.status === 'internship_active'}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Approve Candidate & Unlock Onboarding
              </button>
            ) : (
              <div className="text-xs text-amber-400 bg-amber-950/30 border border-amber-900/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Verification Incomplete
              </div>
            )}
          </div>
        </div>

        {/* Document Checklist Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {candidate.country === 'India' ? 'Indian Candidate Identity & Academic Checklist' : 'International Candidate Checklist'}
          </h4>

          <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            {candidate.documents.map((doc) => {
              const isApproved = doc.status === 'approved';
              const isUnderReview = doc.status === 'under_review';
              const isResubmit = doc.status === 'resubmission_required';
              const isNotSubmitted = doc.status === 'not_submitted';

              return (
                <div key={doc.id} className="p-4 hover:bg-slate-900/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-black font-semibold" />
                        <span className="text-xs font-semibold text-slate-200">
                          {doc.documentName}
                        </span>
                        {doc.isMandatory ? (
                          <span className="text-[10px] text-rose-400 font-medium">Mandatory</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Optional</span>
                        )}
                        <Badge status={doc.status} />
                      </div>

                      {doc.fileName ? (
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="font-mono text-slate-300">{doc.fileName}</span>
                          <span>·</span>
                          <span>{doc.fileSize}</span>
                          {doc.uploadedAt && (
                            <>
                              <span>·</span>
                              <span>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic">No document uploaded yet</p>
                      )}

                      {doc.rejectionReason && (
                        <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 p-2 rounded-lg mt-1 flex items-start gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <div>
                            <strong>HR Rejection Remark:</strong> {doc.rejectionReason}
                          </div>
                        </div>
                      )}

                      {doc.verifiedBy && (
                        <p className="text-[10px] text-emerald-400">
                          Verified by {doc.verifiedBy} on {new Date(doc.verifiedAt || '').toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Upload button for candidate / testing */}
                      {(isNotSubmitted || isResubmit) && (
                        <button
                          type="button"
                          onClick={() => handleSimulateUpload(doc.id, doc.documentName)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-black font-semibold border border-slate-300 hover:bg-slate-100 transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          Upload File
                        </button>
                      )}

                      {/* HR Verification Controls */}
                      {isHRorSuperAdmin && (isUnderReview || isResubmit) && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(doc.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDoc(doc);
                              setIsRejecting(true);
                              setRejectRemark('The uploaded document is unclear. Please upload a clearer copy.');
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject & Request Resubmission
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium px-2 py-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Validated
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rejection Remarks Form */}
        {isRejecting && selectedDoc && (
          <div className="p-4 bg-slate-950 border border-rose-500/30 rounded-xl space-y-3">
            <h4 className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              Document Rejection Remark for: {selectedDoc.documentName}
            </h4>
            <p className="text-xs text-slate-400">
              Provide actionable guidance explaining why the document was rejected (e.g. illegible copy, expired ID, missing signature).
            </p>
            <textarea
              rows={2}
              value={rejectRemark}
              onChange={(e) => setRejectRemark(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              placeholder="State reason for rejection..."
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRejecting(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRejectConfirm(selectedDoc.id)}
                className="px-3 py-1.5 text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-white rounded-lg transition-colors"
              >
                Submit Rejection & Notify Candidate
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
