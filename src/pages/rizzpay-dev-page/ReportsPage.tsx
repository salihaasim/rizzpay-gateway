
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar as CalendarIcon,
  FileText,
  PieChart,
  Activity,
  Users,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet';

const ReportsPage = () => {
  const [date, setDate] = useState<Date>();

  const reportTypes = [
    {
      id: 'transaction',
      title: 'Transaction Reports',
      description: 'Detailed transaction analytics and summaries',
      icon: BarChart3
    },
    {
      id: 'financial',
      title: 'Financial Reports',
      description: 'Revenue, settlements, and financial summaries',
      icon: DollarSign
    },
    {
      id: 'customer',
      title: 'Customer Analytics',
      description: 'Customer behavior and demographics',
      icon: Users
    },
    {
      id: 'performance',
      title: 'Performance Reports',
      description: 'System performance and success rates',
      icon: Activity
    }
  ];

  const quickStats = [
    {
      title: 'Total Revenue',
      value: '₹2,45,890',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'Transactions',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: CreditCard
    },
    {
      title: 'Success Rate',
      value: '98.7%',
      change: '+0.3%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Active Users',
      value: '892',
      change: '-2.1%',
      trend: 'down',
      icon: Users
    }
  ];

  const availableReports = [
    {
      name: 'Daily Transaction Summary',
      description: 'Complete transaction breakdown by day',
      format: 'PDF, CSV, Excel',
      lastGenerated: '2 hours ago'
    },
    {
      name: 'Monthly Revenue Report',
      description: 'Monthly revenue and growth analysis',
      format: 'PDF, Excel',
      lastGenerated: '1 day ago'
    },
    {
      name: 'Customer Analytics',
      description: 'Customer behavior and transaction patterns',
      format: 'PDF, CSV',
      lastGenerated: '3 hours ago'
    },
    {
      name: 'Performance Metrics',
      description: 'System performance and uptime analysis',
      format: 'PDF, CSV',
      lastGenerated: '1 hour ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Reports & Analytics | RizzPay</title>
        <meta name="description" content="Comprehensive reports and analytics for your RizzPay transactions and business metrics." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">
              Comprehensive insights into your payment performance and business metrics
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                        <span className={cn(
                          "text-sm font-medium ml-1",
                          stat.trend === 'up' ? "text-green-500" : "text-red-500"
                        )}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Report Types */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Report Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card key={type.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">{type.title}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Report Generation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate Custom Report</CardTitle>
            <CardDescription>
              Create custom reports with specific date ranges and filters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transactions">Transactions</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>
              Download pre-generated reports or schedule automated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{report.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{report.format}</Badge>
                      <span className="text-xs text-gray-500">
                        Last generated: {report.lastGenerated}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
