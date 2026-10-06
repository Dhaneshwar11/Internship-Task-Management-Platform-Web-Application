import React from 'react';
import { Award, Printer, CheckCircle, FileText } from 'lucide-react';
import { CompletionCertificate } from '../../types';
import { Modal } from '../common/Modal';

interface LorViewProps {
  certificate: CompletionCertificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LorView: React.FC<LorViewProps> = ({ certificate, isOpen, onClose }) => {
  if (!certificate || !certificate.hasLor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Letter of Recommendation (Section 37)"
      subtitle={`Candidate: ${certificate.candidateName} · Position: ${certificate.position}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Letter Canvas */}
        <div className="bg-white text-slate-900 rounded-xl p-8 sm:p-12 shadow-xl border border-slate-200 space-y-6 font-sans text-xs leading-relaxed">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                  H
                </div>
                <h3 className="font-bold text-slate-900 text-base">{certificate.companyName}</h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Heloix Innovation Hub, Tech City, Bengaluru</p>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <p className="font-bold text-slate-800">LETTER OF RECOMMENDATION</p>
              <p>Date: {certificate.issueDate}</p>
              <p className="font-mono text-slate-400">REF: HLX-LOR-{certificate.certificateNumber}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-slate-800">TO WHOMSOEVER IT MAY CONCERN,</p>
          </div>

          <div className="space-y-3 text-slate-700 text-xs sm:text-sm">
            <p>
              It is our privilege to write this formal Letter of Recommendation for{' '}
              <strong>{certificate.candidateName}</strong>, who has successfully completed an intensive internship as{' '}
              <strong>{certificate.position}</strong> within our <strong>{certificate.department}</strong> division from{' '}
              <strong>{certificate.joiningDate}</strong> to <strong>{certificate.relievingDate}</strong>.
            </p>
            <p>
              During this tenure, {certificate.candidateName} exhibited exceptional aptitude, discipline, and a strong sense of engineering ownership. The candidate consistently delivered sprints within configured benchmarks, collaborated seamlessly with cross-functional teams, and demonstrated exemplary problem-solving skills.
            </p>
            {certificate.lorText && (
              <div className="p-4 bg-slate-50 border-l-4 border-black rounded-r-lg text-slate-800 italic">
                "{certificate.lorText}"
              </div>
            )}
            <p>
              We are confident that {certificate.candidateName} will be a valuable asset to any forward-looking organization or engineering team. We wish them all success in their future academic and professional endeavors.
            </p>
          </div>

          {/* Signatory */}
          <div className="pt-8 border-t border-slate-200">
            <div className="h-10 flex items-end">
              <span className="font-serif italic text-lg text-slate-900">
                {certificate.signatoryName}
              </span>
            </div>
            <p className="font-bold text-slate-900 mt-1">{certificate.signatoryName}</p>
            <p className="text-[11px] text-slate-600">{certificate.signatoryTitle}</p>
            <p className="text-[10px] text-slate-400">{certificate.companyName}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-mono">
            Issued under SRS Section 37 & BR-012
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save LOR
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
