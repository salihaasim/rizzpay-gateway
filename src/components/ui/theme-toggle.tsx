
import React from 'react';
import { Sun } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  // Static light mode implementation
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            aria-label="Light mode"
            disabled
          >
            <Sun className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Light mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
