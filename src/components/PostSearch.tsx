import React, { useState } from 'react';
import { Search, Filter, X, SortAsc, SortDesc, Calendar, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface PostSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  categories: Category[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  timeFilter: string;
  onTimeFilterChange: (filter: string) => void;
}

const PostSearch: React.FC<PostSearchProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  categories,
  selectedCategories,
  onCategoriesChange,
  timeFilter,
  onTimeFilterChange
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoriesChange([...selectedCategories, categoryId]);
    }
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onCategoriesChange([]);
    onTimeFilterChange('all');
    onSortChange('newest');
  };

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || timeFilter !== 'all' || sortBy !== 'newest';

  return (
    <div className="space-y-4">
      {/* Main search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts, discussions, and ideas..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSearchChange('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filter and sort controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Sort selector */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Newest
              </div>
            </SelectItem>
            <SelectItem value="oldest">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Oldest
              </div>
            </SelectItem>
            <SelectItem value="top">
              <div className="flex items-center gap-2">
                <SortDesc className="h-3 w-3" />
                Top Rated
              </div>
            </SelectItem>
            <SelectItem value="discussed">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Most Discussed
              </div>
            </SelectItem>
            <SelectItem value="views">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Most Viewed
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Time filter */}
        <Select value={timeFilter} onValueChange={onTimeFilterChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>

        {/* Category filter */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Categories
              {selectedCategories.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {selectedCategories.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="space-y-3">
              <div className="font-medium text-sm">Filter by Category</div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="rounded border-border"
                    />
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {(selectedCategories.length > 0 || searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchQuery}"
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearchChange('')}
                className="h-4 w-4 p-0 ml-1"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          
          {selectedCategories.map((categoryId) => {
            const category = categories.find(c => c.id === categoryId);
            if (!category) return null;
            
            return (
              <Badge 
                key={categoryId} 
                variant="secondary" 
                className="gap-1"
                style={{ 
                  borderColor: category.color + '40',
                  backgroundColor: category.color + '10'
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCategoryToggle(categoryId)}
                  className="h-4 w-4 p-0 ml-1"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PostSearch;