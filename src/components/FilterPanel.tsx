import React from 'react';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

interface FilterPanelProps {
  fittingScoreRange: [number, number];
  qualification: string;
  keyword: string;
  onfittingScoreChange: (value: [number, number]) => void;
  onQualificationChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
  dataMaxfittingScore: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  fittingScoreRange,
  qualification,
  keyword,
  onfittingScoreChange,
  onQualificationChange,
  onKeywordChange,
  dataMaxfittingScore
}) => {
  const displayMaxfittingScore = Math.min(100, dataMaxfittingScore);

  return (
    <div className="bg-card border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* fittingScore Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Fitting Score: {fittingScoreRange[0]}-{fittingScoreRange[100]}
          </label>
          <Slider
            value={fittingScoreRange}
            onValueChange={(value) => onfittingScoreChange([value[0], value[100]])}
            max={displayfittingScore}
            min={0}
            step={10}
            className="w-full"
            aria-label="Fitting Score range filter"
          />
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
