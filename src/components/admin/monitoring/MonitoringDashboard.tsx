import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor, RefreshCw, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import BankApiMonitoring from './BankApiMonitoring';

// Mock dashboard definitions with enhanced metrics
const dashboards = {
  server: {
    title: "Server Performance Monitoring",
    description: "Real-time CPU, memory, and system resource monitoring",
    metrics: [
      { name: "CPU Usage", value: 28, trend: "+2%", status: "Normal" },
      { name: "Memory Utilization", value: 42, trend: "-1%", status: "Normal" },
      { name: "Disk I/O", value: 56, trend: "+5%", status: "Warning" },
      { name: "Network Throughput", value: 33, trend: "0%", status: "Normal" },
      { name: "Process Stats", value: 75, trend: "+3%", status: "Normal" }
    ]
  },
  api: {
    title: "API Gateway Monitoring",
    description: "API performance, request rates, and error tracking",
    metrics: [
      { name: "Request Volume", value: 89, trend: "+12%", status: "High" },
      { name: "Response Times", value: 23, trend: "-3%", status: "Good" },
      { name: "Error Rates", value: 2, trend: "-1%", status: "Good" },
      { name: "Endpoint Usage", value: 67, trend: "+8%", status: "Normal" },
      { name: "Authentication Stats", value: 98, trend: "+1%", status: "Excellent" }
    ]
  },
  database: {
    title: "Database Health Monitoring",
    description: "Database performance, connections, and query analytics",
    metrics: [
      { name: "Query Performance", value: 85, trend: "+2%", status: "Good" },
      { name: "Connection Pool", value: 46, trend: "+5%", status: "Normal" },
      { name: "Index Usage", value: 92, trend: "-1%", status: "Excellent" },
      { name: "Cache Hit Rate", value: 91, trend: "+3%", status: "Excellent" },
      { name: "Storage Usage", value: 68, trend: "+1%", status: "Normal" }
    ]
  },
  payment: {
    title: "Payment Gateway Monitoring",
    description: "Payment processor status and transaction metrics",
    metrics: [
      { name: "Transaction Volume", value: 94, trend: "+15%", status: "High" },
      { name: "Success Rates", value: 97, trend: "+1%", status: "Excellent" },
      { name: "Processing Time", value: 18, trend: "-2%", status: "Fast" },
      { name: "Gateway Availability", value: 99, trend: "0%", status: "Excellent" },
      { name: "Error Breakdown", value: 3, trend: "-1%", status: "Low" }
    ]
  },
  security: {
    title: "Security Monitoring",
    description: "Security events, threats, and compliance status",
    metrics: [
      { name: "Login Attempts", value: 245, trend: "+8%", status: "Normal" },
      { name: "Authorization Failures", value: 12, trend: "-15%", status: "Low" },
      { name: "Suspicious Activities", value: 3, trend: "-25%", status: "Low" },
      { name: "Data Access Logs", value: 1847, trend: "+5%", status: "Normal" },
      { name: "Compliance Status", value: 100, trend: "0%", status: "Compliant" }
    ]
  },
  transactions: {
    title: "Transaction Monitoring",
    description: "Real-time tracking of payment transactions",
    metrics: [
      { name: "Transaction Flow", value: 87, trend: "+10%", status: "High" },
      { name: "Status Distribution", value: 92, trend: "+2%", status: "Good" },
      { name: "Processing Steps", value: 95, trend: "+1%", status: "Excellent" },
      { name: "Failure Points", value: 5, trend: "-2%", status: "Low" },
      { name: "Recovery Rate", value: 98, trend: "+3%", status: "Excellent" }
    ]
  },
  errors: {
    title: "Error Tracking",
    description: "Application errors, exceptions, and runtime issues",
    metrics: [
      { name: "Error Frequency", value: 12, trend: "-20%", status: "Low" },
      { name: "Error Categories", value: 5, trend: "-1%", status: "Manageable" },
      { name: "Stack Traces", value: 8, trend: "-15%", status: "Tracked" },
      { name: "User Impact", value: 2, trend: "-50%", status: "Minimal" },
      { name: "Resolution Time", value: 45, trend: "-10%", status: "Fast" }
    ]
  },
  analytics: {
    title: "Business Analytics",
    description: "User behavior and business performance metrics",
    metrics: [
      { name: "User Engagement", value: 78, trend: "+12%", status: "Good" },
      { name: "Conversion Rates", value: 15, trend: "+8%", status: "Improving" },
      { name: "Revenue Metrics", value: 156, trend: "+25%", status: "Excellent" },
      { name: "Merchant Performance", value: 89, trend: "+5%", status: "Good" },
      { name: "Growth Trends", value: 23, trend: "+18%", status: "Strong" }
    ]
  },
  status: {
    title: "System Status Dashboard",
    description: "Comprehensive overview of all system components",
    metrics: [
      { name: "Component Status", value: 98, trend: "+1%", status: "Operational" },
      { name: "Service Health", value: 96, trend: "0%", status: "Good" },
      { name: "Incident Timeline", value: 2, trend: "-3%", status: "Low" },
      { name: "Scheduled Maintenance", value: 1, trend: "0%", status: "Planned" },
      { name: "Performance Index", value: 94, trend: "+2%", status: "Excellent" }
    ]
  },
  performance: {
    title: "Performance Analytics",
    description: "Detailed performance metrics and optimization insights",
    metrics: [
      { name: "Load Times", value: 180, trend: "-15%", status: "Fast" },
      { name: "Resource Usage", value: 65, trend: "+3%", status: "Normal" },
      { name: "Bottlenecks", value: 3, trend: "-40%", status: "Few" },
      { name: "Optimization Opportunities", value: 8, trend: "-20%", status: "Available" },
      { name: "Historical Trends", value: 85, trend: "+5%", status: "Positive" }
    ]
  },
  incidents: {
    title: "Incident Management",
    description: "Tracking and resolving system incidents",
    metrics: [
      { name: "Active Incidents", value: 2, trend: "-50%", status: "Low" },
      { name: "Resolution Progress", value: 75, trend: "+25%", status: "Good" },
      { name: "Impact Assessment", value: 15, trend: "-30%", status: "Low" },
      { name: "Root Cause Analysis", value: 8, trend: "+2%", status: "Complete" },
      { name: "Preventive Measures", value: 12, trend: "+20%", status: "Implemented" }
    ]
  }
};

