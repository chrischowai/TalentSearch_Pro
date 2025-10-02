import React from 'react';
import { Users, Target, Clock } from 'lucide-react';
import { CandidateData } from '../services/googleSheets';

interface KeyMetricsProps {
  candidates: CandidateData[];
}

export const KeyMetrics: React.FC<KeyMetricsProps> = ({ candidates }) => {
  const totalCandidates = candidates.length;
  const avgFittingScore = totalCandidates > 0 
    ? Math.round(candidates.reduce((sum, c) => sum + c.fitting_score, 0) / totalCandidates)
    : 0;
  const avgExperience = totalCandidates > 0 
    ? Math.round(candidates.reduce((sum, c) => sum + c.years_experience, 0) / totalCandidates)
    : 0;

  return (
    <div className="grid grid-cols-3 gap-2">
      {/* Total Candidates */}
      <div className="relative overflow-hidden text-center p-2 bg-gradient-to-br from-primary/10 via-primary/5 to-white border border-primary/20 rounded-lg hover:shadow-md transition-shadow">
        <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <div className="w-6 h-6 mx-auto mb-1 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/20">
            <Users className="h-3 w-3 text-white" />
          </div>
          <div className="text-lg font-bold text-slate-800">{totalCandidates}</div>
          <div className="text-[9px] text-slate-600 font-medium uppercase tracking-wide">Total Candidates</div>
        </div>
      </div>
      
      {/* Avg Fitting Score */}
      <div className="relative overflow-hidden text-center p-2 bg-gradient-to-br from-green-50 via-white to-transparent border border-green-200/60 rounded-lg hover:shadow-md transition-shadow">
        <div className="absolute top-1 right-1 flex items-end gap-0.5 h-5 opacity-30">
          <div className="w-0.5 bg-green-300 rounded-full" style={{ height: '40%' }}></div>
          <div className="w-0.5 bg-green-400 rounded-full" style={{ height: '60%' }}></div>
          <div className="w-0.5 bg-green-500 rounded-full" style={{ height: '80%' }}></div>
          <div className="w-0.5 bg-green-600 rounded-full" style={{ height: '100%' }}></div>
        </div>
        <div className="relative z-10">
          <div className="w-6 h-6 mx-auto mb-1 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md shadow-green-500/20">
            <Target className="h-3 w-3 text-white" />
          </div>
          <div className="text-lg font-bold text-slate-800">{avgFittingScore}<span className="text-xs text-slate-500">%</span></div>
          <div className="text-[9px] text-slate-600 font-medium uppercase tracking-wide">Avg Fitting Score</div>
        </div>
      </div>
      
      {/* Avg Experience */}
      <div className="relative overflow-hidden text-center p-2 bg-gradient-to-br from-blue-50 via-white to-transparent border border-blue-200/60 rounded-lg hover:shadow-md transition-shadow">
        <div className="absolute top-1 right-1 w-6 h-6 opacity-20">
          <svg className="transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3"></circle>
            <circle 
              cx="18" 
              cy="18" 
              r="16" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="3"
              strokeDasharray={`${(avgExperience / 30) * 100}, 100`}
              strokeLinecap="round"
            ></circle>
          </svg>
        </div>
        <div className="relative z-10">
          <div className="w-6 h-6 mx-auto mb-1 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Clock className="h-3 w-3 text-white" />
          </div>
          <div className="text-lg font-bold text-slate-800">{avgExperience}<span className="text-xs text-slate-500">y</span></div>
          <div className="text-[9px] text-slate-600 font-medium uppercase tracking-wide">Avg Experience</div>
        </div>
      </div>
    </div>
  );
};