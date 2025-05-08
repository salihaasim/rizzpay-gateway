
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransactionStore } from '@/stores/transactionStore';
import { toast } from 'sonner';

const ReportsPage = () => {
  const [timeFrame, setTimeFrame] = useState('week');
  const { transactions } = useTransactionStore();
  
  // Sample data for charts
  const revenueData = [
    { name: 'Mon', revenue: 5000, transactions: 120 },
    { name: 'Tue', revenue: 7800, transactions: 145 },
    { name: 'Wed', revenue: 9000, transactions: 190 },
    { name: 'Thu', revenue: 8100, transactions: 170 },
    { name: 'Fri', revenue: 11500, transactions: 210 },
    { name: 'Sat', revenue: 9900, transactions: 180 },
    { name: 'Sun', revenue: 4500, transactions: 95 },
  ];
  
  const paymentMethodData = [
    { name: 'UPI', value: 65 },
    { name: 'Bank Transfer', value: 20 },
    { name: 'Card', value: 15 },
  ];
  
  const statusData = [
    { name: 'Successful', value: 85 },
    { name: 'Failed', value: 10 },
    { name: 'Pending', value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const downloadReport = (reportType: string) => {
    toast.success(`Downloading ${reportType} report`);
    // In a real app, this would trigger a download of the actual report
  };
  
  return (
    <Layout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              View detailed reports and analytics of your payment activities
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <div className="text-2xl font-bold">₹47,800</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">↑ 12.5%</span> from previous {timeFrame}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Transactions
              </CardTitle>
              <div className="text-2xl font-bold">1,110</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">↑ 8.2%</span> from previous {timeFrame}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Ticket Size
              </CardTitle>
              <div className="text-2xl font-bold">₹430.63</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <span className="text-red-500 font-medium">↓ 2.1%</span> from previous {timeFrame}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Overview
                </CardTitle>
                <CardDescription>
                  Your revenue trends for the current {timeFrame}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#0052FF" name="Revenue (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Transaction Trends
                </CardTitle>
                <CardDescription>
                  Your transaction count trends for the current {timeFrame}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="transactions" 
                        stroke="#0052FF" 
                        activeDot={{ r: 8 }}
                        name="Transactions" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="distribution" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Distribution of payments by method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {paymentMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Status</CardTitle>
                  <CardDescription>
                    Distribution of transactions by status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: 'Transaction Summary', description: 'Summary of all transactions' },
              { title: 'Revenue Report', description: 'Detailed revenue breakdown' },
              { title: 'Payment Methods', description: 'Analysis of payment methods' },
              { title: 'Payout Report', description: 'Summary of all payouts' },
              { title: 'Settlement Report', description: 'Details of settlements' },
              { title: 'Tax Report', description: 'Tax calculation report' },
            ].map((report, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="bg-muted p-2">
                  <FileText className="h-6 w-6" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => downloadReport(report.title)}
                    className="w-full flex gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
