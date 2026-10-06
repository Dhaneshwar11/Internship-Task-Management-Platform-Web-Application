import React, { useState } from 'react';
import { Award, Star, CheckCircle, FileText, UserCheck } from 'lucide-react';
import { InternshipEvaluation } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  isOpen,
  onClose,
  candidateId,
}) => {
  const { candidates, submitInternshipEvaluation, currentUser } = useApp();
  const candidate = candidates.find((c) => c.id === candidateId) || candidates[0];

  const [taskCompletion, setTaskCompletion] = useState(5);
  const [workQuality, setWorkQuality] = useState(5);
  const [attendanceDiscipline, setAttendanceDiscipline] = useState(5);
  const [communication, setCommunication] = useState(4);
  const [technicalSkills, setTechnicalSkills] = useState(5);
  const [learningAbility, setLearningAbility] = useState(5);
  const [teamwork, setTeamwork] = useState(5);
  const [reliability, setReliability] = useState(5);

  const [overallPerformance, setOverallPerformance] = useState(
    'Demonstrated high diligence, proactive initiative, and delivered sprint deliverables consistently within the 7-day turnaround benchmark.'
  );
  const [mentorRecommendation, setMentorRecommendation] = useState<'completed' | 'not_completed'>('completed');
  const [issueLor, setIssueLor] = useState(true);
  const [lorStatement, setLorStatement] = useState(
    'The candidate displayed exceptional analytical maturity and ownership. We warmly endorse them for prospective software engineering positions.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate) return;

    submitInternshipEvaluation({
      candidateId: candidate.id,
      mentorId: currentUser.id,
      mentorName: currentUser.name,
      evaluationDate: new Date().toISOString().split('T')[0],
      scores: {
        taskCompletion,
        workQuality,
        attendanceDiscipline,
        communication,
        technicalSkills,
        learningAbility,
        teamwork,
        reliability,
      },
      overallPerformance,
      mentorRecommendation,
      issueLor,
      lorStatement: issueLor ? lorStatement : undefined,
    });

    onClose();
  };

  if (!candidate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Internship Evaluation · ${candidate.fullName}`}
      subtitle={`Position: ${candidate.position} · ${candidate.departmentName} (Section 34 & 35)`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
          <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
            Comprehensive Performance Criteria (1 to 5 Stars)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Task Completion Benchmark', val: taskCompletion, set: setTaskCompletion },
              { label: 'Work Quality & Accuracy', val: workQuality, set: setWorkQuality },
              { label: 'Attendance & Clock-In Discipline', val: attendanceDiscipline, set: setAttendanceDiscipline },
              { label: 'Communication & Standups', val: communication, set: setCommunication },
              { label: 'Technical & Engineering Skills', val: technicalSkills, set: setTechnicalSkills },
              { label: 'Learning Ability & Adaptability', val: learningAbility, set: setLearningAbility },
              { label: 'Teamwork & Collaboration', val: teamwork, set: setTeamwork },
              { label: 'Reliability & Ownership', val: reliability, set: setReliability },
            ].map((crit, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-300 text-[11px]">{crit.label}</span>
                <select
                  value={crit.val}
                  onChange={(e) => crit.set(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-700 text-xs rounded px-2 py-0.5 text-black font-semibold font-mono"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={3}>3 - Good</option>
                  <option value={2}>2 - Marginal</option>
                  <option value={1}>1 - Unsatisfactory</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Overall Mentor Qualitative Evaluation *</label>
          <textarea
            rows={2}
            required
            value={overallPerformance}
            onChange={(e) => setOverallPerformance(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Mentor Recommendation (Section 35) */}
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
          <label className="block text-slate-300 font-semibold text-xs">
            Mentor Final Recommendation (Section 35)
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200">
              <input
                type="radio"
                name="recommendation"
                checked={mentorRecommendation === 'completed'}
                onChange={() => setMentorRecommendation('completed')}
                className="accent-emerald-500"
              />
              <span>Successfully Completed Internship</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-200">
              <input
                type="radio"
                name="recommendation"
                checked={mentorRecommendation === 'not_completed'}
                onChange={() => setMentorRecommendation('not_completed')}
                className="accent-rose-500"
              />
              <span>Not Successfully Completed</span>
            </label>
          </div>
        </div>

        {/* Section 37: Letter of Recommendation (LOR) Checkbox */}
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-black font-semibold">
            <input
              type="checkbox"
              checked={issueLor}
              onChange={(e) => setIssueLor(e.target.checked)}
              className="accent-sky-500 rounded"
            />
            <span>Issue Letter of Recommendation (LOR) per Section 37</span>
          </label>

          {issueLor && (
            <div className="pt-2">
              <label className="block text-slate-400 font-medium text-[11px] mb-1">
                Custom Recommendation Statement for LOR Certificate
              </label>
              <textarea
                rows={2}
                value={lorStatement}
                onChange={(e) => setLorStatement(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Submit Evaluation to HR for Sign-Off
          </button>
        </div>
      </form>
    </Modal>
  );
};
