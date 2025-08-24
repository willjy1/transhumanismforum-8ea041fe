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
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-14 z-40">
      <div className="px-6 py-4">
        <div className="flex gap-1">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                activeFilter === filter.key 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
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