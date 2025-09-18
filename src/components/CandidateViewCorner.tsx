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
      <div className="bg-card border rounded-lg p-4 h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm text-center">
          Hover a candidate point to view details
        </p>
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
    <div className="bg-card border rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">{candidate.name}</h3>
          <p className="text-sm text-muted-foreground italic">{candidate.current_job_title}</p>
          <p className="text-sm text-muted-foreground font-bold">{candidate.current_company}</p>
        </div>
        {candidate.photo_url && (
          <img 
            src={candidate.photo_url} 
            alt={`${candidate.name} profile`}
            className="w-12 h-12 rounded-full object-cover border-2 border-border"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Job Fitting Score:</span>
          <span className="text-lg font-bold text-primary">{candidate.fitting_score}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Experience:</span>
          <span className="text-sm font-medium">{candidate.years_experience} years</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Qualification:</span>
          <Badge className={`text-xs ${getQualificationColor(candidate.qualification)}`}>
            {candidate.qualification}
          </Badge>
        </div>
      </div>

      {skills.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Key Skills:</p>
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 6).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 6 && (
              <Badge variant="secondary" className="text-xs">
                +{skills.length - 6} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {truncatedSnippet && (
        <div>
          <p className="text-sm text-muted-foreground mb-1">Snippet:</p>
          <p className="text-xs text-foreground leading-relaxed font-bold">{truncatedSnippet}</p>
        </div>
      )}

      {candidate.linkedin_url && (
        <a
          href={candidate.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          View LinkedIn Profile
        </a>
      )}
    </div>
  );
};
