
import React from 'react';
import { BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from '@/components/ui/card';
import TimeFrameSelector from '@/components/TimeFrameSelector';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type TimeFrame = 'day' | 'week' | 'month';

interface ChartHeaderProps {
  timeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
  onDownloadCSV: () => void;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ 
  timeFrame, 
  onTimeFrameChange, 
  onDownloadCSV 
}) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <div>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Revenue Overview
        </CardTitle>
        <CardDescription>Transaction volume over time</CardDescription>
      </div>
      <div className="flex items-center gap-2">
        <TimeFrameSelector 
          activeTimeFrame={timeFrame} 
          onChange={onTimeFrameChange} 
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onDownloadCSV}
                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Download CSV</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ChartHeader;
