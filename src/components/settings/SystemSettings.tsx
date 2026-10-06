import React, { useState } from 'react';
import { Settings, Save, CheckCircle, ShieldAlert, Building, Sliders, CalendarDays } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SystemSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [companyName, setCompanyName] = useState(settings.companyName);
  const [companyAddress, setCompanyAddress] = useState(settings.companyAddress);
  const [authorizedSignatory, setAuthorizedSignatory] = useState(settings.authorizedSignatory);
  const [signatoryTitle, setSignatoryTitle] = useState(settings.signatoryTitle);
  const [taskMaxDurationDays, setTaskMaxDurationDays] = useState(settings.taskMaxDurationDays);
  const [warningThreshold, setWarningThreshold] = useState(settings.warningThreshold);
  const [finalWarningThreshold, setFinalWarningThreshold] = useState(settings.finalWarningThreshold);
  const [terminationThreshold, setTerminationThreshold] = useState(settings.terminationThreshold);
  const [monthlyCasualLeave, setMonthlyCasualLeave] = useState(settings.monthlyCasualLeave);
  const [monthlySickLeave, setMonthlySickLeave] = useState(settings.monthlySickLeave);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName,
      companyAddress,
      authorizedSignatory,
      signatoryTitle,
      taskMaxDurationDays: Number(taskMaxDurationDays),
      warningThreshold: Number(warningThreshold),
      finalWarningThreshold: Number(finalWarningThreshold),
      terminationThreshold: Number(terminationThreshold),
      monthlyCasualLeave: Number(monthlyCasualLeave),
      monthlySickLeave: Number(monthlySickLeave),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            System Configuration & Disciplinary Thresholds (Section 54)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure legal entity details, business rule limits (BR-005, BR-008), and disciplinary escalation counters.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 text-xs font-medium">
            <CheckCircle className="w-4 h-4" /> Settings updated successfully
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Company & Signatory Entity */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-semibold uppercase tracking-wider text-xs">
            <Building className="w-4 h-4 text-black font-semibold" />
            <span>Company Legal Entity & Authorized Signatory</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Registered Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Registered Office Address</label>
              <input
                type="text"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Authorized Signatory Name</label>
              <input
                type="text"
                value={authorizedSignatory}
                onChange={(e) => setAuthorizedSignatory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Signatory Title / Designation</label>
              <input
                type="text"
                value={signatoryTitle}
                onChange={(e) => setSignatoryTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        </div>

        {/* Sprint & Task Constraints */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-semibold uppercase tracking-wider text-xs">
            <Sliders className="w-4 h-4 text-black font-semibold" />
            <span>Task Turnaround & Business Rule Thresholds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-medium">
                  Max Task Duration Days (BR-005: Strictly ≤ 7 Days)
                </label>
                <span className="font-mono text-black font-semibold font-bold">{taskMaxDurationDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={taskMaxDurationDays}
                onChange={(e) => setTaskMaxDurationDays(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                SRS Section 25: Individual tasks cannot exceed 7 days to guarantee fast mentor review cycles.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-slate-300 font-medium block">
                Monthly Leave Entitlement Policy
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400">Casual Leave / Month:</span>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={monthlyCasualLeave}
                    onChange={(e) => setMonthlyCasualLeave(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono mt-0.5"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Sick Leave / Month:</span>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={monthlySickLeave}
                    onChange={(e) => setMonthlySickLeave(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono mt-0.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Automated Performance Escalation Triggers */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-slate-200 font-semibold uppercase tracking-wider text-xs">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Automated Warning & Termination Escalation Thresholds (SRS Section 59)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1">
              <label className="text-amber-400 font-semibold block">Warning Letter Threshold</label>
              <p className="text-[11px] text-slate-400">Repeated task failures before official warning:</p>
              <input
                type="number"
                min="1"
                max="10"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
              />
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1">
              <label className="text-orange-400 font-semibold block">Final Warning Threshold</label>
              <p className="text-[11px] text-slate-400">Cumulative task failures before final warning:</p>
              <input
                type="number"
                min="2"
                max="15"
                value={finalWarningThreshold}
                onChange={(e) => setFinalWarningThreshold(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
              />
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1">
              <label className="text-rose-400 font-semibold block">Termination Threshold</label>
              <p className="text-[11px] text-slate-400">Cumulative task failures triggering termination:</p>
              <input
                type="number"
                min="3"
                max="20"
                value={terminationThreshold}
                onChange={(e) => setTerminationThreshold(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Save System Configurations
          </button>
        </div>
      </form>
    </div>
  );
};
