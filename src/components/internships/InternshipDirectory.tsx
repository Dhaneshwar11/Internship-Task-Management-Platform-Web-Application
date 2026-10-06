import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { CandidateDetailModal } from '../candidates/CandidateDetailModal';
import { Candidate } from '../../types';
import { UserAvatar } from '../common/UserAvatar';

export const InternshipDirectory: React.FC = () => {
  const { candidates, tasks, attendance, settings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.assignedMentorName && c.assignedMentorName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = selectedDept === 'all' || c.departmentId === selectedDept;
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Internship Directory (SRS Sections 18 & 19)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Active workspace directory, mentor pairings, relieving date schedules, and progress tracking.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by intern, role, mentor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="all">All Departments</option>
            {settings.departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="all">All Statuses</option>
            <option value="internship_active">Active Interns</option>
            <option value="internship_extended">Extended Internships</option>
            <option value="internship_completed">Completed & Certified</option>
            <option value="onboarding">In Onboarding</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="px-5 py-3">Intern Profile</th>
                <th className="px-5 py-3">Department & Role</th>
                <th className="px-5 py-3">Assigned Mentor</th>
                <th className="px-5 py-3">Tenure / Relieving</th>
                <th className="px-5 py-3">Extension (BR-008)</th>
                <th className="px-5 py-3">Task Velocity</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredCandidates.map((c) => {
                const candidateTasks = tasks.filter((t) => t.assignedInternId === c.id);
                const approvedTasks = candidateTasks.filter((t) => t.status === 'approved').length;

                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={c.fullName}
                          role="intern"
                          size="md"
                        />
                        <div>
                          <span className="font-semibold text-slate-100 block">{c.fullName}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{c.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-slate-200 block font-medium">{c.position}</span>
                      <span className="text-[11px] text-slate-400">{c.departmentName}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-300">
                      {c.assignedMentorName ? (
                        <span className="font-medium text-slate-200">{c.assignedMentorName}</span>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px]">
                      <span className="text-slate-400 block">Joined: {c.joiningDate}</span>
                      <span className="text-black font-semibold block font-medium">Relieving: {c.expectedRelievingDate}</span>
                    </td>
                    <td className="px-5 py-3 font-mono">
                      {c.extensionDays > 0 ? (
                        <span className="text-amber-400 font-semibold">+{c.extensionDays} Days</span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono">
                      <span className="text-emerald-400 font-semibold">{approvedTasks}</span>
                      <span className="text-slate-500">/{candidateTasks.length} Done</span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge status={c.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCandidate(c);
                          setIsDetailOpen(true);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Modal */}
      <CandidateDetailModal
        candidate={activeCandidate}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};
