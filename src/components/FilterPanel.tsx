import React from 'react';
import {
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from './ui/slider';
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
  const displayMax = Math.min(100, dataMaxFittingScore);

  return (
    <div className="bg-card border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fitting Score Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Fitting Score: {fittingScoreRange}-{fittingScoreRange[1]}%
          </label>
          <Slider
            value={fittingScoreRange}
            onValueChange={onFittingScoreRangeChange}
            min={0}
            max={displayMax}
            step={1}
            aria-label="Fitting Score range filter"
            className="relative flex items-center select-none touch-none"
          >
            <SliderTrack className="bg-muted h-2 flex-1 rounded-full">
              <SliderRange className="bg-purple-500 h-full rounded-full" />
            </SliderTrack>
            <SliderThumb className="block w-5 h-5 bg-white border-2 border-purple-500 rounded-full shadow" />
            <SliderThumb className="block w-5 h-5 bg-white border-2 border-purple-500 rounded-full shadow" />
          </Slider>
        </div>

        {/* Qualification Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Qualification
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
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
    </div>
);
};
