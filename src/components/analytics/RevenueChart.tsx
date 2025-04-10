
import React from 'react';
import {
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  Bar,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

interface ChartItem {
  name: string;
  revenue: number;
  transactions: number;
  timestamp: number;
}

interface RevenueChartProps {
  chartData: ChartItem[];
  avgRevenue: number;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ chartData, avgRevenue }) => {
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
    <div className="h-full w-full">
      <ChartContainer 
        config={chartConfig}
        className="w-full h-full [&_.recharts-cartesian-grid-horizontal_line]:stroke-border/30 [&_.recharts-cartesian-grid-vertical_line]:stroke-border/30"
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
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
              fontSize={10} 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              height={20}
            />
            <YAxis 
              yAxisId="left"
              fontSize={10} 
              tickFormatter={(value) => `₹${value}`}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              width={40}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              fontSize={10}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              width={25}
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
              height={20}
              formatter={(value) => value === 'revenue' ? 'Revenue' : 'Transactions'}
              wrapperStyle={{ fontSize: '10px' }}
            />
            <ReferenceLine 
              y={avgRevenue} 
              yAxisId="left" 
              label={{ value: "Avg", position: "insideTopLeft", fontSize: 10 }}
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
              radius={[3, 3, 0, 0]}
              maxBarSize={30}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default RevenueChart;
