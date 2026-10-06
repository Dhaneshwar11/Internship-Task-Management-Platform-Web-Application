import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Lock, Terminal, Clock, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuditTrail: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = selectedActionFilter === 'all' || log.action === selectedActionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              Audit Trail & Security Event Ledger
            </h2>
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-mono">
              <Lock className="w-3 h-3" /> Immutable (BR-015)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Section 49 & BR-015: Every status transition, document verification, task review, leave calculation, and warning issue is permanently logged.
          </p>
        </div>

        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `heloix_workhub_audit_logs_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium shadow-sm transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          Export JSON Ledger
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit trail by user, action, payload details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>Logged Events: <strong className="text-slate-200 font-mono">{filteredLogs.length}</strong></span>
            <span className="text-[11px] text-slate-500 font-mono">Retention: Indefinite</span>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-medium">
              <tr>
                <th className="px-4 py-3">Timestamp (UTC)</th>
                <th className="px-4 py-3">Actor & Role</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Details & Parameters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors text-[11px]">
                  <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-2.5 font-sans font-medium text-slate-200 whitespace-nowrap">
                    {log.userName}
                    <span className="text-slate-500 block text-[10px] font-mono">
                      {log.role}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-black font-semibold font-bold whitespace-nowrap">{log.action}</td>
                  <td className="px-4 py-2.5 text-purple-400 whitespace-nowrap">
                    {log.entity}
                    <span className="text-slate-500 block text-[10px] truncate max-w-[100px]">
                      {log.entityId}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{log.ipAddress}</td>
                  <td className="px-4 py-2.5 font-sans text-slate-300 leading-relaxed max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
