
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, AlertTriangle, Database, Server, Users, Lock, Zap, 
  BarChart3, Globe, Cpu, Signal, FileWarning, Clock, ArrowDownUp,
  ExternalLink, Layers, ShieldAlert, Bug, LineChart, Receipt, Network,
  PanelTop, Gauge, RefreshCw
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Enhanced monitoring data with real-time capabilities
const systemStatus = {
  cpu: 28,
  memory: 42,
  disk: 56,
  network: 33,
  serverUptime: '18d 12h 45m',
  responseTime: '126ms',
  queuedTasks: 7,
  activeUsers: 187,
  databaseConnections: 46,
  cachingEfficiency: 91,
  lastRestart: '2023-03-15 04:32:00',
  errorRate: 0.34,
  currentLoad: 'Normal',
  serverRegion: 'ap-south-1',
  activeTransactions: 23,
  pendingPayments: 12,
  upiStatus: 'Operational',
  bankStatus: 'Operational',
  cardStatus: 'Degraded',
  securityEvents: 14,
  failedLogins: 8,
  apiCalls: {
    total: 23845,
    successful: 23729,
    failed: 116,
    averageTime: '187ms'
  },
  recentIncidents: [
    { id: 1, time: '2023-04-12 14:23', description: 'Card payment gateway timeout', status: 'Resolved', severity: 'Medium' },
    { id: 2, time: '2023-04-10 09:17', description: 'Temporary database connection issues', status: 'Resolved', severity: 'High' },
    { id: 3, time: '2023-04-05 18:42', description: 'API rate limiting triggered', status: 'Resolved', severity: 'Low' }
  ]
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch(status.toLowerCase()) {
      case 'operational':
        return 'bg-green-500/20 text-green-600';
      case 'degraded':
        return 'bg-orange-500/20 text-orange-600';
      case 'down':
        return 'bg-red-500/20 text-red-600';
      default:
        return 'bg-gray-500/20 text-gray-600';
    }
  };
  
  return (
    <Badge className={`${getStatusColor()} rounded-full px-2 py-0.5`}>
      {status}
    </Badge>
  );
};

// Resource usage component
const ResourceUsage = ({ name, value, icon }: { name: string, value: number, icon: React.ReactNode }) => (
  <div className="flex items-center gap-4 mb-4">
    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  </div>
);

// Incident component
const Incident = ({ incident }: { incident: any }) => {
  const getSeverityColor = () => {
    switch(incident.severity.toLowerCase()) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-orange-500';
      case 'low':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <div className="flex items-start gap-3 mb-4 p-3 bg-secondary/30 rounded-lg">
      <AlertTriangle className={`h-5 w-5 mt-1 ${getSeverityColor()}`} />
      <div className="flex-1">
        <div className="flex justify-between">
          <p className="font-medium">{incident.description}</p>
          <Badge variant="outline">{incident.status}</Badge>
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-sm text-muted-foreground">{incident.time}</p>
          <p className={`text-xs font-medium ${getSeverityColor()}`}>{incident.severity} Severity</p>
        </div>
      </div>
    </div>
  );
};

