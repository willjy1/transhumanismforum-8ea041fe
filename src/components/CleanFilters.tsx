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
    <div className="border-b border-border bg-background sticky top-20 z-30">
      <div className="max-w-4xl mx-auto px-12 py-6">
        <div className="flex items-center gap-12">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={cn(
                "relative text-lg font-light pb-2 crisp-transition hover-lift",
                activeFilter === filter.key 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter.label}
              {activeFilter === filter.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CleanFilters;