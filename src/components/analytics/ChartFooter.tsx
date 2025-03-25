
import React from 'react';
import { Info } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface ChartFooterProps {
  transactionCount: number;
}

const ChartFooter: React.FC<ChartFooterProps> = ({ transactionCount }) => {
  return (
    <>
      <Separator className="my-1" />
      <div className="flex justify-between items-center px-6 py-3 text-xs text-muted-foreground bg-gradient-to-r from-secondary/10 to-background">
        <div className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          <span>Based on {transactionCount} transactions</span>
        </div>
        <div>
          Last updated: {format(new Date(), 'MMM dd, yyyy')}
        </div>
      </div>
    </>
  );
};

export default ChartFooter;
