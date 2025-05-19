
import React from 'react';
import { Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  // Static light mode implementation
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      aria-label="Light mode"
      disabled
    >
      <Sun className="h-5 w-5" />
    </Button>
  );
}
