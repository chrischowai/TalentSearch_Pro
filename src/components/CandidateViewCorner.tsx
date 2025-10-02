import React from 'react';
import { ExternalLink } from 'lucide-react';
import { CandidateData } from '../services/googleSheets';
import { Badge } from './ui/badge';

interface CandidateViewCornerProps {
  candidate: CandidateData | null;
}

export const CandidateViewCorner: React.FC<CandidateViewCornerProps> = ({ candidate }) => {
  if (!candidate) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="bg-[#0A66C2] text-white px-6 py-4 rounded-lg text-center shadow-lg">
          <p className="text-sm font-medium">
            Hover a candidate point to view details
          </p>
        </div>
      </div>
    );
  }

   const getQualificationColor = (qualification: string) => {
    switch (qualification.toLowerCase()) {
      case 'doctor': return 'bg-red-500 text-white border-red-500';
      case 'master': return 'bg-yellow-500 text-black border-yellow-500';
      case 'degree': return 'bg-green-500 text-white border-green-500';
      case 'below degree': return 'bg-black text-white border-black';
      default: return 'bg-gray-500 text-white border-gray-500';
    }
     };
  
  const skills = candidate.key_skills ? candidate.key_skills.split(/[,;]/).map(s => s.trim()).filter(s => s) : [];
  const truncatedSnippet = candidate.linkedin_snippet && candidate.linkedin_snippet.length > 200 
    ? candidate.linkedin_snippet.substring(0, 200) + '...'
    : candidate.linkedin_snippet;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 p-4">
        <div className="flex items-center gap-3">
          {candidate.photo_url && (
            <img 
              src={candidate.photo_url} 
              alt={`${candidate.name} profile`}
              className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          )}
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg leading-tight">{candidate.name}</h3>
            <p className="text-sm text-white/90 font-medium mt-0.5">{candidate.current_job_title}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
          <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="text-sm text-white font-semibold">{candidate.current_company}</span>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 space-y-4">

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Fitting Score */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">Score</span>
          </div>
          <div className="text-2xl font-bold text-primary">{candidate.fitting_score}%</div>
        </div>

        {/* Experience */}
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200/60 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">Experience</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{candidate.years_experience}<span className="text-sm text-blue-400"> yrs</span></div>
        </div>
      </div>

      {/* Qualification Badge */}
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 mb-4">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Qualification</span>
        <Badge className={`text-xs font-bold ${getQualificationColor(candidate.qualification)}`}>
          {candidate.qualification}
        </Badge>
      </div>

      {/* Key Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Key Skills</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 6).map((skill, index) => (
              <Badge key={index} className="text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors">
                {skill}
              </Badge>
            ))}
            {skills.length > 6 && (
              <Badge className="text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                +{skills.length - 6} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* LinkedIn Snippet */}
      {truncatedSnippet && (
        <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">LinkedIn Snippet</p>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed italic">{truncatedSnippet}</p>
        </div>
      )}

      {/* View Profile Button */}
      {candidate.linkedin_url && (
        <a
          href={candidate.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-[#0A66C2] text-white hover:bg-[#004182] transition-all duration-200 text-sm font-bold shadow-md hover:shadow-lg"
        >
          <ExternalLink className="h-4 w-4" />
          View Full LinkedIn Profile
        </a>
      )}
      </div>
    </div>
  );
};
