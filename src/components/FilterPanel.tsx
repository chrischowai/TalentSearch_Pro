// FilterPanel.tsx
import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface FilterPanelProps {
  fittingScoreRange: [number, number];
  qualification: string;
  keyword: string;
  onFittingScoreRangeChange: (value: [number, number]) => void;
  onQualificationChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
  dataMaxFittingScore: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  fittingScoreRange,
  qualification,
  keyword,
  onFittingScoreRangeChange,
  onQualificationChange,
  onKeywordChange,
  dataMaxFittingScore,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fitting Score Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Fitting Score
            </label>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
              {fittingScoreRange[0]}–{fittingScoreRange[1]}
            </span>
          </div>

          <SliderPrimitive.Root
            value={fittingScoreRange}
            onValueChange={(val) =>
              onFittingScoreRangeChange([val[0], val[1]])
            }
            min={0}
            max={dataMaxFittingScore}
            step={1}
            className="relative flex w-full select-none items-center"
            aria-label="Fitting Score range filter"
          >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
              <SliderPrimitive.Range className="absolute h-full bg-primary" />
            </SliderPrimitive.Track>

            {/* first thumb */}
            <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-white border-[2px] border-solid border-black relative z-15" />

            {/* second thumb */}
            <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-white border-[2px] border-solid border-black relative z-15" />
          </SliderPrimitive.Root>
        </div>

        {/* Qualification Filter */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
            Qualification Level
          </label>
          <Select value={qualification} onValueChange={onQualificationChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Qualifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Qualifications</SelectItem>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Master">Master</SelectItem>
              <SelectItem value="Degree">Degree</SelectItem>
              <SelectItem value="Below Degree">Below Degree</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Keyword Search */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Keyword Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search skills, companies, titles..."
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="pl-10"
              aria-label="Keyword search"
            />
          </div>
        </div>
      </div>

      {/* Quick Filter Stats */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/60">
        <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-transparent rounded-lg border border-blue-100/60">
          <div className="text-lg font-bold text-blue-600">
            {fittingScoreRange[1] - fittingScoreRange[0]}
          </div>
          <div className="text-[10px] text-slate-600 font-medium">Score Range</div>
        </div>
        <div className="text-center p-2 bg-gradient-to-br from-green-50 to-transparent rounded-lg border border-green-100/60">
          <div className="text-lg font-bold text-green-600">Active</div>
          <div className="text-[10px] text-slate-600 font-medium">Filter Status</div>
        </div>
        <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-transparent rounded-lg border border-purple-100/60">
          <div className="text-lg font-bold text-purple-600">Live</div>
          <div className="text-[10px] text-slate-600 font-medium">Results</div>
        </div>
      </div>
    </div>
  );
};
