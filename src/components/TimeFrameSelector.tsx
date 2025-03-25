
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Calendar,
  ClockIcon, 
  CalendarDays
} from 'lucide-react';

type TimeFrame = 'day' | 'week' | 'month';

interface TimeFrameSelectorProps {
  activeTimeFrame: TimeFrame;
  onChange: (timeFrame: TimeFrame) => void;
  className?: string;
}

const TimeFrameSelector = ({
  activeTimeFrame,
  onChange,
  className,
}: TimeFrameSelectorProps) => {
  return (
    <div className={cn("flex items-center space-x-1.5", className)}>
      <Button
        variant={activeTimeFrame === 'day' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('day')}
        className={cn(
          "text-xs h-8 px-2.5",
          activeTimeFrame === 'day' ? 'bg-primary text-primary-foreground' : ''
        )}
      >
        <ClockIcon className="h-3 w-3 mr-1" />
        Day
      </Button>
      <Button
        variant={activeTimeFrame === 'week' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('week')}
        className={cn(
          "text-xs h-8 px-2.5",
          activeTimeFrame === 'week' ? 'bg-primary text-primary-foreground' : ''
        )}
      >
        <Calendar className="h-3 w-3 mr-1" />
        Week
      </Button>
      <Button
        variant={activeTimeFrame === 'month' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('month')}
        className={cn(
          "text-xs h-8 px-2.5",
          activeTimeFrame === 'month' ? 'bg-primary text-primary-foreground' : ''
        )}
      >
        <CalendarDays className="h-3 w-3 mr-1" />
        Month
      </Button>
    </div>
  );
};

export default TimeFrameSelector;
