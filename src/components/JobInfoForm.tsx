import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { validateJobTitle, validateNumberOfProfiles, validateBatch } from '../utils/validation';

interface JobInfoFormProps {
  jobTitle: string;
  numberOfProfiles: string;
  batch: string;
  onJobTitleChange: (value: string) => void;
  onNumberOfProfilesChange: (value: string) => void;
  onBatchChange: (value: string) => void;
}

export const JobInfoForm: React.FC<JobInfoFormProps> = ({
  jobTitle,
  numberOfProfiles,
  batch,
  onJobTitleChange,
  onNumberOfProfilesChange,
  onBatchChange
}) => {
  const jobTitleValid = validateJobTitle(jobTitle);
  const profilesValid = validateNumberOfProfiles(numberOfProfiles);
  const batchValid = validateBatch(batch);

  return (
    <section className="space-y-6">
      {/* Job Title - Premium Field */}
      <div className="space-y-3">
        <Label htmlFor="job-title" className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          Job Title
          <span className="text-xs text-red-500 font-normal normal-case">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <Input
            id="job-title"
            type="text"
            placeholder="e.g. Senior HR Manager, Data Scientist, Product Designer"
            value={jobTitle}
            onChange={(e) => onJobTitleChange(e.target.value)}
            className={`pl-12 h-12 border-slate-300 focus:border-primary focus:ring-primary/20 ${!jobTitleValid && jobTitle ? 'border-red-400 focus:border-red-500' : ''}`}
            aria-describedby={!jobTitleValid && jobTitle ? 'job-title-error' : undefined}
          />
        </div>
        {!jobTitleValid && jobTitle && (
          <p id="job-title-error" className="text-sm text-red-600 flex items-center gap-1.5" role="alert">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Job title is required
          </p>
        )}
      </div>

      {/* Search Parameters Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Number of Profiles */}
        <div className="space-y-3">
          <Label htmlFor="num-profiles" className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            Target Profiles
            <span className="text-xs text-red-500 font-normal normal-case">*</span>
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <Input
              id="num-profiles"
              type="number"
              min="1"
              placeholder="e.g. 50"
              value={numberOfProfiles}
              onChange={(e) => onNumberOfProfilesChange(e.target.value)}
              className={`pl-12 h-12 border-slate-300 focus:border-green-500 focus:ring-green-500/20 ${!profilesValid && numberOfProfiles ? 'border-red-400 focus:border-red-500' : ''}`}
              aria-describedby={!profilesValid && numberOfProfiles ? 'profiles-error' : undefined}
            />
          </div>
          {!profilesValid && numberOfProfiles && (
            <p id="profiles-error" className="text-sm text-red-600 flex items-center gap-1.5" role="alert">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Must be a positive number
            </p>
          )}
        </div>

        {/* Batch Number */}
        <div className="space-y-3">
          <Label htmlFor="batch" className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
            Batch Number
            <span className="text-xs text-red-500 font-normal normal-case">*</span>
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <Input
              id="batch"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 1"
              value={batch}
              onChange={(e) => onBatchChange(e.target.value)}
              className={`pl-12 h-12 border-slate-300 focus:border-purple-500 focus:ring-purple-500/20 ${!batchValid && batch ? 'border-red-400 focus:border-red-500' : ''}`}
              aria-describedby={!batchValid && batch ? 'batch-error' : undefined}
            />
          </div>
          {!batchValid && batch && (
            <p id="batch-error" className="text-sm text-red-600 flex items-center gap-1.5" role="alert">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Must be a positive integer
            </p>
          )}
        </div>
      </div>

      {/* Professional Info Box */}
      <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200/60 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">Search Configuration</p>
            <p className="text-xs text-blue-700 mt-0.5">Define your target role and the number of candidate profiles you want to analyze per batch.</p>
          </div>
        </div>
      </div>
    </section>
  );
};