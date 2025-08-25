import React from 'react';
import { Check, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface CategoryMultiSelectProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onSelectionChange: (categoryIds: string[]) => void;
  label?: string;
}

export const CategoryMultiSelect: React.FC<CategoryMultiSelectProps> = ({
  categories,
  selectedCategoryIds,
  onSelectionChange,
  label = "Categories"
}) => {
  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedCategoryIds, categoryId]);
    } else {
      onSelectionChange(selectedCategoryIds.filter(id => id !== categoryId));
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    onSelectionChange(selectedCategoryIds.filter(id => id !== categoryId));
  };

  const selectedCategories = categories.filter(cat => selectedCategoryIds.includes(cat.id));

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Selected categories display */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => (
            <Badge
              key={category.id}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              {category.name}
              <button
                type="button"
                onClick={() => handleRemoveCategory(category.id)}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Category selection */}
      <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-md p-3">
        {categories.map((category) => {
          const isSelected = selectedCategoryIds.includes(category.id);
          return (
            <div key={category.id} className="flex items-start space-x-3">
              <Checkbox
                id={`category-${category.id}`}
                checked={isSelected}
                onCheckedChange={(checked) => 
                  handleCategoryToggle(category.id, checked as boolean)
                }
              />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </label>
                {category.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <p className="text-xs text-muted-foreground">
        Select multiple categories that best describe your post (optional)
      </p>
    </div>
  );
};