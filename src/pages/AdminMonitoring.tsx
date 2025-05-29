
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Server, 
  Database, 
  Activity, 
  Shield, 
  TrendingUp,
  AlertCircle,
  BarChart3,
  Zap,
  Eye,
  GitBranch
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MonitoringDashboard from '@/components/admin/monitoring/MonitoringDashboard';
import { Helmet } from 'react-helmet';

const AdminMonitoring = () => {
  const navigate = useNavigate();

  const monitoringCategories = [
    {
      id: 'server',
      title: 'Server Performance',
      description: 'Monitor CPU, memory, and system resources',
      icon: Server,
      status: 'operational',
      metrics: { cpu: '28%', memory: '42%', uptime: '99.9%' }
    },
    {
      id: 'api',
      title: 'API Gateway',
      description: 'Track API performance and response times',
      icon: Zap,
      status: 'operational',
      metrics: { requests: '1.2K/min', latency: '145ms', errors: '0.1%' }
    },
    {
      id: 'database',
      title: 'Database Health',
      description: 'Monitor database performance and queries',
      icon: Database,
      status: 'operational',
      metrics: { connections: '45/100', queries: '2.3K/min', cache: '91%' }
    },
    {
      id: 'payment',
      title: 'Payment Gateway',
      description: 'Payment processor status and metrics',
      icon: Activity,
      status: 'operational',
      metrics: { volume: '₹1.2M', success: '99.8%', pending: '12' }
    },
    {
      id: 'security',
      title: 'Security Monitoring',
      description: 'Security events and threat detection',
      icon: Shield,
      status: 'operational',
      metrics: { threats: '0', logins: '245', failed: '3' }
    },
    {
      id: 'transactions',
      title: 'Transaction Flow',
      description: 'Real-time transaction monitoring',
      icon: TrendingUp,
      status: 'operational',
      metrics: { volume: '892', success: '99.2%', avg: '2.3s' }
    },
    {
      id: 'errors',
      title: 'Error Tracking',
      description: 'Application errors and exceptions',
      icon: AlertCircle,
      status: 'warning',
      metrics: { errors: '12', resolved: '98%', critical: '0' }
    },
    {
      id: 'analytics',
      title: 'Business Analytics',
      description: 'User behavior and performance metrics',
      icon: BarChart3,
      status: 'operational',
      metrics: { users: '1.8K', conversion: '15.2%', revenue: '₹156K' }
    },
    {
      id: 'status',
      title: 'System Status',
      description: 'Overall system health dashboard',
      icon: Monitor,
      status: 'operational',
      metrics: { uptime: '99.95%', incidents: '0', maintenance: '1' }
    },
    {
      id: 'performance',
      title: 'Performance Analytics',
      description: 'Detailed performance metrics',
      icon: TrendingUp,
      status: 'operational',
      metrics: { speed: '1.2s', optimization: '94%', bottlenecks: '2' }
    },
    {
      id: 'incidents',
      title: 'Incident Management',
      description: 'Track and resolve system incidents',
      icon: AlertCircle,
      status: 'operational',
      metrics: { active: '0', resolved: '15', avg: '45min' }
    },
    {
      id: 'bank-api',
      title: 'Bank API Integration',
      description: 'Monitor all bank API connections',
      icon: GitBranch,
      status: 'operational',
      metrics: { apis: '4', uptime: '99.1%', latency: '170ms' }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return '●';
      case 'warning': return '▲';
      case 'error': return '✕';
      default: return '○';
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/admin/monitoring/${categoryId}`);
  };

  return (
    <Routes>
      <Route index element={
        <div className="space-y-6">
          <Helmet>
            <title>System Monitoring | RizzPay Admin</title>
          </Helmet>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive monitoring dashboard for all system components and services
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">Operational</div>
                  <Monitor className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">All systems running normally</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-orange-600">2</div>
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Warnings requiring attention</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">99.95%</div>
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">Excellent</div>
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Response times optimal</p>
              </CardContent>
            </Card>
          </div>

          {/* Monitoring Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monitoringCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCategoryClick(category.id)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          <CardDescription className="text-sm">{category.description}</CardDescription>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category.status)}`}>
                        <span className="mr-1">{getStatusIcon(category.status)}</span>
                        {category.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {Object.entries(category.metrics).map(([key, value], index) => (
                        <div key={index} className="text-center">
                          <p className="text-muted-foreground capitalize">{key}</p>
                          <p className="font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full" onClick={() => handleCategoryClick(category.id)}>
                        <Monitor className="h-4 w-4 mr-2" />
                        View Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      } />
      <Route path=":dashboardType" element={<MonitoringDashboard />} />
    </Routes>
  );
};

export default AdminMonitoring;
