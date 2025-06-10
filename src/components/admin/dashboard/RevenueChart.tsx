
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, IndianRupee } from 'lucide-react';

const RevenueChart = () => {
  const revenueData = [
    { month: 'Jan', payinRevenue: 125000, payoutRevenue: 45000, totalRevenue: 170000 },
    { month: 'Feb', payinRevenue: 142000, payoutRevenue: 52000, totalRevenue: 194000 },
    { month: 'Mar', payinRevenue: 158000, payoutRevenue: 48000, totalRevenue: 206000 },
    { month: 'Apr', payinRevenue: 175000, payoutRevenue: 63000, totalRevenue: 238000 },
    { month: 'May', payinRevenue: 195000, payoutRevenue: 71000, totalRevenue: 266000 },
    { month: 'Jun', payinRevenue: 220000, payoutRevenue: 78000, totalRevenue: 298000 }
  ];

  const currentMonth = revenueData[revenueData.length - 1];
  const previousMonth = revenueData[revenueData.length - 2];
  const growthRate = ((currentMonth.totalRevenue - previousMonth.totalRevenue) / previousMonth.totalRevenue * 100).toFixed(1);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{currentMonth.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{growthRate}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pay-in Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{currentMonth.payinRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((currentMonth.payinRevenue / currentMonth.totalRevenue) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payout Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{currentMonth.payoutRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((currentMonth.payoutRevenue / currentMonth.totalRevenue) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue breakdown by service type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`₹${value.toLocaleString()}`, '']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalRevenue" 
                stroke="#8884d8" 
                strokeWidth={3}
                name="Total Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="payinRevenue" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Pay-in Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="payoutRevenue" 
                stroke="#ffc658" 
                strokeWidth={2}
                name="Payout Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Comparison</CardTitle>
          <CardDescription>Monthly comparison of pay-in vs payout revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`₹${value.toLocaleString()}`, '']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Bar dataKey="payinRevenue" fill="#82ca9d" name="Pay-in Revenue" />
              <Bar dataKey="payoutRevenue" fill="#ffc658" name="Payout Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueChart;
