
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Cpu,
  Database,
  Monitor,
  RefreshCw,
  TrendingUp,
  Zap
} from 'lucide-react';
import { 
  getMonitoringData, 
  performHealthCheck, 
  clearCrashReports,
  SystemHealth 
} from '@/utils/monitoringUtils';

const MonitoringDashboard = () => {
  const [healthStatus, setHealthStatus] = useState<SystemHealth | null>(null);
  const [monitoringData, setMonitoringData] = useState(getMonitoringData());
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const health = await performHealthCheck();
      setHealthStatus(health);
      setMonitoringData(getMonitoringData());
    } catch (error) {
      console.error('Failed to refresh monitoring data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Monitor className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const recentCrashes = monitoringData.crashes.slice(-5);
  const recentApiErrors = monitoringData.apiMetrics.filter(metric => !metric.success).slice(-5);
  const averageApiResponseTime = monitoringData.apiMetrics.length > 0 
    ? Math.round(monitoringData.apiMetrics.reduce((sum, metric) => sum + metric.duration, 0) / monitoringData.apiMetrics.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Monitoring</h2>
          <p className="text-muted-foreground">Real-time system health and performance monitoring</p>
        </div>
        <Button onClick={refreshData} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {healthStatus && getStatusIcon(healthStatus.status)}
              <div>
                <p className="text-sm text-muted-foreground">Overall Status</p>
                <p className="font-medium capitalize">
                  {healthStatus?.status || 'Checking...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">API Status</p>
                <p className="font-medium">
                  {healthStatus?.checks.api ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Database</p>
                <p className="font-medium">
                  {healthStatus?.checks.database ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="font-medium">{averageApiResponseTime}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Recent Crashes</p>
                <p className="font-medium">{recentCrashes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="health" className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">Health Checks</TabsTrigger>
          <TabsTrigger value="crashes">Crash Reports</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="api">API Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Service Health Checks</CardTitle>
              <CardDescription>Current status of all system components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healthStatus && Object.entries(healthStatus.checks).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {status ? 
                        <CheckCircle className="h-5 w-5 text-green-500" /> : 
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      }
                      <span className="font-medium capitalize">{service}</span>
                    </div>
                    <Badge className={status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {status ? 'Healthy' : 'Failed'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crashes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Crash Reports</CardTitle>
                  <CardDescription>Latest application crashes and errors</CardDescription>
                </div>
                {recentCrashes.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearCrashReports}>
                    Clear Reports
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {recentCrashes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No recent crashes detected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCrashes.map((crash, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-red-800">{crash.error.message}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(crash.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="destructive">Error</Badge>
                      </div>
                      {crash.context && (
                        <div className="text-xs bg-gray-50 p-2 rounded mt-2">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(crash.context, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Application performance and memory usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monitoringData.memory && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Memory Usage</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Used</p>
                        <p className="font-medium">{monitoringData.memory.used} MB</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-medium">{monitoringData.memory.total} MB</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Limit</p>
                        <p className="font-medium">{monitoringData.memory.limit} MB</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Page Load Performance</h4>
                  {monitoringData.performance.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No performance data available</p>
                  ) : (
                    <div className="space-y-2">
                      {monitoringData.performance.slice(-5).map((perf, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{perf.page}</span>
                          <span>{Math.round(perf.loadTime)}ms</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Performance</CardTitle>
              <CardDescription>Recent API calls and response times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Average Response Time</p>
                    <p className="text-2xl font-bold">{averageApiResponseTime}ms</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Failed Requests</p>
                    <p className="text-2xl font-bold text-red-600">{recentApiErrors.length}</p>
                  </div>
                </div>

                {recentApiErrors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recent API Errors</h4>
                    <div className="space-y-2">
                      {recentApiErrors.map((error, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded text-sm">
                          <span>{error.method} {error.endpoint}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">{error.status}</Badge>
                            <span className="text-muted-foreground">{error.duration}ms</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringDashboard;
