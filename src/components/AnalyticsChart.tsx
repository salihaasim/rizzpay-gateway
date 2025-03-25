
import React, { useMemo, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  ComposedChart,
  Legend,
  Bar,
  ReferenceLine
} from 'recharts';
import { format, subDays, isValid, startOfDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/stores/transactionStore';
import TimeFrameSelector from './TimeFrameSelector';
import { 
  Download,
  TrendingUp, 
  BarChart3,
  ArrowUpRight,
  InfoCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

type TimeFrame = 'day' | 'week' | 'month';

// Chart data generation
const generateTimeFrameData = (transactions: Transaction[], timeFrame: TimeFrame) => {
  const today = new Date();
  let interval: Date[] = [];
  let dateFormat = '';
  
  // Define intervals and formats based on time frame
  switch (timeFrame) {
    case 'day':
      interval = Array.from({ length: 24 }, (_, i) => {
        const date = new Date(today);
        date.setHours(i, 0, 0, 0);
        return date;
      });
      dateFormat = 'HH:mm';
      break;
    case 'week':
      interval = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
      dateFormat = 'EEE';
      break;
    case 'month':
      interval = Array.from({ length: 30 }, (_, i) => subDays(today, 29 - i));
      dateFormat = 'MMM dd';
      break;
  }
  
  // Initialize data with zero values
  const data = interval.map(date => ({
    name: isValid(date) ? format(date, dateFormat) : `Invalid Date`,
    revenue: 0,
    transactions: 0,
    timestamp: date.getTime(),
  }));
  
  // Populate with transaction data
  transactions.forEach(transaction => {
    const txDate = new Date(transaction.date);
    
    // Skip invalid dates
    if (!isValid(txDate)) {
      return;
    }
    
    const txTimestamp = txDate.getTime();
    
    // Skip failed transactions
    if (transaction.status === 'failed' || transaction.status === 'declined') {
      return;
    }
    
    // Find matching data entry based on time frame
    const dataEntry = data.find(entry => {
      if (!entry.timestamp) return false;
      
      const entryDate = new Date(entry.timestamp);
      if (!isValid(entryDate)) return false;
      
      if (timeFrame === 'day') {
        // Match by hour
        return txDate.getHours() === entryDate.getHours() &&
               txDate.getDate() === entryDate.getDate();
      } else {
        // Match by day for week and month - normalize to start of day to avoid time comparison issues
        const txStartOfDay = startOfDay(txDate).getTime();
        const entryStartOfDay = startOfDay(entryDate).getTime();
        return txStartOfDay === entryStartOfDay;
      }
    });
    
    if (dataEntry) {
      // Extract amount (remove currency symbol and convert to number)
      const amountStr = transaction.amount.replace(/[^0-9.-]+/g, '');
      const amount = parseFloat(amountStr);
      
      if (!isNaN(amount)) {
        dataEntry.revenue += amount;
        dataEntry.transactions += 1;
      }
    }
  });
  
  return data;
};

// Calculate average revenue per period
const calculateAverageRevenue = (data: any[]) => {
  if (data.length === 0) return 0;
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  return totalRevenue / data.length;
};

// Find peak transaction period
const findPeakTransactionPeriod = (data: any[]) => {
  if (data.length === 0) return null;
  return data.reduce((max, item) => 
    item.transactions > max.transactions ? item : max, data[0]);
};

interface AnalyticsChartProps {
  transactions: Transaction[];
  className?: string;
}

const AnalyticsChart = ({ transactions, className }: AnalyticsChartProps) => {
  const [timeFrame, setTimeFrame] = React.useState<TimeFrame>('week');
  const [chartType, setChartType] = useState<'composed' | 'area'>('composed');
  
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
    // Convert data to CSV
    const headers = 'Period,Revenue,Transactions\n';
    const csvContent = chartData.reduce((content, row) => {
      return content + `${row.name},${row.revenue},${row.transactions}\n`;
    }, headers);
    
    // Create download link
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
  
  const chartConfig = {
    revenue: {
      label: "Revenue",
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))"
      }
    },
    transactions: {
      label: "Transactions",
      theme: {
        light: "hsl(var(--secondary))",
        dark: "hsl(var(--secondary))"
      }
    },
    average: {
      label: "Average",
      theme: {
        light: "hsl(var(--destructive))",
        dark: "hsl(var(--destructive))"
      }
    }
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
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
              onChange={setTimeFrame} 
            />
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDownloadCSV}
                    className="h-8 w-8"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Download CSV</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
            <div className="bg-muted/20 p-3 rounded-md">
              <div className="text-xs text-muted-foreground">Avg. Revenue</div>
              <div className="text-lg font-semibold flex items-center gap-1">
                ₹{avgRevenue.toFixed(0)}
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
            
            <div className="bg-muted/20 p-3 rounded-md">
              <div className="text-xs text-muted-foreground">Peak Period</div>
              <div className="text-lg font-semibold">
                {peakPeriod ? peakPeriod.name : 'N/A'}
              </div>
            </div>
            
            <div className="bg-muted/20 p-3 rounded-md">
              <div className="text-xs text-muted-foreground">Success Rate</div>
              <div className="text-lg font-semibold flex items-center gap-1">
                {transactions.length > 0 ? 
                  Math.round((transactions.filter(t => t.status === 'successful' || t.status === 'settled').length / transactions.length) * 100) 
                  : 0}%
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-[300px] p-2">
          <ChartContainer 
            config={chartConfig}
            className="w-full [&_.recharts-cartesian-grid-horizontal_line]:stroke-border/30 [&_.recharts-cartesian-grid-vertical_line]:stroke-border/30"
          >
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                fontSize={12} 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                yAxisId="left"
                fontSize={12} 
                tickFormatter={(value) => `₹${value}`}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <ChartTooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-popover p-2 shadow-md">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground">
                              Period
                            </span>
                            <span className="font-medium">{label}</span>
                          </div>
                          {payload.map((entry) => (
                            <div key={entry.name} className="flex flex-col">
                              <span 
                                className="text-xs font-medium text-muted-foreground"
                                style={{ color: entry.color }}
                              >
                                {entry.name === 'revenue' ? 'Revenue' : 'Transactions'}
                              </span>
                              <span className="font-medium">
                                {entry.name === 'revenue' ? `₹${entry.value}` : entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                formatter={(value) => value === 'revenue' ? 'Revenue' : 'Transactions'}
              />
              <ReferenceLine 
                y={avgRevenue} 
                yAxisId="left" 
                label="Avg" 
                stroke="hsl(var(--destructive))"
                strokeDasharray="3 3"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="revenue"
                fill="url(#revenueGradient)"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
              <Bar
                yAxisId="right"
                dataKey="transactions"
                name="transactions"
                fill="hsl(var(--secondary))"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </ComposedChart>
          </ChartContainer>
        </div>
        
        <Separator className="my-1" />
        
        <div className="flex justify-between items-center px-6 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <InfoCircle className="h-3 w-3" />
            <span>Based on {transactions.length} transactions</span>
          </div>
          <div>
            Last updated: {format(new Date(), 'MMM dd, yyyy')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
