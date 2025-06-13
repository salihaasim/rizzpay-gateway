
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Server, 
  Database, 
  Activity, 
  Shield, 
  CreditCard, 
  TrendingUp, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const AdminMonitoring = () => {
  const navigate = useNavigate();

  const monitoringDashboards = [
    {
      id: 'server',
      title: 'Server Monitoring',
      description: 'CPU, Memory, Disk Usage & System Health',
      icon: Server,
      status: 'operational',
      metrics: { cpu: '28%', memory: '42%', uptime: '99.9%' }
    },
    {
      id: 'api',
      title: 'API Monitoring',
      description: 'API Performance, Request Rates & Response Times',
      icon: Activity,
      status: 'operational',
      metrics: { requests: '1.2k/min', avgResponse: '120ms', errors: '0.1%' }
    },
    {
      id: 'database',
      title: 'Database Monitoring',
      description: 'Database Performance & Connection Health',
      icon: Database,
      status: 'warning',
      metrics: { connections: '45/100', queryTime: '85ms', storage: '68%' }
    },
    {
      id: 'payment',
      title: 'Payment Gateway',
      description: 'Payment Processing & Transaction Flow',
      icon: CreditCard,
      status: 'operational',
      metrics: { volume: '₹2.4M', success: '97.8%', pending: '12' }
    },
    {
      id: 'security',
      title: 'Security Monitoring',
      description: 'Security Events, Threats & Compliance',
      icon: Shield,
      status: 'operational',
      metrics: { threats: '3 blocked', logins: '245', failures: '12' }
    },
    {
      id: 'bank-api',
      title: 'Bank API Integration',
      description: 'Bank API Status & Integration Health',
      icon: ExternalLink,
      status: 'operational',
      metrics: { apis: '5 active', latency: '95ms', availability: '99.5%' }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'warning': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'error': return 'bg-red-500/10 text-red-600 border-red-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const handleDashboardClick = (dashboardId: string) => {
    navigate(`/admin/monitoring/${dashboardId}`);
  };

  return (
    <AdminLayout>
      <div className="admin-theme space-y-6">
        <div>
          <h1 className="text-2xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Monitor system health and performance metrics across all services
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="admin-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Status</p>
                  <p className="text-2xl font-bold text-green-600">Healthy</p>
                </div>
                <Monitor className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="admin-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Services</p>
                  <p className="text-2xl font-bold">12/12</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="admin-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold">120ms</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="admin-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Incidents</p>
                  <p className="text-2xl font-bold text-blue-600">1</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monitoring Dashboards */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Monitoring Dashboards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monitoringDashboards.map((dashboard) => (
              <Card 
                key={dashboard.id} 
                className="admin-card cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleDashboardClick(dashboard.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <dashboard.icon className="h-6 w-6 text-blue-600" />
                    <Badge className={getStatusColor(dashboard.status)}>
                      {dashboard.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{dashboard.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{dashboard.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(dashboard.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="capitalize text-muted-foreground">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="admin-button-primary w-full mt-4 hover:bg-blue-600 hover:text-white">
                    View Dashboard
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-blue-800">Database connection pool usage high</p>
                  <p className="text-sm text-blue-600">Connection pool at 68% capacity</p>
                </div>
                <span className="text-xs text-blue-600">2 min ago</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Activity className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-800">System backup completed</p>
                  <p className="text-sm text-green-600">Daily backup completed successfully</p>
                </div>
                <span className="text-xs text-green-600">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminMonitoring;
