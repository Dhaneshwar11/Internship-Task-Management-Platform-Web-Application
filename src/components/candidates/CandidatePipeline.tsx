import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  FileText,
  Shield,
  Briefcase,
  ChevronRight,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Candidate, CandidateStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { CandidateDetailModal } from './CandidateDetailModal';
import { OfferLetterModal } from './OfferLetterModal';
import { DocumentVerificationModal } from './DocumentVerificationModal';
import { Modal } from '../common/Modal';
import { UserAvatar } from '../common/UserAvatar';

export const CandidatePipeline: React.FC = () => {
  const { candidates, createCandidate, settings, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // Modals state
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [isNewCandidateOpen, setIsNewCandidateOpen] = useState(false);

  // New Candidate Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCountry, setNewCountry] = useState<'India' | 'International'>('India');
  const [newQualification, setNewQualification] = useState('B.Tech Computer Science');
  const [newDepartmentId, setNewDepartmentId] = useState('dept-dev');
  const [newPosition, setNewPosition] = useState('Frontend React Intern');
  const [newDuration, setNewDuration] = useState(3);
  const [newInternshipType, setNewInternshipType] = useState<'Full-time' | 'Part-time' | 'Remote'>('Full-time');
  const [newJoiningDate, setNewJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail) return;

    const dept = settings.departments.find((d) => d.id === newDepartmentId);
    createCandidate({
      fullName: newFullName,
      email: newEmail,
      phone: newPhone || '+91 98000 00000',
      country: newCountry,
      qualification: newQualification,
      departmentId: newDepartmentId,
      departmentName: dept?.name || 'Software Engineering',
      position: newPosition,
      internshipType: newInternshipType,
      durationMonths: newDuration,
      joiningDate: newJoiningDate,
    });

    setIsNewCandidateOpen(false);
    // Reset form
    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    const matchesDept = selectedDepartment === 'all' || c.departmentId === selectedDepartment;
    const matchesCountry = selectedCountry === 'all' || c.country === selectedCountry;
    return matchesSearch && matchesStatus && matchesDept && matchesCountry;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Candidate Lifecycle & Hiring Pipeline</h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete lifecycle: Hiring → Offer → Digital Acceptance → Document Collection → HR Verification → Onboarding → Internship Activation
          </p>
        </div>

        <button
          onClick={() => setIsNewCandidateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Create Candidate
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, email, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="all">All Lifecycle Statuses</option>
            <option value="offer_pending">Offer Pending</option>
            <option value="offer_sent">Offer Sent</option>
            <option value="documents_pending">Docs Pending</option>
            <option value="under_hr_verification">Under HR Verification</option>
            <option value="onboarding">Onboarding</option>
            <option value="internship_active">Active Intern</option>
            <option value="internship_extended">Extended</option>
            <option value="internship_completed">Completed</option>
            <option value="terminated">Terminated</option>
          </select>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="all">All Departments</option>
            {settings.departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          {/* Country Filter */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="all">All Geographies</option>
            <option value="India">Indian Candidates</option>
            <option value="International">Foreign Candidates</option>
          </select>
        </div>

        {/* Quick count indicator */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/60">
          <span>Showing {filteredCandidates.length} of {candidates.length} candidates</span>
          <span>BR-001 through BR-004 enforced</span>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCandidates.map((candidate) => {
          const approvedDocs = candidate.documents.filter((d) => d.status === 'approved').length;
          const totalDocs = candidate.documents.length;

          return (
            <div
              key={candidate.id}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={candidate.fullName}
                      role="candidate"
                      size="lg"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100 group-hover:text-black font-semibold transition-colors">
                        {candidate.fullName}
                      </h4>
                      <p className="text-[11px] text-slate-400">{candidate.position}</p>
                    </div>
                  </div>
                  <Badge status={candidate.status} />
                </div>

                {/* Key metadata */}
                <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/60 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="text-slate-200 font-medium">{candidate.departmentName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span className="text-slate-200">
                      {candidate.durationMonths} Mos ({candidate.internshipType})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Joining Date:</span>
                    <span className="text-slate-200 font-mono text-[11px]">{candidate.joiningDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Document Status:</span>
                    <span className="font-mono text-xs text-purple-400">
                      {approvedDocs}/{totalDocs} Verified
                    </span>
                  </div>

                  {candidate.status === 'onboarding' && (
                    <div className="pt-1">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-500">Onboarding Progress:</span>
                        <span className="text-black font-semibold font-bold">{candidate.onboardingProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-black"
                          style={{ width: `${candidate.onboardingProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {candidate.extensionDays > 0 && (
                    <div className="text-[11px] text-amber-400 bg-amber-950/20 p-1.5 rounded border border-amber-900/40">
                      Extended by +{candidate.extensionDays} days due to excess leave
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCandidate(candidate);
                    setIsDetailOpen(true);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Profile
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCandidate(candidate);
                      setIsOfferOpen(true);
                    }}
                    title="View / Sign Offer Letter"
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-black font-semibold transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveCandidate(candidate);
                      setIsDocOpen(true);
                    }}
                    title="Document Verification Checklist"
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-400 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail, Offer, and Doc Modals */}
      <CandidateDetailModal
        candidate={activeCandidate}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <OfferLetterModal
        candidate={activeCandidate}
        isOpen={isOfferOpen}
        onClose={() => setIsOfferOpen(false)}
      />

      <DocumentVerificationModal
        candidate={activeCandidate}
        isOpen={isDocOpen}
        onClose={() => setIsDocOpen(false)}
      />

      {/* New Candidate Creation Modal */}
      <Modal
        isOpen={isNewCandidateOpen}
        onClose={() => setIsNewCandidateOpen(false)}
        title="Create Candidate Profile"
        subtitle="Initiate candidate hiring record according to SRS Section 6."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="e.g. Aditi Sharma"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="aditi.sharma@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Country Checklist Target</label>
              <select
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value as 'India' | 'International')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value="India">India (Aadhaar, PAN, Marksheets)</option>
                <option value="International">International (Passport, National ID)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Department</label>
              <select
                value={newDepartmentId}
                onChange={(e) => setNewDepartmentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                {settings.departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Position / Role</label>
              <input
                type="text"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder="e.g. React Developer Intern"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Internship Type</label>
              <select
                value={newInternshipType}
                onChange={(e) => setNewInternshipType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value="Full-time">Full-time (In-Office)</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Duration (Months)</label>
              <select
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value={1}>1 Month</option>
                <option value={2}>2 Months</option>
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Joining Date</label>
              <input
                type="date"
                value={newJoiningDate}
                onChange={(e) => setNewJoiningDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Qualification</label>
              <input
                type="text"
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsNewCandidateOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-black hover:bg-slate-800 text-white rounded-lg transition-colors shadow-sm"
            >
              Save Candidate Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
