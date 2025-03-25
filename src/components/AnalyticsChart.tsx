
import React, { useMemo } from 'react';
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
  Bar
} from 'recharts';
import { format, subDays, isValid, startOfDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/stores/transactionStore';
import TimeFrameSelector from './TimeFrameSelector';

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

interface AnalyticsChartProps {
  transactions: Transaction[];
  className?: string;
}

const AnalyticsChart = ({ transactions, className }: AnalyticsChartProps) => {
  const [timeFrame, setTimeFrame] = React.useState<TimeFrame>('week');
  
  const chartData = useMemo(() => 
    generateTimeFrameData(transactions, timeFrame), 
    [transactions, timeFrame]
  );
  
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
            <CardDescription>Transaction volume over time</CardDescription>
          </div>
          <TimeFrameSelector 
            activeTimeFrame={timeFrame} 
            onChange={setTimeFrame} 
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-1">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
              />
              <YAxis 
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickFormatter={(value) => `₹${value}`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--card-foreground))"
                }}
                formatter={(value: any, name: any) => {
                  if (name === 'revenue') return [`₹${value}`, 'Revenue'];
                  return [value, name.charAt(0).toUpperCase() + name.slice(1)];
                }}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                fill="hsla(var(--primary), 0.2)"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
              <Bar
                yAxisId="right"
                dataKey="transactions"
                fill="hsl(var(--secondary))"
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
