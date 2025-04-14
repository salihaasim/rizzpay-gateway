
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor, RefreshCw } from 'lucide-react';

// Mock dashboard definitions
const dashboards = {
  server: {
    title: "Server Performance Monitoring",
    description: "Real-time CPU, memory, and system resource monitoring",
    metrics: ["CPU Usage", "Memory Utilization", "Disk I/O", "Network Throughput", "Process Stats"]
  },
  api: {
    title: "API Gateway Monitoring",
    description: "API performance, request rates, and error tracking",
    metrics: ["Request Volume", "Response Times", "Error Rates", "Endpoint Usage", "Authentication Stats"]
  },
  database: {
    title: "Database Health Monitoring",
    description: "Database performance, connections, and query analytics",
    metrics: ["Query Performance", "Connection Pool", "Index Usage", "Cache Hit Rate", "Storage Usage"]
  },
  payment: {
    title: "Payment Gateway Monitoring",
    description: "Payment processor status and transaction metrics",
    metrics: ["Transaction Volume", "Success Rates", "Processing Time", "Gateway Availability", "Error Breakdown"]
  },
  security: {
    title: "Security Monitoring",
    description: "Security events, threats, and compliance status",
    metrics: ["Login Attempts", "Authorization Failures", "Suspicious Activities", "Data Access Logs", "Compliance Status"]
  },
  transactions: {
    title: "Transaction Monitoring",
    description: "Real-time tracking of payment transactions",
    metrics: ["Transaction Flow", "Status Distribution", "Processing Steps", "Failure Points", "Recovery Rate"]
  },
  errors: {
    title: "Error Tracking",
    description: "Application errors, exceptions, and runtime issues",
    metrics: ["Error Frequency", "Error Categories", "Stack Traces", "User Impact", "Resolution Time"]
  },
  analytics: {
    title: "Business Analytics",
    description: "User behavior and business performance metrics",
    metrics: ["User Engagement", "Conversion Rates", "Revenue Metrics", "Merchant Performance", "Growth Trends"]
  },
  status: {
    title: "System Status Dashboard",
    description: "Comprehensive overview of all system components",
    metrics: ["Component Status", "Service Health", "Incident Timeline", "Scheduled Maintenance", "Performance Index"]
  },
  performance: {
    title: "Performance Analytics",
    description: "Detailed performance metrics and optimization insights",
    metrics: ["Load Times", "Resource Usage", "Bottlenecks", "Optimization Opportunities", "Historical Trends"]
  },
  incidents: {
    title: "Incident Management",
    description: "Tracking and resolving system incidents",
    metrics: ["Active Incidents", "Resolution Progress", "Impact Assessment", "Root Cause Analysis", "Preventive Measures"]
  }
};

const MonitoringDashboard = () => {
  const { dashboardType } = useParams<{ dashboardType: string }>();
  const navigate = useNavigate();
  
  // Default to server dashboard if no type is specified
  const dashboard = dashboards[dashboardType as keyof typeof dashboards] || dashboards.server;
  
  const handleBack = () => {
    navigate('/admin/monitoring');
  };
  
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
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {dashboard.metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{metric}</CardTitle>
                <CardDescription>Real-time monitoring data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-36 flex items-center justify-center bg-secondary/30 rounded-md">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Monitor className="h-8 w-8 mb-2" />
                    <p className="text-sm">Dashboard visualization will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
            <CardDescription>Comprehensive {dashboardType} monitoring data with insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-56 flex items-center justify-center bg-secondary/30 rounded-md">
              <div className="flex flex-col items-center text-muted-foreground">
                <Monitor className="h-10 w-10 mb-3" />
                <p>Detailed {dashboardType} analytics dashboard will be displayed here</p>
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
