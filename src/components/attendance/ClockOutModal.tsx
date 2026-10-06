import React, { useState } from 'react';
import { Clock, FileText, CheckCircle, AlertCircle, Upload, Paperclip } from 'lucide-react';
import { DailyWorkReport } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface ClockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
}

export const ClockOutModal: React.FC<ClockOutModalProps> = ({
  isOpen,
  onClose,
  candidateId,
}) => {
  const { clockOut } = useApp();

  const [workCompleted, setWorkCompleted] = useState('');
  const [tasksWorkedOn, setTasksWorkedOn] = useState('TASK-101, TASK-103');
  const [workInProgress, setWorkInProgress] = useState('');
  const [problemsEncountered, setProblemsEncountered] = useState('None');
  const [timeSpentHours, setTimeSpentHours] = useState(8);
  const [comments, setComments] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workCompleted.trim()) {
      setErrorMessage('BR-007 Violation: Daily work completed summary is mandatory at clock-out.');
      return;
    }

    const report: DailyWorkReport = {
      workCompleted,
      tasksWorkedOn,
      workInProgress,
      problemsEncountered,
      timeSpentHours: Number(timeSpentHours),
      comments,
      attachments: ['daily_code_diff.png'],
    };

    clockOut(candidateId, report);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Attendance Clock-Out & Daily Work Report"
      subtitle="SRS Section 23 & BR-007: Interns must submit structured daily work logs upon clocking out."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Work Completed Today (Mandatory BR-007) *
          </label>
          <textarea
            rows={3}
            required
            value={workCompleted}
            onChange={(e) => setWorkCompleted(e.target.value)}
            placeholder="Detailed description of features implemented, bug fixes, research completed..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Tasks Worked On (IDs/Titles) *</label>
            <input
              type="text"
              required
              value={tasksWorkedOn}
              onChange={(e) => setTasksWorkedOn(e.target.value)}
              placeholder="e.g. TASK-101, TASK-102"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Total Hours Spent Today *</label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="16"
              required
              value={timeSpentHours}
              onChange={(e) => setTimeSpentHours(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Work in Progress (Next Steps for Tomorrow)</label>
          <input
            type="text"
            value={workInProgress}
            onChange={(e) => setWorkInProgress(e.target.value)}
            placeholder="What will you pick up next morning?"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Blockers or Problems Encountered</label>
          <input
            type="text"
            value={problemsEncountered}
            onChange={(e) => setProblemsEncountered(e.target.value)}
            placeholder="e.g. None, or dependencies blocked on mentor review"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Deliverable Proof / Screenshot Attachment</label>
          <div className="flex items-center gap-2 p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-slate-400">
            <Paperclip className="w-4 h-4 text-black font-semibold" />
            <span className="font-mono text-slate-300">daily_code_diff.png (1.2 MB) attached</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Submit Report & Confirm Clock-Out
          </button>
        </div>
      </form>
    </Modal>
  );
};
