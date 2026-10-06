import React, { useState } from 'react';
import {
  Award,
  CheckCircle,
  FileCheck,
  Star,
  Eye,
  FileText,
  UserCheck,
  Clock,
  Printer,
} from 'lucide-react';
import { InternshipEvaluation, CompletionCertificate } from '../../types';
import { useApp } from '../../context/AppContext';
import { EvaluationModal } from './EvaluationModal';
import { CertificateView } from './CertificateView';
import { LorView } from './LorView';
import { Badge } from '../common/Badge';
import { UserAvatar } from '../common/UserAvatar';

export const CompletionManager: React.FC = () => {
  const {
    candidates,
    evaluations,
    certificates,
    approveInternshipCompletion,
    currentUser,
  } = useApp();

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  const [isEvalOpen, setIsEvalOpen] = useState(false);

  const [activeCert, setActiveCert] = useState<CompletionCertificate | null>(null);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isLorOpen, setIsLorOpen] = useState(false);

  const isHRorSuperAdmin = currentUser.role === 'hr_admin' || currentUser.role === 'super_admin';
  const isMentor = currentUser.role === 'mentor' || isHRorSuperAdmin;

  const handleStartEvaluation = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setIsEvalOpen(true);
  };

  const handleHRApproveCompletion = (candidateId: string, evalId: string) => {
    approveInternshipCompletion(candidateId, evalId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Evaluation, Certification & Letter of Recommendation
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            End-of-internship mentor rubric, HR final completion authorization (BR-010), automated digital certification (BR-011), and LOR generation (BR-012).
          </p>
        </div>
      </div>

      {/* Interns Nearing / At Relieving Date */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Active Interns & Evaluation Eligibility
          </h3>
          <span className="text-xs text-slate-500">
            Rule: Evaluation permitted upon reaching expected relieving date
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {candidates
            .filter((c) => c.status === 'internship_active' || c.status === 'internship_extended' || c.status === 'internship_completed')
            .map((candidate) => {
              const existingEval = evaluations.find((e) => e.candidateId === candidate.id);
              const cert = certificates.find((c) => c.candidateId === candidate.id);
              const isCompleted = candidate.status === 'internship_completed';

              return (
                <div
                  key={candidate.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <UserAvatar
                      name={candidate.fullName}
                      role="candidate"
                      size="lg"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-100">{candidate.fullName}</h4>
                        <Badge status={candidate.status} />
                      </div>
                      <p className="text-xs text-slate-400">{candidate.position} · {candidate.departmentName}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 font-mono">
                        <span>Duration: {candidate.durationMonths} Mos</span>
                        <span>·</span>
                        <span>Joined: {candidate.joiningDate}</span>
                        <span>·</span>
                        <span className="text-black font-semibold">Relieving: {candidate.expectedRelievingDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* If no evaluation submitted yet, mentor can evaluate */}
                    {!existingEval && !isCompleted && isMentor && (
                      <button
                        type="button"
                        onClick={() => handleStartEvaluation(candidate.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
                      >
                        <Star className="w-3.5 h-3.5" />
                        Conduct Evaluation
                      </button>
                    )}

                    {/* If evaluation submitted, show status */}
                    {existingEval && !isCompleted && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-900/60 font-medium">
                          Evaluation Submitted · Awaiting HR Sign-Off
                        </span>
                        {isHRorSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => handleHRApproveCompletion(candidate.id, existingEval.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-sm transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            HR Approve & Issue Certificate (BR-010)
                          </button>
                        )}
                      </div>
                    )}

                    {/* If completed and certificate issued */}
                    {isCompleted && cert && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCert(cert);
                            setIsCertOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-medium transition-colors"
                        >
                          <Award className="w-3.5 h-3.5" />
                          View Certificate
                        </button>

                        {cert.hasLor && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCert(cert);
                              setIsLorOpen(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 font-medium border border-black hover:bg-black text-white/30 text-xs font-medium transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View LOR
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Issued Certificates Ledger */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Issued Completion Certificates & Recommendation Repository
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {certificates.length} Issued Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="px-5 py-3">Cert #</th>
                <th className="px-5 py-3">Recipient Candidate</th>
                <th className="px-5 py-3">Role & Dept</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Issue Date</th>
                <th className="px-5 py-3">Verification Hash</th>
                <th className="px-5 py-3">LOR Issued</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3 font-mono font-medium text-emerald-400">{cert.certificateNumber}</td>
                  <td className="px-5 py-3 font-semibold text-slate-100">{cert.candidateName}</td>
                  <td className="px-5 py-3 text-slate-400">{cert.position} ({cert.department})</td>
                  <td className="px-5 py-3">{cert.internshipDuration}</td>
                  <td className="px-5 py-3 font-mono text-slate-400">{cert.issueDate}</td>
                  <td className="px-5 py-3 font-mono text-[10px] text-slate-500">{cert.verificationCode}</td>
                  <td className="px-5 py-3">
                    {cert.hasLor ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-black border border-slate-300 font-semibold">
                        Yes (Included)
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Certificate Only</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCert(cert);
                          setIsCertOpen(true);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        Certificate
                      </button>
                      {cert.hasLor && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCert(cert);
                            setIsLorOpen(true);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-medium hover:bg-black text-white/30 text-xs font-medium transition-colors"
                        >
                          LOR
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evaluation Modal */}
      <EvaluationModal
        isOpen={isEvalOpen}
        onClose={() => setIsEvalOpen(false)}
        candidateId={selectedCandidateId}
      />

      {/* Certificate Viewer Modal */}
      <CertificateView
        certificate={activeCert}
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
      />

      {/* LOR Viewer Modal */}
      <LorView
        certificate={activeCert}
        isOpen={isLorOpen}
        onClose={() => setIsLorOpen(false)}
      />
    </div>
  );
};
