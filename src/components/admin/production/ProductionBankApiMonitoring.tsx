
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ProductionBankApiMonitoring = () => {
  // Fetch real-time API metrics
  const { data: apiMetrics } = useQuery({
    queryKey: ['api-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_request_logs')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalRequests = data.length;
      const successfulRequests = data.filter(log => log.response_status && log.response_status < 400).length;
      const failedRequests = totalRequests - successfulRequests;
      const avgResponseTime = data.reduce((sum, log) => sum + (log.response_time_ms || 0), 0) / totalRequests;

      return {
        totalRequests,
        successfulRequests,
        failedRequests,
        successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
        avgResponseTime: Math.round(avgResponseTime)
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch recent API calls
  const { data: recentApiCalls } = useQuery({
    queryKey: ['recent-api-calls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_request_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  return (
    <div className="space-y-6">
      {/* API Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total API Calls</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {apiMetrics?.totalRequests?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-muted-foreground">Last 24 hours</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Success Rate</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {apiMetrics?.successRate?.toFixed(1) || '0'}%
            </div>
            <div className="text-xs text-muted-foreground">API responses</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Avg Response</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {apiMetrics?.avgResponseTime || 0}ms
            </div>
            <div className="text-xs text-muted-foreground">Response time</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Failed Calls</span>
            </div>
            <div className="text-2xl font-bold mt-2">
              {apiMetrics?.failedRequests || 0}
            </div>
            <div className="text-xs text-muted-foreground">Errors/failures</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent API Calls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent API Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentApiCalls?.map((apiCall) => (
              <div key={apiCall.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={
                    !apiCall.response_status ? 'secondary' :
                    apiCall.response_status < 400 ? 'default' : 'destructive'
                  }>
                    {apiCall.http_method}
                  </Badge>
                  <div>
                    <p className="font-medium truncate max-w-md">{apiCall.endpoint_url}</p>
                    <p className="text-sm text-muted-foreground">
                      {apiCall.bank_api_endpoint || 'Internal API'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {apiCall.response_status || 'Pending'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {apiCall.response_time_ms}ms
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(apiCall.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionBankApiMonitoring;
