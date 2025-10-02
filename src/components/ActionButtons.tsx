
import React from 'react';
import { Button } from './ui/button';
import { Loader2, CheckCircle, RotateCcw, BarChart3, Send } from 'lucide-react';
import { SubmitState } from '../types';

interface ActionButtonsProps {
  submitState: SubmitState;
  canSubmit: boolean;
  canGenerateReport: boolean;
  onSubmit: () => void;
  onGenerateReport: () => void;
  onReset: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  submitState,
  canSubmit,
  canGenerateReport,
  onSubmit,
  onGenerateReport,
  onReset
}) => {
  const getSubmitButtonContent = () => {
    switch (submitState) {
      case 'submitting':
      case 'processing':
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        );
      case 'finished':
        return (
          <>
            <CheckCircle className="h-4 w-4" />
            Completed
          </>
        );
      default:
        return (
          <>
            <Send className="h-4 w-4" />
            Submit
          </>
        );
    }
  };

  const getSubmitButtonVariant = () => {
    switch (submitState) {
      case 'submitting':
      case 'processing':
        return 'submit-processing' as const;
      case 'finished':
        return 'submit-finished' as const;
      default:
        return canSubmit ? 'default' as const : 'submit-disabled' as const;
    }
  };

  const isSubmitDisabled = () => {
    return submitState === 'submitting' || 
           submitState === 'processing' || 
           submitState === 'finished' || 
           !canSubmit;
  };

  return (
    <section className="space-y-6 pt-6">
      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant={getSubmitButtonVariant()}
          disabled={isSubmitDisabled()}
          onClick={onSubmit}
          className="flex-1 h-14 text-base font-bold shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] relative overflow-hidden group"
          aria-describedby="submit-help"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <span className="relative z-10 flex items-center gap-2">
            {getSubmitButtonContent()}
          </span>
        </Button>

        <Button
          variant="success"
          onClick={onGenerateReport}
          disabled={!canGenerateReport}
          className="flex-1 h-14 text-base font-bold shadow-lg shadow-green-500/30 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 relative overflow-hidden group"
          aria-describedby="report-help"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <span className="relative z-10 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Generate Dashboard
          </span>
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center justify-between pt-6 border-t-2 border-slate-300">
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 px-5 py-4 rounded-r-lg shadow-sm">
          <svg className="w-7 h-7 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-lg font-bold text-amber-900">Important Notice</p>
            <p className="text-base font-semibold text-amber-800 mt-0.5">All fields marked with * are required to proceed</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={onReset}
          className="h-12 px-8 border-2 border-red-300 bg-red-50 text-red-700 hover:border-red-500 hover:bg-red-100 hover:text-red-800 font-bold text-base transition-all duration-200 shadow-md hover:shadow-lg"
          aria-label="Reset all form data"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Reset Form
        </Button>
      </div>

      {/* Screen reader help text */}
      <div className="sr-only">
        <div id="submit-help">
          {!canSubmit && submitState === 'idle' && 
            'Submit button is disabled. Please complete all required fields and ensure scoring total equals 100%.'
          }
        </div>
        <div id="report-help">
          {!canGenerateReport && 
            'Generate Dashboard button is disabled.'
          }
        </div>
      </div>
    </section>
  );
};
