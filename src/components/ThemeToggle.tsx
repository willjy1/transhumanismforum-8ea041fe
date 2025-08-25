import React from 'react';
import { Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-9 h-9 p-0 cursor-default"
      disabled
    >
      <Moon className="h-4 w-4" />
      <span className="sr-only">Dark theme active</span>
    </Button>
  );
};

export default ThemeToggle;