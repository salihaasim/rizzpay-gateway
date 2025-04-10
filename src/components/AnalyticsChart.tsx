
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Transaction } from '@/stores/transactionStore';
import { cn } from '@/lib/utils';
import ChartHeader, { TimeFrame } from './analytics/ChartHeader';
import ChartStats from './analytics/ChartStats';
import RevenueChart from './analytics/RevenueChart';
import ChartFooter from './analytics/ChartFooter';
import { 
  generateTimeFrameData, 
  calculateAverageRevenue, 
  findPeakTransactionPeriod 
} from './analytics/chartUtils';

interface AnalyticsChartProps {
  transactions: Transaction[];
  className?: string;
}

const AnalyticsChart = ({ transactions, className }: AnalyticsChartProps) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('week');
  
  const chartData = useMemo(() => 
    generateTimeFrameData(transactions, timeFrame), 
    [transactions, timeFrame]
  );
  
  const avgRevenue = useMemo(() => 
    calculateAverageRevenue(chartData),
    [chartData]
  );
  
  const peakPeriod = useMemo(() => 
    findPeakTransactionPeriod(chartData),
    [chartData]
  );
  
  const handleDownloadCSV = () => {
    const headers = 'Period,Revenue,Transactions\n';
    const csvContent = chartData.reduce((content, row) => {
      return content + `${row.name},${row.revenue},${row.transactions}\n`;
    }, headers);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `revenue-report-${timeFrame}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card className={cn("overflow-hidden backdrop-blur-sm shadow-lg border-0 flex flex-col h-full", className)}>
      <CardHeader className="pb-1 bg-gradient-to-r from-background to-secondary/20 py-2 px-4">
        <ChartHeader 
          timeFrame={timeFrame}
          onTimeFrameChange={setTimeFrame}
          onDownloadCSV={handleDownloadCSV}
        />
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="px-4 py-1">
          <ChartStats 
            avgRevenue={avgRevenue}
            peakPeriod={peakPeriod}
            transactions={transactions}
          />
        </div>
        
        <div className="flex-1 h-[210px] min-h-0">
          <RevenueChart 
            chartData={chartData}
            avgRevenue={avgRevenue}
          />
        </div>
        
        <ChartFooter transactionCount={transactions.length} />
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
