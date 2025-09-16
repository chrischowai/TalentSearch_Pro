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
      <div className="space-y-2">
        <Label htmlFor="job-title" className="text-lg font-bold">
          Job Title
        </Label>
        <Input
          id="job-title"
          type="text"
          placeholder="e.g. HR Manager"
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
          className={`w-full ${!jobTitleValid && jobTitle ? 'border-destructive' : ''}`}
          aria-describedby={!jobTitleValid && jobTitle ? 'job-title-error' : undefined}
        />
        {!jobTitleValid && jobTitle && (
          <p id="job-title-error" className="text-sm text-destructive" role="alert">
            Job title is required
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="num-profiles" className="text-lg font-bold">
            Number of Profiles
          </Label>
          <Input
            id="num-profiles"
            type="number"
            min="1"
            placeholder="e.g. 50"
            value={numberOfProfiles}
            onChange={(e) => onNumberOfProfilesChange(e.target.value)}
            className={`w-full ${!profilesValid && numberOfProfiles ? 'border-destructive' : ''}`}
            aria-describedby={!profilesValid && numberOfProfiles ? 'profiles-error' : undefined}
          />
          {!profilesValid && numberOfProfiles && (
            <p id="profiles-error" className="text-sm text-destructive" role="alert">
              Must be a positive number
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="batch" className="text-lg font-bold">
            Batch
          </Label>
          <Input
            id="batch"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 1"
            value={batch}
            onChange={(e) => onBatchChange(e.target.value)}
            className={`w-full ${!batchValid && batch ? 'border-destructive' : ''}`}
            aria-describedby={!batchValid && batch ? 'batch-error' : undefined}
          />
          {!batchValid && batch && (
            <p id="batch-error" className="text-sm text-destructive" role="alert">
              Must be a positive integer
            </p>
          )}
        </div>
      </div>
    </section>
  );
};