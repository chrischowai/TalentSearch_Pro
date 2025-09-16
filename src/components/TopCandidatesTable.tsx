import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, ArrowUpDown } from 'lucide-react';
import { CandidateData } from '../services/googleSheets';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface TopCandidatesTableProps {
  candidates: CandidateData[];
  onCandidateHover?: (candidate: CandidateData | null) => void;
}

type SortField = 'name' | 'current_job_title' | 'current_company' | 'industry' | 'fitting_score' | 'years_experience' | 'qualification';
type SortDirection = 'asc' | 'desc';

export const TopCandidatesTable: React.FC<TopCandidatesTableProps> = ({ 
  candidates, 
  onCandidateHover 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('fitting_score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const candidatesPerPage = 10;

  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle numeric fields
      if (sortField === 'fitting_score' || sortField === 'years_experience') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else {
        // Handle string fields
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      
      // Tie breaker: always use name ascending
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }, [candidates, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedCandidates.length / candidatesPerPage);
  const startIndex = (currentPage - 1) * candidatesPerPage;
  const endIndex = startIndex + candidatesPerPage;
  const currentCandidates = sortedCandidates.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  };

  const getQualificationColor = (qualification: string) => {
    switch (qualification.toLowerCase()) {
      case 'doctor': return 'bg-red-100 text-red-800 border-red-200';
      case 'master': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'degree': return 'bg-green-100 text-green-800 border-green-200';
      case 'below degree': return 'bg-gray-100 text-black border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Reset to first page when candidates change (filters applied)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [candidates]);

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Top Candidates</h3>
        <div className="text-sm text-muted-foreground">
          Showing {candidates.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, candidates.length)} of {candidates.length} candidates
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 font-bold">Rank</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors font-bold"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Name
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors font-bold"
                onClick={() => handleSort('current_job_title')}
              >
                <div className="flex items-center gap-1">
                  Title
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors font-bold"
                onClick={() => handleSort('current_company')}
              >
                <div className="flex items-center gap-1">
                  Current Company
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors font-bold"
                onClick={() => handleSort('industry')}
              >
                <div className="flex items-center gap-1">
                  Industry
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors font-bold"
                onClick={() => handleSort('fitting_score')}
              >
                <div className="flex items-center gap-1">
                  Fitting Score
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors font-bold"
                onClick={() => handleSort('years_experience')}
              >
                <div className="flex items-center gap-1">
                  Experience
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50 transition-colors font-bold"
                onClick={() => handleSort('qualification')}
              >
                <div className="flex items-center gap-1">
                  Qualification
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-bold">LinkedIn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCandidates.map((candidate, index) => (
              <TableRow 
                key={`${candidate.name}-${index}`}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
                onMouseEnter={() => onCandidateHover?.(candidate)}
              >
                <TableCell className="font-medium">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell className="font-medium">
                  {candidate.name}
                </TableCell>
                <TableCell>
                  {candidate.current_job_title}
                </TableCell>
                <TableCell>
                  {candidate.current_company}
                </TableCell>
                <TableCell>
                  {candidate.industry}
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-primary">
                    {candidate.fitting_score}%
                  </span>
                </TableCell>
                <TableCell>
                  {candidate.years_experience} years
                </TableCell>
                <TableCell>
                  <Badge className={`text-xs ${getQualificationColor(candidate.qualification)}`}>
                    {candidate.qualification}
                  </Badge>
                </TableCell>
                <TableCell>
                  {candidate.linkedin_url ? (
                    <a
                      href={candidate.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                      LinkedIn
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};