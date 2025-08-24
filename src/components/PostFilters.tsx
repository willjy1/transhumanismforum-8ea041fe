import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostFiltersProps {
  activeFilter: 'recent' | 'top' | 'hot' | 'new';
  onFilterChange: (filter: 'recent' | 'top' | 'hot' | 'new') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'created_at' | 'votes_score' | 'view_count';
  onSortChange: (sort: 'created_at' | 'votes_score' | 'view_count') => void;
}

const PostFilters: React.FC<PostFiltersProps> = ({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}) => {
  const filters = [
    { key: 'recent' as const, label: 'Recent' },
    { key: 'hot' as const, label: 'Hot' },
    { key: 'top' as const, label: 'Top' },
    { key: 'new' as const, label: 'New' },
  ];

  return (
    <div className="border-b bg-card">
      <div className="p-4 space-y-4">
        {/* Main Filter Tabs */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange(filter.key)}
              className={cn(
                "flex-1",
                activeFilter === filter.key 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Search and Advanced Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Newest</SelectItem>
              <SelectItem value="votes_score">Highest Karma</SelectItem>
              <SelectItem value="view_count">Most Views</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PostFilters;