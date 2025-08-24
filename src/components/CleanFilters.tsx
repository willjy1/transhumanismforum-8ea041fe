import React from 'react';
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
    <div className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-16 z-30">
      <div className="max-w-2xl mx-auto px-8 py-4">
        <div className="flex gap-8">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={cn(
                "text-sm font-light pb-2 border-b border-transparent transition-all duration-200",
                activeFilter === filter.key 
                  ? "text-foreground border-foreground" 
                  : "text-muted-foreground hover:text-foreground"
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