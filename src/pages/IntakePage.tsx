
import React, { useState, useCallback } from 'react';
import { JobInfoForm } from '../components/JobInfoForm';
import { ScoringTable } from '../components/ScoringTable';
import { FileUpload } from '../components/FileUpload';
import { ActionButtons } from '../components/ActionButtons';
import { Toast } from '../components/Toast';
import { useScoringTable } from '../hooks/useScoringTable';
import { FileUpload as FileUploadType, SubmitState } from '../types';
import { isFormValid } from '../utils/validation';
import { submitIntakeForm } from '../utils/api';

const INITIAL_FILE_UPLOAD: FileUploadType = {
  file: null,
  fileName: null,
  mimeType: null,
  contentFormat: 'none',
  content: null
};

export const IntakePage: React.FC = () => {
  // Form state
  const [jobTitle, setJobTitle] = useState('');
  const [numberOfProfiles, setNumberOfProfiles] = useState('');
  const [batch, setBatch] = useState('');
  const [fileUpload, setFileUpload] = useState<FileUploadType>(INITIAL_FILE_UPLOAD);
  
  // Submit state
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  
  // Workflow completion state
  const [workflowCompleted, setWorkflowCompleted] = useState(false);
  const [workflowMessage, setWorkflowMessage] = useState<string>('');
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Scoring table
  const scoringTable = useScoringTable();

  // Form validation
  const canSubmit = isFormValid(jobTitle, numberOfProfiles, batch, scoringTable.rows) && 
                    scoringTable.totalStatus === 'valid';
  const canGenerateReport = true; // Always allow report generation
  
  // Handlers
  const handleSubmit = useCallback(async () => {
    if (!canSubmit || submitState !== 'idle') return;

    setSubmitState('submitting');
    setWorkflowMessage('Processing...');
    
    try {
      const formData = {
        jobTitle,
        numberOfProfiles: parseInt(numberOfProfiles, 10),
        batch: parseInt(batch, 10),
        scoringScheme: scoringTable.rows,
        jdDocument: fileUpload
      };

      setSubmitState('processing');
      const result = await submitIntakeForm(formData);
      
      console.log('Submission successful:', result);
      setSubmitState('finished');
      setWorkflowCompleted(true);
      setWorkflowMessage('Workflow completed! You could now start generating the Dashboard. OR You could visit the candidate database via this LINK:');
      
      // Show success toast
      setToast({
        message: result?.message || 'Submitted successfully!',
        type: 'success'
      });
      
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmitState('error');
      setWorkflowMessage('');
      
      // Show error toast
      setToast({
        message: 'Submission failed. Please try again.',
        type: 'error'
      });
    }
  }, [canSubmit, submitState, jobTitle, numberOfProfiles, batch, scoringTable.rows, fileUpload]);

  const handleGenerateReport = useCallback(() => {
    if (!canGenerateReport) return;
    
    // Navigate to dashboard - in a real app this would use router
     window.location.href = '/dashboard';
  }, []);

  const handleReset = useCallback(() => {
    const confirmed = window.confirm('Reset all inputs? This action cannot be undone.');
    
    if (confirmed) {
      setJobTitle('');
      setNumberOfProfiles('');
      setBatch('');
      setFileUpload(INITIAL_FILE_UPLOAD);
      setSubmitState('idle');
      setWorkflowCompleted(false);
      setWorkflowMessage('');
      setToast(null);
      scoringTable.resetRows();
    }
  }, [scoringTable]);

  const handleCloseToast = useCallback(() => {
    setToast(null);
  }, []);

  // Reset submit state when form data changes (for error state)
  React.useEffect(() => {
    if (submitState === 'error') {
      setSubmitState('idle');
    }
  }, [jobTitle, numberOfProfiles, batch, scoringTable.rows, fileUpload, submitState]);

  // Calculate step completion states
  const step1Complete = jobTitle.trim() !== '' && numberOfProfiles !== '' && batch !== '' &&
                        parseInt(numberOfProfiles) > 0 && parseInt(batch) > 0;
  const step2Complete = scoringTable.totalStatus === 'valid' && scoringTable.rows.length > 0;
  const step3Complete = fileUpload.file !== null;
  // Step 4 is automatically complete when steps 1, 2, and 3 are all complete OR form is submitted
  const step4Complete = (step1Complete && step2Complete && step3Complete) || submitState === 'finished';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Professional Header Bar */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-white py-1.5 shadow-sm">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-sm font-medium text-center opacity-95">
            Professional Talent Intelligence Platform
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Enhanced Header */}
        <header className="text-center mb-10">
          <div className="relative">
            {/* Decorative top accent */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
            
            <div className="bg-white border border-slate-200/60 rounded-2xl p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-5 shadow-lg shadow-primary/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-3">
                  LinkedIn Talent Search
                </h1>
                
                <p className="text-lg text-slate-600 font-medium mb-4">
                  Strategic Talent Acquisition & Intelligence Platform
                </p>
                
                <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>AI-Powered Scoring</span>
                  </div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span>Data-Driven Insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Form */}
        <main className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
          {/* Section Header */}
          <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Talent Search Configuration</h2>
                <p className="text-sm text-slate-500 mt-0.5">Define your search criteria and scoring parameters</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* Premium Process Timeline */}
            <div className="mb-10">
              <div className="relative max-w-5xl mx-auto">
                {/* Dynamic Background Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200"></div>
                <div 
                  className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-primary to-green-500 transition-all duration-500"
                  style={{ 
                    width: `${
                      step4Complete ? '100%' : 
                      step3Complete ? '75%' : 
                      step2Complete ? '50%' : 
                      step1Complete ? '25%' : '0%'
                    }` 
                  }}
                ></div>
                
                <div className="relative flex items-start justify-between">
                  {/* Step 1 - Job Details */}
                  <div className="flex flex-col items-center flex-1 relative group">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-xl border-4 border-white relative z-10 transition-all duration-300 group-hover:scale-110 ${
                        step1Complete 
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/40' 
                          : 'bg-gradient-to-br from-primary via-primary to-primary/90 text-white shadow-primary/40'
                      }`}>
                        {step1Complete ? (
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span>1</span>
                        )}
                      </div>
                      {!step1Complete && <div className="absolute -inset-1 rounded-2xl bg-primary/20 blur-md animate-pulse"></div>}
                    </div>
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-bold uppercase tracking-wide ${step1Complete ? 'text-green-600' : 'text-primary'}`}>Job Details</p>
                      <p className="text-xs text-slate-500 mt-0.5">{step1Complete ? '✓ Completed' : 'Define Parameters'}</p>
                    </div>
                  </div>
                  
                  {/* Step 2 - Scoring */}
                  <div className="flex flex-col items-center flex-1 relative group">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg border-4 border-white relative z-10 transition-all duration-300 group-hover:scale-110 ${
                        step2Complete 
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/40' 
                          : step1Complete
                          ? 'bg-gradient-to-br from-primary/30 to-primary/20 text-slate-700 hover:from-primary/40 hover:to-primary/30'
                          : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600'
                      }`}>
                        {step2Complete ? (
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span>2</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-bold uppercase tracking-wide ${step2Complete ? 'text-green-600' : step1Complete ? 'text-primary' : 'text-slate-600'}`}>Scoring</p>
                      <p className="text-xs text-slate-500 mt-0.5">{step2Complete ? '✓ Completed' : 'Set Criteria'}</p>
                    </div>
                  </div>
                  
                  {/* Step 3 - Upload */}
                  <div className="flex flex-col items-center flex-1 relative group">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg border-4 border-white relative z-10 transition-all duration-300 group-hover:scale-110 ${
                        step3Complete 
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/40' 
                          : step2Complete
                          ? 'bg-gradient-to-br from-primary/30 to-primary/20 text-slate-700 hover:from-primary/40 hover:to-primary/30'
                          : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600'
                      }`}>
                        {step3Complete ? (
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span>3</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-bold uppercase tracking-wide ${step3Complete ? 'text-green-600' : step2Complete ? 'text-primary' : 'text-slate-600'}`}>Upload</p>
                      <p className="text-xs text-slate-500 mt-0.5">{step3Complete ? '✓ Completed' : 'Job Description'}</p>
                    </div>
                  </div>
                  
                  {/* Step 4 - Ready to Submit */}
                  <div className="flex flex-col items-center flex-1 relative group">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg border-4 border-white relative z-10 transition-all duration-300 group-hover:scale-110 ${
                        step4Complete 
                          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/40' 
                          : step3Complete
                          ? 'bg-gradient-to-br from-primary/30 to-primary/20 text-slate-700 hover:from-primary/40 hover:to-primary/30'
                          : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600'
                      }`}>
                        {step4Complete ? (
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span>4</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <p className={`text-sm font-bold uppercase tracking-wide ${step4Complete ? 'text-green-600' : step3Complete ? 'text-primary' : 'text-slate-600'}`}>Ready to Submit</p>
                      <p className="text-xs text-slate-500 mt-0.5">{step4Complete ? '✓ Completed' : 'All Steps Required'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1: Job Information */}
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full"></div>
              <div className="mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Step 1: Job Information</h3>
                  <p className="text-sm text-slate-500">Define the role and search parameters</p>
                </div>
              </div>
              <JobInfoForm
                jobTitle={jobTitle}
                numberOfProfiles={numberOfProfiles}
                batch={batch}
                onJobTitleChange={setJobTitle}
                onNumberOfProfilesChange={setNumberOfProfiles}
                onBatchChange={setBatch}
              />
            </div>

            {/* Step 2: Scoring Configuration */}
            <div className="border-t border-slate-200/60 pt-8 relative">
              <div className="absolute -left-4 top-8 w-1 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full"></div>
              <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Step 2: Scoring Scheme Configuration</h3>
                  <p className="text-sm text-slate-500">Define weighted criteria for candidate evaluation (must total 100%)</p>
                </div>
              </div>
              <ScoringTable
                rows={scoringTable.rows}
                total={scoringTable.total}
                totalStatus={scoringTable.totalStatus}
                onAddRow={scoringTable.addRow}
                onDeleteRow={scoringTable.deleteRow}
                onUpdateRow={scoringTable.updateRow}
              />
            </div>

            {/* Step 3: Job Description Upload */}
            <div className="border-t border-slate-200/60 pt-8 relative">
              <div className="absolute -left-4 top-8 w-1 h-full bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full"></div>
              <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Step 3: Job Description Upload</h3>
                  <p className="text-sm text-slate-500">Upload the job description for reference and AI analysis</p>
                </div>
              </div>
              <FileUpload
                fileUpload={fileUpload}
                onFileSelect={setFileUpload}
                onFileRemove={() => setFileUpload(INITIAL_FILE_UPLOAD)}
              />
            </div>

            <div className="border-t border-slate-200/60 pt-6">
              <ActionButtons
                submitState={submitState}
                canSubmit={canSubmit}
                canGenerateReport={canGenerateReport}
                onSubmit={handleSubmit}
                onGenerateReport={handleGenerateReport}
                onReset={handleReset}
              />
              
              {/* Status Message Bar */}
              {workflowMessage && (
                <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center space-x-2">
                    {submitState === 'processing' && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    )}
                    {workflowCompleted && (
                      <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                        <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <p className="text-sm font-medium text-primary">
                      {workflowMessage}
                     {workflowMessage.includes('LINK:') && <a href="https://docs.google.com/spreadsheets/d/1_EEcJwL1AhfWXjdesahqi91zPKRvtsLDUOMbCOo-PhY/edit?pli=1&gid=1781793567#gid=1781793567" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                       "Click Here"
                         </a>}
                     </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Professional Footer */}
        <footer className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-full shadow-sm">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-slate-600">
              Powered by Advanced Talent Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            © 2024 LinkedIn Talent Search Platform. Professional Recruitment Solutions.
          </p>
        </footer>

        {/* Status Region for Screen Readers */}
        <div className="sr-only" role="status" aria-live="polite">
          {submitState === 'processing' && 'Form is being processed...'}
          {submitState === 'finished' && 'Form submitted successfully. You can now generate a dashboard.'}
          {submitState === 'error' && 'Form submission failed. Please check your inputs and try again.'}
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
};
