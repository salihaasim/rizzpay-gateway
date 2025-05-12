
import React from 'react';
import { Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme } = useTheme();
  
  // This is now just a static icon with no toggle functionality
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
