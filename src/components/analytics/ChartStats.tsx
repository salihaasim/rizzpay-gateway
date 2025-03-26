
import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface ChartStatsProps {
  avgRevenue: number;
  peakPeriod: { name: string; transactions: number } | null;
  transactions: any[];
}

const ChartStats: React.FC<ChartStatsProps> = ({ 
  avgRevenue, 
  peakPeriod, 
  transactions 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
      <div className="bg-gradient-to-r from-muted/30 to-muted/10 p-3 rounded-md shadow-sm">
        <div className="text-xs text-muted-foreground">Avg. Revenue</div>
        <div className="text-lg font-semibold flex items-center gap-1">
          ₹{avgRevenue.toFixed(0)}
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-muted/30 to-muted/10 p-3 rounded-md shadow-sm">
        <div className="text-xs text-muted-foreground">Peak Period</div>
        <div className="text-lg font-semibold">
          {peakPeriod ? peakPeriod.name : 'N/A'}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-muted/30 to-muted/10 p-3 rounded-md shadow-sm">
        <div className="text-xs text-muted-foreground">Success Rate</div>
        <div className="text-lg font-semibold flex items-center gap-1">
          {transactions.length > 0 ? 
            Math.round((transactions.filter(t => t.status === 'successful' || t.status === 'settled').length / transactions.length) * 100) 
            : 0}%
          <ArrowUpRight className="h-4 w-4 text-emerald-500" />
        </div>
      </div>
    </div>
  );
};

export default ChartStats;