const MonitoringDashboard = () => {
  const { dashboardType } = useParams<{ dashboardType: string }>();
  const navigate = useNavigate();
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Default to server dashboard if no type is specified or if the type doesn't exist
  const dashboard = dashboardType && dashboards[dashboardType as keyof typeof dashboards] 
    ? dashboards[dashboardType as keyof typeof dashboards] 
    : dashboards.server;
  
  useEffect(() => {
    console.log("MonitoringDashboard mounted with type:", dashboardType);
    // Validate that the dashboard type exists, if not redirect to default
    if (dashboardType && !dashboards[dashboardType as keyof typeof dashboards]) {
      console.warn(`Dashboard type "${dashboardType}" not found, redirecting to default`);
      navigate('/admin/monitoring/server');
    }
  }, [dashboardType, navigate]);
  
  const handleBack = () => {
    navigate('/admin/monitoring');
  };
  
  const handleRefresh = () => {
    console.log("Refreshing monitoring data for:", dashboardType);
    setLastRefresh(new Date());
    // In a real implementation, this would fetch fresh monitoring data
  };
  
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'Normal': 'bg-green-500/20 text-green-600',
      'Good': 'bg-green-500/20 text-green-600',
      'Excellent': 'bg-blue-500/20 text-blue-600',
      'Warning': 'bg-orange-500/20 text-orange-600',
      'High': 'bg-blue-500/20 text-blue-600',
      'Low': 'bg-green-500/20 text-green-600',
      'Fast': 'bg-green-500/20 text-green-600',
      'Operational': 'bg-green-500/20 text-green-600',
      'Compliant': 'bg-green-500/20 text-green-600'
    };
    return statusColors[status] || 'bg-gray-500/20 text-gray-600';
  };
  
  const getTrendIcon = (trend: string) => {
    if (trend.startsWith('+')) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend.startsWith('-')) {
      return <Activity className="h-4 w-4 text-blue-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-gray-500" />;
  };
  
  console.log("Rendering monitoring dashboard for type:", dashboardType);
  
  // If this is the bank API dashboard, render the dedicated component
  if (dashboardType === 'bank-api') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bank API Integration Monitoring</h1>
            <p className="text-muted-foreground">Comprehensive monitoring of all bank API integrations</p>
          </div>
        </div>
        <BankApiMonitoring />
      </div>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{dashboard.title}</h1>
              <p className="text-muted-foreground">{dashboard.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {dashboard.metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{metric.name}</CardTitle>
                  {getTrendIcon(metric.trend)}
                </div>
                <CardDescription>Real-time monitoring data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{metric.value}{typeof metric.value === 'number' && metric.value < 100 ? '%' : ''}</span>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  {typeof metric.value === 'number' && metric.value <= 100 && (
                    <Progress value={metric.value} className="h-2" />
                  )}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Trend: {metric.trend}</span>
                    <span>Status: {metric.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
            <CardDescription>Comprehensive {dashboardType || 'server'} monitoring data with insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-56 flex items-center justify-center bg-secondary/30 rounded-md">
              <div className="flex flex-col items-center text-muted-foreground">
                <Monitor className="h-10 w-10 mb-3" />
                <p>Detailed {dashboardType || 'server'} analytics dashboard will be displayed here</p>
                <p className="text-sm mt-1">Data is updated in real-time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default MonitoringDashboard;
