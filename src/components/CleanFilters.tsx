import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CleanFiltersProps {
  activeFilter: 'recent' | 'top' | 'hot' | 'new';
  onFilterChange: (filter: 'recent' | 'top' | 'hot' | 'new') => void;
}

const CleanFilters: React.FC<CleanFiltersProps> = ({
  activeFilter,
  onFilterChange
}) => {
  const filters = [
    { key: 'recent' as const, label: 'Recent' },
    { key: 'top' as const, label: 'Top' },
    { key: 'hot' as const, label: 'Hot' },
    { key: 'new' as const, label: 'New' },
  ];

  return (
    <div className="border-b bg-white">
      <div className="px-6 py-3">
        <div className="flex gap-6">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={cn(
                "text-sm font-medium pb-2 border-b-2 transition-colors",
                activeFilter === filter.key 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CleanFilters;