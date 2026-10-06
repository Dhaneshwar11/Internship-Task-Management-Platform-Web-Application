import React, { useState } from 'react';
import { CheckSquare, AlertCircle, Calendar, User, Clock, Flag, FileText } from 'lucide-react';
import { Task, TaskPriority } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const { candidates, availableUsers, createTask, settings, currentUser } = useApp();

  // Active interns who can receive tasks (Sections 24, 25)
  const activeInterns = candidates.filter(
    (c) => c.status === 'internship_active' || c.status === 'internship_extended'
  );
  const mentors = availableUsers.filter((u) => u.role === 'mentor' || u.role === 'dept_admin');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedInternId, setAssignedInternId] = useState(activeInterns[0]?.id || '');
  const [assignedMentorId, setAssignedMentorId] = useState(mentors[0]?.id || currentUser.id);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [durationDays, setDurationDays] = useState(3); // Strict max 7 days!
  const [instructions, setInstructions] = useState('');
  const [expectedDeliverable, setExpectedDeliverable] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const calculateDueDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (durationDays > settings.taskMaxDurationDays) {
      setErrorMessage(`BR-005 Constraint Violation: Task duration cannot exceed ${settings.taskMaxDurationDays} days!`);
      return;
    }

    const intern = activeInterns.find((c) => c.id === assignedInternId);
    const mentor = mentors.find((m) => m.id === assignedMentorId);

    if (!intern) {
      setErrorMessage('Please select an active intern.');
      return;
    }

    const startDate = new Date().toISOString().split('T')[0];
    const dueDate = calculateDueDate(durationDays);

    const result = createTask({
      title,
      description,
      departmentId: intern.departmentId,
      departmentName: intern.departmentName,
      assignedInternId: intern.id,
      assignedInternName: intern.fullName,
      assignedMentorId: mentor?.id || currentUser.id,
      assignedMentorName: mentor?.name || currentUser.name,
      priority,
      startDate,
      dueDate,
      durationDays,
      instructions,
      expectedDeliverable,
      status: 'assigned',
    });

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to create task');
      return;
    }

    // Reset and close
    setTitle('');
    setDescription('');
    setInstructions('');
    setExpectedDeliverable('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign New Task (BR-005 Max 7 Days)"
      subtitle="Configure sprint tasks, instructions, deliverables & turnaround criteria."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Develop PostgreSQL Query Optimization & Indexes"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Assign to Active Intern *</label>
              <select
                value={assignedInternId}
                onChange={(e) => setAssignedInternId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                {activeInterns.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.fullName} ({i.position})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Assigned Mentor *</label>
              <select
                value={assignedMentorId}
                onChange={(e) => setAssignedMentorId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                {mentors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.departmentName || 'Tech'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical (Blocking)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">
                  Duration (Days) · Max 7 Days (BR-005)
                </label>
                <span className="font-mono text-black font-semibold font-bold">{durationDays} Day(s)</span>
              </div>
              <input
                type="range"
                min="1"
                max={settings.taskMaxDurationDays}
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>1 Day (Daily)</span>
                <span>3 Days</span>
                <span>5 Days</span>
                <span className="text-rose-400 font-semibold">7 Days (Max)</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Description & Scope</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the task requirements..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Technical Instructions & Reference</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Branch naming conventions, required unit test coverage, API payload specs..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Expected Deliverable *</label>
            <input
              type="text"
              required
              value={expectedDeliverable}
              onChange={(e) => setExpectedDeliverable(e.target.value)}
              placeholder="e.g. GitHub Pull Request link with green CI/CD build & preview video"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
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
            className="px-5 py-2 text-xs font-semibold bg-black hover:bg-slate-800 text-white rounded-lg transition-colors shadow-sm"
          >
            Assign Task to Intern
          </button>
        </div>
      </form>
    </Modal>
  );
};
