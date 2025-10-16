// DashboardPage.tsx
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

  // Fitting Score filter state (0–100)
  const [fittingScoreRange, setFittingScoreRange] = useState<[number, number]>([0, 100]);
  const [qualification, setQualification] = useState('All');
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // Hover state
  const [hoveredCandidate, setHoveredCandidate] = useState<CandidateData | null>(null);

  // Debounce keyword search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return allCandidates.filter(candidate => {
      // Fitting Score filter
      if (
        candidate.fitting_score < fittingScoreRange[0] ||
        candidate.fitting_score > fittingScoreRange[1]
      ) {
        return false;
      }

      // Qualification filter
      if (qualification !== 'All' && candidate.qualification !== qualification) {
        return false;
      }

      // Keyword filter
      if (debouncedKeyword) {
        const searchText = debouncedKeyword.toLowerCase();
        const candidateText = [
          candidate.name,
          candidate.current_job_title,
          candidate.current_company,
          candidate.industry,
          candidate.key_skills,
          candidate.linkedin_snippet
        ]
          .join(' ')
          .toLowerCase();
        const keywords = searchText.split(' ').filter(k => k.trim());
        if (!keywords.every(k => candidateText.includes(k))) {
          return false;
        }
      }

      return true;
    });
  }, [allCandidates, fittingScoreRange, qualification, debouncedKeyword]);

  // Fixed slider max for fitting score
  const dataMaxFittingScore = 100;

  // Load candidate data
  useEffect(() => {
    const loadCandidateData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await GoogleSheetsService.fetchCandidateData();
        setAllCandidates(data);
        setFittingScoreRange([0, 100]);
      } catch (err) {
        setError('Failed to load candidate data');
        console.error('Error loading candidate data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCandidateData();
  }, []);

  // Clear hover if filtered out
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

  // Refresh data function
  const handleRefreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GoogleSheetsService.fetchCandidateData();
      setAllCandidates(data);
      setFittingScoreRange([0, 100]);
    } catch (err) {
      setError('Failed to refresh candidate data');
      console.error('Error refreshing candidate data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for filter changes
  const handleFittingScoreRangeChange = useCallback((value: [number, number]) => {
    setFittingScoreRange(value);
  }, []);
  const handleQualificationChange = useCallback((value: string) => {
    setQualification(value);
  }, []);
  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value);
  }, []);
  const handleCandidateHover = useCallback((candidate: CandidateData | null) => {
    setHoveredCandidate(candidate);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Loading Dashboard</h2>
          <p className="text-muted-foreground">Fetching candidate data from Google Sheets...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      {/* Professional Top Bar */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-white shadow-lg">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">
                    TalentSearch Pro Dashboard
                  </h1>
                  <p className="text-sm text-white/80 font-medium">
                    Advanced Analytics & Talent Intelligence
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  onClick={handleRefreshData}
                  disabled={loading}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm px-6 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-5 w-5 mr-3 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Data
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleGoBack} 
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm px-6 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <ArrowLeft className="h-5 w-5 mr-3" />
                  Back to Intake
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">Candidate Analysis</span>
        </div>

        {/* Professional Features Banner */}
        <div className="bg-gradient-to-r from-primary/5 via-blue-50/50 to-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">Real-Time Analytics</div>
                <div className="text-xs text-slate-600">Live data updates</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">Secure Platform</div>
                <div className="text-xs text-slate-600">Enterprise grade</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">AI-Powered</div>
                <div className="text-xs text-slate-600">Smart matching</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">Custom Reports</div>
                <div className="text-xs text-slate-600">Export ready</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
                  <h2 className="text-lg font-bold text-slate-800">Filter Candidates</h2>
                </div>
              </div>
              <div className="p-6">
                <FilterPanel
                  fittingScoreRange={fittingScoreRange}
                  qualification={qualification}
                  keyword={keyword}
                  onFittingScoreRangeChange={handleFittingScoreRangeChange}
                  onQualificationChange={handleQualificationChange}
                  onKeywordChange={handleKeywordChange}
                  dataMaxFittingScore={dataMaxFittingScore}
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
                  <h2 className="text-lg font-bold text-slate-800">Key Metrics</h2>
                </div>
              </div>
              <div className="p-6">
                <KeyMetrics candidates={filteredCandidates} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Candidate Distribution Analysis</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Interactive scatter plot visualization</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <CandidateScatterPlot
                  data={filteredCandidates}
                  loading={false}
                  onCandidateHover={handleCandidateHover}
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden sticky top-6">
              <CandidateViewCorner candidate={hoveredCandidate} />
            </div>
          </div>
        </div>

        {/* Candidate Summary Table */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Candidate Summary Table</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Ranked by fitting score and qualifications</p>
                </div>
              </div>
            </div>
            <TopCandidatesTable
              candidates={filteredCandidates}
              onCandidateHover={handleCandidateHover}
            />
          </div>
        </div>

        {/* No Results State */}
        {filteredCandidates.length === 0 && allCandidates.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                No candidates match current filters
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Try adjusting your filter criteria to see more results. You can also clear all filters to start fresh.
              </p>
              <Button
                onClick={() => {
                  setFittingScoreRange([0, dataMaxFittingScore]);
                  setQualification('All');
                  setKeyword('');
                }}
                className="bg-primary hover:bg-primary/90"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
