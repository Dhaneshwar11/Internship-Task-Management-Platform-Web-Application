import React, { useState } from 'react';
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  CheckCircle,
  FileText,
  Laptop,
  Globe,
  Eye,
  Filter,
} from 'lucide-react';
import { AttendanceRecord, DailyWorkReport } from '../../types';
import { useApp } from '../../context/AppContext';
import { ClockOutModal } from './ClockOutModal';
import { Modal } from '../common/Modal';

export const AttendanceTracker: React.FC = () => {
  const { attendance, candidates, clockIn, currentUser } = useApp();

  const [isClockOutOpen, setIsClockOutOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DailyWorkReport | null>(null);
  const [selectedCandidateFilter, setSelectedCandidateFilter] = useState<string>('all');

  // Identify target candidate for the live punch in/out widget
  const targetCandidate = candidates.find((c) => c.id === currentUser.id) || candidates[0];
  const today = new Date().toISOString().split('T')[0];

  const todayRecord = attendance.find(
    (a) => a.candidateId === targetCandidate?.id && a.date === today
  );

  const isClockedIn = todayRecord && !todayRecord.clockOutTime;
  const isClockedOut = todayRecord && !!todayRecord.clockOutTime;

  const handleClockIn = () => {
    if (targetCandidate) {
      clockIn(targetCandidate.id);
    }
  };

  const filteredAttendance = attendance.filter((a) => {
    if (selectedCandidateFilter === 'all') return true;
    return a.candidateId === selectedCandidateFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Attendance & Daily Work Reporting (BR-006, BR-007)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time biometric/network clock-in and compulsory daily deliverable reporting at clock-out.
          </p>
        </div>

        {/* Filter for HR & Mentors */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Filter Intern:</span>
          <select
            value={selectedCandidateFilter}
            onChange={(e) => setSelectedCandidateFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="all">All Interns</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clock-In / Clock-Out Active Action Widget */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Clock className="w-4 h-4 text-black font-semibold" />
              <span>Shift Attendance Terminal · {targetCandidate?.fullName}</span>
            </div>
            <p className="text-xs text-slate-300">
              Today: <strong className="text-slate-100">{new Date().toDateString()}</strong>
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 font-mono">
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-400" /> IP: 103.212.144.18
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Laptop className="w-3 h-3 text-slate-400" /> Verified Device Session
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!todayRecord ? (
              <button
                type="button"
                onClick={handleClockIn}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                Clock In for Today
              </button>
            ) : isClockedIn ? (
              <div className="flex items-center gap-3">
                <div className="text-right text-xs">
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Currently Clocked In
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Since {todayRecord.clockInTime}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsClockOutOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs shadow-md transition-all active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  Clock Out & Submit Report (BR-007)
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>
                  Day Shift Completed · Clocked Out at {todayRecord.clockOutTime}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance History Records Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Verified Attendance & Work Log Ledger
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {filteredAttendance.length} Recorded Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="px-5 py-3">Intern Name</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Clock In</th>
                <th className="px-5 py-3">Clock Out</th>
                <th className="px-5 py-3">Time Spent</th>
                <th className="px-5 py-3">Network IP / Device</th>
                <th className="px-5 py-3 text-right">Daily Work Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-100">{rec.candidateName}</td>
                  <td className="px-5 py-3 font-mono text-slate-400">{rec.date}</td>
                  <td className="px-5 py-3 font-mono text-emerald-400">{rec.clockInTime}</td>
                  <td className="px-5 py-3 font-mono text-black font-semibold">
                    {rec.clockOutTime || <span className="text-amber-400 italic">Active Shift</span>}
                  </td>
                  <td className="px-5 py-3 font-mono">
                    {rec.dailyReport ? `${rec.dailyReport.timeSpentHours} hrs` : '-'}
                  </td>
                  <td className="px-5 py-3 text-[11px] text-slate-500 font-mono truncate max-w-xs">
                    {rec.ipAddress} · {rec.deviceInfo}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {rec.dailyReport ? (
                      <button
                        type="button"
                        onClick={() => setSelectedReport(rec.dailyReport!)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-black font-semibold hover:bg-slate-100 text-xs font-medium transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Report
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[11px] italic">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clock Out Modal */}
      {targetCandidate && (
        <ClockOutModal
          isOpen={isClockOutOpen}
          onClose={() => setIsClockOutOpen(false)}
          candidateId={targetCandidate.id}
        />
      )}

      {/* Daily Work Report Preview Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title="Daily Work Report Submission (BR-007)"
          subtitle={`Logged Hours: ${selectedReport.timeSpentHours} hrs · Tasks: ${selectedReport.tasksWorkedOn}`}
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
              <span className="text-slate-500 font-semibold block mb-1">Work Completed:</span>
              <p className="text-slate-100 leading-relaxed whitespace-pre-wrap">{selectedReport.workCompleted}</p>
            </div>

            {selectedReport.workInProgress && (
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                <span className="text-slate-500 font-semibold block mb-1">Work in Progress:</span>
                <p className="text-slate-200">{selectedReport.workInProgress}</p>
              </div>
            )}

            {selectedReport.problemsEncountered && (
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                <span className="text-slate-500 font-semibold block mb-1">Blockers / Problems:</span>
                <p className="text-amber-300">{selectedReport.problemsEncountered}</p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
              >
                Close Report
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
