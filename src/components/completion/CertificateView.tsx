import React from 'react';
import { Award, Printer, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';
import { CompletionCertificate } from '../../types';
import { Modal } from '../common/Modal';

interface CertificateViewProps {
  certificate: CompletionCertificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  certificate,
  isOpen,
  onClose,
}) => {
  if (!certificate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Internship Completion Certificate (Section 36)"
      subtitle={`Certificate #${certificate.certificateNumber} · Candidate: ${certificate.candidateName}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Certificate Printable Canvas */}
        <div className="bg-white text-slate-900 rounded-xl p-8 sm:p-12 shadow-2xl border-8 border-slate-900 relative overflow-hidden font-serif">
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-10 h-10 border-t-2 border-l-2 border-amber-600" />
          <div className="absolute top-2 right-2 w-10 h-10 border-t-2 border-r-2 border-amber-600" />
          <div className="absolute bottom-2 left-2 w-10 h-10 border-b-2 border-l-2 border-amber-600" />
          <div className="absolute bottom-2 right-2 w-10 h-10 border-b-2 border-r-2 border-amber-600" />

          {/* Watermark / Logo */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-950 text-white font-bold flex items-center justify-center text-xl font-sans">
              H
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase font-sans">
              {certificate.companyName}
            </h1>
            <p className="text-xs text-amber-700 tracking-widest uppercase font-semibold font-sans">
              Certificate of Internship Completion
            </p>
          </div>

          <div className="text-center my-8 space-y-4 font-sans">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              This certificate is proudly awarded to
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-serif italic">
              {certificate.candidateName}
            </h2>
            <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto" />
            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
              in formal recognition of the successful completion of an internship as{' '}
              <strong>{certificate.position}</strong> in the{' '}
              <strong>{certificate.department}</strong> department, spanning{' '}
              <strong>{certificate.internshipDuration}</strong>.
            </p>
          </div>

          {/* Verification & Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-200 text-xs font-sans">
            {/* Left: Certificate Metadata */}
            <div className="space-y-1 text-slate-600">
              <p><strong>Certificate No:</strong> {certificate.certificateNumber}</p>
              <p><strong>Date of Issue:</strong> {certificate.issueDate}</p>
              <p><strong>Joining Date:</strong> {certificate.joiningDate}</p>
              <p><strong>Relieving Date:</strong> {certificate.relievingDate}</p>
            </div>

            {/* Center: Digital QR Authentication Stamp */}
            <div className="text-center space-y-1">
              <div className="w-20 h-20 mx-auto border-2 border-slate-900 p-1 rounded bg-slate-50 flex flex-col items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-900" />
                <span className="text-[7px] font-mono text-slate-600">VERIFIED</span>
              </div>
              <p className="font-mono text-[10px] text-slate-500 mt-1">
                {certificate.verificationCode}
              </p>
            </div>

            {/* Right: Authorized Signatory */}
            <div className="text-right space-y-1">
              <div className="h-10 flex items-end justify-end">
                <span className="font-serif italic text-lg text-slate-900">
                  {certificate.signatoryName}
                </span>
              </div>
              <div className="border-t border-slate-300 pt-1">
                <p className="font-bold text-slate-900">{certificate.signatoryName}</p>
                <p className="text-[11px] text-slate-600">{certificate.signatoryTitle}</p>
                <p className="text-[10px] text-slate-400">{certificate.companyName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-mono">
            Cryptographically authenticated by Heloix WorkHub Platform (BR-011)
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save Certificate
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
