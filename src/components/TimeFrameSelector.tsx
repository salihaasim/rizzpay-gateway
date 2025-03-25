
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant={activeTimeFrame === 'day' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('day')}
        className="text-xs px-3"
      >
        Day
      </Button>
      <Button
        variant={activeTimeFrame === 'week' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('week')}
        className="text-xs px-3"
      >
        Week
      </Button>
      <Button
        variant={activeTimeFrame === 'month' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('month')}
        className="text-xs px-3"
      >
        Month
      </Button>
    </div>
  );
};

export default TimeFrameSelector;
