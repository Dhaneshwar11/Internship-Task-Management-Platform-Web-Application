import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Clock,
  Calendar,
  User,
  Flag,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDetailModal } from './TaskDetailModal';

export const TaskManager: React.FC = () => {
  const { tasks, candidates, currentUser, settings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [internFilter, setInternFilter] = useState<string>('all');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const isIntern = currentUser.role === 'intern';

  const filteredTasks = tasks.filter((t) => {
    // If intern role, filter to their tasks by default
    if (isIntern && t.assignedInternId !== currentUser.id && currentUser.id !== 'cand-aarav') {
      return false;
    }

    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedInternName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesIntern = internFilter === 'all' || t.assignedInternId === internFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesIntern;
  });

  const pendingReviewCount = tasks.filter((t) => t.status === 'submitted').length;
  const approvedCount = tasks.filter((t) => t.status === 'approved').length;
  const changesCount = tasks.filter((t) => t.status === 'changes_requested').length;
  const approvalRate = tasks.length > 0 ? Math.round((approvedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Sprint & Task Operations (BR-005: Max 7 Days)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mentor work assignments, daily deliverables, multi-round review loops, and performance tracking.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Assign Task
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Total Tasks</span>
          <p className="text-2xl font-bold text-slate-100 font-mono mt-1">{tasks.length}</p>
          <span className="text-[10px] text-slate-500">Across all active interns</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Pending Review</span>
          <p className="text-2xl font-bold text-black font-semibold font-mono mt-1">{pendingReviewCount}</p>
          <span className="text-[10px] text-black font-semibold/80">Awaiting mentor evaluation</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Changes Requested</span>
          <p className="text-2xl font-bold text-amber-400 font-mono mt-1">{changesCount}</p>
          <span className="text-[10px] text-amber-400/80">Revision cycles active</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Approval Rate</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">{approvalRate}%</p>
          <span className="text-[10px] text-emerald-400/80">{approvedCount} approved deliverables</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tasks, deliverables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="all">All Task Statuses</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="submitted">Submitted (Review Pending)</option>
            <option value="changes_requested">Changes Requested</option>
            <option value="approved">Approved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={internFilter}
            onChange={(e) => setInternFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="all">All Assigned Interns</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => {
              setActiveTask(task);
              setIsDetailOpen(true);
            }}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge status={task.status} />
                <Badge status={task.priority} />
              </div>

              {/* Title & Description */}
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-black font-semibold transition-colors line-clamp-2">
                {task.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {task.description}
              </p>

              {/* Deliverable highlight */}
              <div className="mt-3 p-2 rounded bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300">
                <span className="text-slate-500 block">Target Deliverable:</span>
                <span className="truncate block font-mono text-slate-800 font-medium">{task.expectedDeliverable}</span>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Intern:</span>
                <span className="text-slate-200 font-medium">{task.assignedInternName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-mono text-slate-200">{task.durationDays} Days (Max 7)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Due Date:</span>
                <span className="font-mono text-black font-semibold">{task.dueDate}</span>
              </div>

              {task.rejectionCount > 0 && (
                <div className="flex items-center justify-between text-[11px] text-rose-400 pt-1 border-t border-slate-800/60 font-medium">
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Rejection Cycles:
                  </span>
                  <span>{task.rejectionCount} / {settings.warningThreshold} Threshold</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <CreateTaskModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      <TaskDetailModal
        task={activeTask}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};