// Monitoring section card component
const MonitoringSectionCard = ({ 
  title, 
  description, 
  icon, 
  path 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  path: string;
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="space-y-1">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardFooter className="pt-0">
      <Button asChild variant="outline" className="w-full justify-between mt-2">
        <Link to={path}>
          <span>Open Dashboard</span>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

const AdminMonitoring = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Define the monitoring sections for the dedicated dashboards
  const monitoringSections = [
    {
      title: "Server Performance",
      description: "CPU, memory, and system resource monitoring",
      icon: <Cpu className="h-6 w-6 text-primary" />,
      path: "/admin/monitoring/server"
    },
    {
      title: "API Gateway",
      description: "API performance and endpoint monitoring",
      icon: <Network className="h-6 w-6 text-primary" />,
      path: "/admin/monitoring/api"
    },
    {
      title: "Database Health",
      description: "Database connections and query performance",
      icon: <Database className="h-6 w-6 text-primary" />,
      path: "/admin/monitoring/database"
    },
    {
      title: "Payment Gateways",
      description: "Payment processor status and performance",
      icon: <Receipt className="h-6 w-6 text-primary" />,
      path: "/admin/monitoring/payment"
    },
    {
      title: "Security",
      description: "Security events and threat detection",
      icon: <ShieldAlert className="h-6 w-6 text-primary" />,
      path: "/admin/monitoring/security"
    },
    {
      title: "Transaction Monitoring",
      description: "Real-time transaction tracking",
      icon: <ArrowDownUp className="h-6 w-6 text-primary" />,
      path: "/admin/monitoring/transactions"
    },
    {
      title: "Error Tracking",
      description: "Application errors and exceptions",
      icon: <Bug className="h-6 w-6 text-primary" />,
      path: "/admin/monitoring/errors"
    },
    {
      title: "Analytics",
      description: "User behavior and business metrics",
      icon: <LineChart className="h-6 w-6 text-primary" />,
      path: "/admin/monitoring/analytics"
    },
    {
      title: "System Status",
      description: "Overall system health dashboard",
      icon: <Gauge className="h-6 w-6 text-primary" />,
      path: "/admin/monitoring/status"
    },
    {
      title: "Performance Analytics",
      description: "Detailed performance metrics and insights",
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      path: "/admin/monitoring/performance"
    },
    {
      title: "Incident Management",
      description: "Track and resolve system incidents",
      icon: <AlertTriangle className="h-6 w-6 text-primary" />,
      path: "/admin/monitoring/incidents"
    }
  ];
  
  const handleRefreshData = () => {
    setLastRefresh(new Date());
    console.log("Refreshing monitoring data...");
    // In a real implementation, this would trigger API calls to refresh monitoring data
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
            <p className="text-muted-foreground">
              Comprehensive overview of RizzPay system performance and health.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <Button variant="outline" size="sm" onClick={handleRefreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="payments">Payment Systems</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStatus.currentLoad}</div>
                  <p className="text-xs text-muted-foreground">
                    Server uptime: {systemStatus.serverUptime}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Transactions</CardTitle>
                  <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStatus.activeTransactions}</div>
                  <p className="text-xs text-muted-foreground">
                    {systemStatus.pendingPayments} pending payments
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Performance</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStatus.apiCalls.averageTime}</div>
                  <p className="text-xs text-muted-foreground">
                    Success rate: {((systemStatus.apiCalls.successful / systemStatus.apiCalls.total) * 100).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Events</CardTitle>
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStatus.securityEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    {systemStatus.failedLogins} failed login attempts
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>
                    Current resource utilization and server performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResourceUsage name="CPU Usage" value={systemStatus.cpu} icon={<Cpu className="h-5 w-5 text-primary" />} />
                  <ResourceUsage name="Memory Usage" value={systemStatus.memory} icon={<Activity className="h-5 w-5 text-primary" />} />
                  <ResourceUsage name="Disk Space" value={systemStatus.disk} icon={<Database className="h-5 w-5 text-primary" />} />
                  <ResourceUsage name="Network" value={systemStatus.network} icon={<Globe className="h-5 w-5 text-primary" />} />
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <p className="text-sm font-medium mb-1">Response Time</p>
                      <p className="text-xl font-bold">{systemStatus.responseTime}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Active Users</p>
                      <p className="text-xl font-bold">{systemStatus.activeUsers}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">DB Connections</p>
                      <p className="text-xl font-bold">{systemStatus.databaseConnections}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Cache Efficiency</p>
                      <p className="text-xl font-bold">{systemStatus.cachingEfficiency}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Services</CardTitle>
                  <CardDescription>
                    Current status of payment processors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Signal className="h-4 w-4 text-primary" />
                        </div>
                        <span>UPI Gateway</span>
                      </div>
                      <StatusBadge status={systemStatus.upiStatus} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Signal className="h-4 w-4 text-primary" />
                        </div>
                        <span>Bank Transfers</span>
                      </div>
                      <StatusBadge status={systemStatus.bankStatus} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Signal className="h-4 w-4 text-primary" />
                        </div>
                        <span>Card Processing</span>
                      </div>
                      <StatusBadge status={systemStatus.cardStatus} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
                <CardDescription>
                  System events and incidents from the past 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {systemStatus.recentIncidents.map(incident => (
                    <Incident key={incident.id} incident={incident} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Monitoring Dashboards Tab */}
          <TabsContent value="dashboards" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monitoringSections.map((section, index) => (
                <MonitoringSectionCard
                  key={index}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  path={section.path}
                />
              ))}
            </div>
          </TabsContent>
          
          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>
                  Detailed metrics for system performance monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Detailed performance monitoring view will be displayed here, including:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Real-time server performance graphs</li>
                  <li>API response time trends</li>
                  <li>Database query performance</li>
                  <li>Resource utilization over time</li>
                  <li>Network traffic analysis</li>
                </ul>
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link to="/admin/monitoring/performance">
                      <span>Open Detailed Performance Dashboard</span>
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payments Systems Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Systems</CardTitle>
                <CardDescription>
                  Monitoring of all payment processors and gateways
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Payment systems monitoring dashboard will be displayed here, including:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Payment gateway status for each provider</li>
                  <li>Transaction success rates by payment method</li>
                  <li>Payment processing times</li>
                  <li>Settlement status tracking</li>
                  <li>Failed transaction analysis</li>
                </ul>
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link to="/admin/monitoring/payment">
                      <span>Open Payment Systems Dashboard</span>
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Monitoring</CardTitle>
                <CardDescription>
                  Security events and threat detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Security monitoring dashboard will be displayed here, including:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Login attempt monitoring</li>
                  <li>API authentication failures</li>
                  <li>Suspicious transaction patterns</li>
                  <li>Data access audit logs</li>
                  <li>Compliance status indicators</li>
                </ul>
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link to="/admin/monitoring/security">
                      <span>Open Security Dashboard</span>
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Incidents Tab */}
          <TabsContent value="incidents">
            <Card>
              <CardHeader>
                <CardTitle>System Incidents</CardTitle>
                <CardDescription>
                  Historical record of system incidents and resolutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Full incident history and management interface will be displayed here, including:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Incident timeline with severity tracking</li>
                  <li>Resolution status and ownership</li>
                  <li>Root cause analysis reports</li>
                  <li>Affected system components</li>
                  <li>Mitigation and prevention measures</li>
                </ul>
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link to="/admin/monitoring/incidents">
                      <span>Open Incidents Dashboard</span>
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminMonitoring;
