import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { CandidateScatterPlot } from '../components/CandidateScatterPlot';
import { FilterPanel } from '../components/FilterPanel';
import { KeyMetrics } from '../components/KeyMetrics';
import { CandidateViewCorner } from '../components/CandidateViewCorner';
import { TopCandidatesTable } from '../components/TopCandidatesTable';
import { GoogleSheetsService, CandidateData } from '../services/googleSheets';

export const DashboardPage: React.FC = () => {
  const [allCandidates, setAllCandidates] = useState<CandidateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [fittingScoreRange, setFittingScoreRange] = useState<[number, number]>([
    0,
    100,
  ]);
  const [qualification, setQualification] = useState('All');
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // Hover state
  const [hoveredCandidate, setHoveredCandidate] =
    useState<CandidateData | null>(null);

  // Debounce keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Filter logic
  const filteredCandidates = useMemo(() => {
    return allCandidates.filter((candidate) => {
      if (
        candidate.years_fittingScore < fittingScoreRange ||
        candidate.years_fittingScore > fittingScoreRange[18]
      )
        return false;
      if (qualification !== 'All' && candidate.qualification !== qualification)
        return false;
      if (debouncedKeyword) {
        const searchText = debouncedKeyword.toLowerCase();
        const candidateText = [
          candidate.name,
          candidate.current_job_title,
          candidate.current_company,
          candidate.industry,
          candidate.key_skills,
          candidate.linkedin_snippet,
        ]
          .join(' ')
          .toLowerCase();
        const keywords = searchText.split(' ').filter((k) => k.trim());
        if (!keywords.every((kw) => candidateText.includes(kw)))
          return false;
      }
      return true;
    });
  }, [allCandidates, fittingScoreRange, qualification, debouncedKeyword]);

  const dataMaxfittingScore = useMemo(() => {
    return Math.max(...allCandidates.map((c) => c.years_fittingScore), 100);
  }, [allCandidates]);

  // Load data
  useEffect(() => {
    const loadCandidateData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await GoogleSheetsService.fetchCandidateData();
        setAllCandidates(data);

        const maxScore = Math.max(
          ...data.map((c) => c.years_fittingScore),
          100
        );
        setFittingScoreRange([0, Math.min(100, maxScore)]);
      } catch (err) {
        setError('Failed to load candidate data');
        console.error('Error loading candidate data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCandidateData();
  }, []);

  useEffect(() => {
    if (hoveredCandidate && !filteredCandidates.includes(hoveredCandidate)) {
      setHoveredCandidate(null);
    }
  }, [filteredCandidates, hoveredCandidate]);

  const handleGoBack = () => {
    window.location.href = '/';
  };

  const handleRetry = () => {
    window.location.reload();
  };

  // Handlers
  const handleFittingScoreRangeChange = useCallback(
    (value: [number, number]) => {
      setFittingScoreRange(value);
    },
    []
  );

  const handleQualificationChange = useCallback((value: string) => {
    setQualification(value);
  }, []);

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value);
  }, []);

  const handleCandidateHover = useCallback(
    (candidate: CandidateData | null) => {
      setHoveredCandidate(candidate);
    },
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Loading Dashboard</h2>
          <p className="text-muted-foreground">
            Fetching candidate data from Google Sheets...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRetry} variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button onClick={handleGoBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Intake
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-6">
          <Button variant="outline" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Intake
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            LinkedIn Candidate Insights Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Analyze and filter candidate data with interactive visualizations
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <FilterPanel
              fittingScoreRange={fittingScoreRange}
              qualification={qualification}
              keyword={keyword}
              onFittingScoreRangeChange={handleFittingScoreRangeChange}
              onQualificationChange={handleQualificationChange}
              onKeywordChange={handleKeywordChange}
              dataMaxfittingScore={dataMaxfittingScore}
            />
          </div>
          <div className="lg:col-span-1">
            <KeyMetrics candidates={filteredCandidates} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <div className="bg-card border rounded-lg p-6">
              <CandidateScatterPlot
                data={filteredCandidates}
                loading={false}
                onCandidateHover={handleCandidateHover}
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <CandidateViewCorner candidate={hoveredCandidate} />
          </div>
        </div>

        <div className="mb-6">
          <TopCandidatesTable
            candidates={filteredCandidates}
            onCandidateHover={handleCandidateHover}
          />
        </div>

        {filteredCandidates.length === 0 && allCandidates.length > 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No candidates match current filters
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filter criteria to see more results.
            </p>
            <Button
              onClick={() => {
                setFittingScoreRange([0, dataMaxfittingScore]);
                setQualification('All');
                setKeyword('');
              }}
              variant="outline"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
