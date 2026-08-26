import React from 'react';
import { CareerDomain, DemandLevel } from '../../types';
import { CareerFilterCriteria } from '../../services/careerService';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Search, RotateCcw, Filter } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export interface CareerFilterPanelProps {
  filterCriteria: CareerFilterCriteria;
  onFilterChange: (criteria: Partial<CareerFilterCriteria>) => void;
  onResetFilters: () => void;
  className?: string;
}

const domains: (CareerDomain | 'All')[] = [
  'All',
  'Technology',
  'Design',
  'Business',
  'Healthcare',
  'Engineering',
  'Finance',
  'Science',
  'Arts & Humanities'
];

const demandLevels: (DemandLevel | 'All')[] = ['All', 'Very High', 'High', 'Moderate', 'Steady'];

export const CareerFilterPanel: React.FC<CareerFilterPanelProps> = ({
  filterCriteria,
  onFilterChange,
  onResetFilters,
  className
}) => {
  return (
    <div className={className}>
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Filter Title & Reset */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-900">
              Filter Dimensions
            </h4>
          </div>
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Text Search */}
        <div>
          <Input
            label="Keyword or Skill"
            placeholder="Search AI, React, Figma, Python..."
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            value={filterCriteria.searchQuery || ''}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 tracking-wide uppercase block font-mono">
            Industry Domain
          </label>
          <div className="flex flex-wrap gap-1.5">
            {domains.map((dom) => {
              const isSelected = (filterCriteria.domain || 'All') === dom;
              return (
                <button
                  key={dom}
                  onClick={() => onFilterChange({ domain: dom })}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-indigo-600'
                  }`}
                >
                  {dom}
                </button>
              );
            })}
          </div>
        </div>

        {/* Demand Level */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 tracking-wide uppercase block font-mono">
            Market Demand
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {demandLevels.map((lvl) => {
              const isSelected = (filterCriteria.demand || 'All') === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => onFilterChange({ demand: lvl })}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border text-center transition-all cursor-pointer font-medium ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-indigo-600'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Salary Range Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 uppercase font-bold">Min Salary</span>
            <span className="text-slate-900 font-bold">
              {formatCurrency(filterCriteria.salaryMin || 50000)}/yr
            </span>
          </div>
          <input
            type="range"
            min="50000"
            max="250000"
            step="10000"
            value={filterCriteria.salaryMin || 50000}
            onChange={(e) => onFilterChange({ salaryMin: Number(e.target.value) })}
            className="w-full accent-indigo-600 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Sort By Select */}
        <div>
          <Select
            label="Sort Trajectories By"
            value={filterCriteria.sortBy || 'match'}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            options={[
              { value: 'match', label: 'Highest Passport Match %' },
              { value: 'salary-high', label: 'Compensation: High to Low' },
              { value: 'salary-low', label: 'Compensation: Low to High' },
              { value: 'demand', label: 'Market Demand & Growth' },
              { value: 'title', label: 'Alphabetical Title (A-Z)' }
            ]}
          />
        </div>
      </div>
    </div>
  );
};
