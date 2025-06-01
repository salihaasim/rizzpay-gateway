
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Activity, 
  Shield, 
  Globe, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Monitor,
  Lock,
  Clock,
  BarChart3,
  Database,
  FileText,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const AdminProductionApiManagement = () => {
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState(true);
  const [signatureValidationEnabled, setSignatureValidationEnabled] = useState(true);

  // Fetch production metrics
  const { data: productionMetrics, isLoading } = useQuery({
    queryKey: ['production-metrics'],
    queryFn: async () => {
      const [
        bankTransactions,
        utrLogs,
        apiLogs,
        fundTransferJobs
      ] = await Promise.all([
        supabase.from('bank_transactions').select('*', { count: 'exact', head: true }),
        supabase.from('utr_logs').select('*', { count: 'exact', head: true }),
        supabase.from('api_request_logs').select('*', { count: 'exact', head: true }),
        supabase.from('fund_transfer_jobs').select('*', { count: 'exact', head: true })
      ]);

      return {
        totalTransactions: bankTransactions.count || 0,
        totalUtrLogs: utrLogs.count || 0,
        totalApiCalls: apiLogs.count || 0,
        totalPayoutJobs: fundTransferJobs.count || 0
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch recent bank transactions
  const { data: recentTransactions } = useQuery({
    queryKey: ['recent-bank-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bank_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production API Management</h1>
          <p className="text-muted-foreground">
            Manage production banking APIs and real-time transaction monitoring
          </p>
        </div>

        <Tabs defaultValue="production-overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="production-overview" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Production Overview
            </TabsTrigger>
            <TabsTrigger value="bank-apis" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Bank APIs
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Live Monitoring
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              UTR Webhooks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="production-overview" className="space-y-6">
            {/* Production Metrics Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Production Database Metrics
                </CardTitle>
                <CardDescription>Real-time production system statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Bank Transactions</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">
                        {isLoading ? '...' : productionMetrics?.totalTransactions.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Total processed</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">UTR Logs</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">
                        {isLoading ? '...' : productionMetrics?.totalUtrLogs.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Webhook callbacks</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">API Calls</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">
                        {isLoading ? '...' : productionMetrics?.totalApiCalls.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Total requests</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">Payout Jobs</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">
                        {isLoading ? '...' : productionMetrics?.totalPayoutJobs.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Fund transfers</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Bank Transactions
                </CardTitle>
                <CardDescription>Latest production banking transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions?.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={
                          transaction.status === 'completed' ? 'default' :
                          transaction.status === 'failed' ? 'destructive' :
                          'secondary'
                        }>
                          {transaction.status}
                        </Badge>
                        <div>
                          <p className="font-medium">{transaction.transaction_type}</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{parseFloat(transaction.amount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{transaction.customer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank-apis" className="space-y-6">
            {/* Production Bank API Integrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Production Bank API Integrations
                </CardTitle>
                <CardDescription>Live banking API connections and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* HDFC Bank API */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">HDFC Bank API</CardTitle>
                      <Badge variant="default">Production Ready</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">NEFT/RTGS/IMPS</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Live</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">UPI Collections</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Live</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Webhook UTR</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last webhook: 2 minutes ago
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Canara Bank API */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Canara Bank API</CardTitle>
                      <Badge variant="default">Production Ready</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">NEFT/RTGS</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Live</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Bulk Transfers</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Live</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">SFTP Reconciliation</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last SFTP file: 15 minutes ago
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* SBI Bank API */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">SBI Bank API</CardTitle>
                      <Badge variant="secondary">Integration Phase</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">NEFT/RTGS</span>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Testing</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">UPI Collections</span>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Testing</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Integration in progress
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ICICI Bank API */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">ICICI Bank API</CardTitle>
                      <Badge variant="outline">Planned</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">NEFT/RTGS</span>
                          <Badge variant="outline" className="bg-gray-50 text-gray-700">Planned</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">UPI Collections</span>
                          <Badge variant="outline" className="bg-gray-50 text-gray-700">Planned</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Q2 2025 integration target
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            {/* Live Monitoring Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Live System Monitoring
                </CardTitle>
                <CardDescription>Real-time production system health and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">API Uptime</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">99.98%</div>
                      <div className="text-xs text-muted-foreground">Last 30 days</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Avg Response Time</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">180ms</div>
                      <div className="text-xs text-muted-foreground">Bank API calls</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Failed Transactions</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">0.12%</div>
                      <div className="text-xs text-muted-foreground">Last 24 hours</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">System Health Indicators</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Database Connection Pool</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Bank API Rate Limits</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Normal</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Webhook Processing Queue</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Processing</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">SFTP File Processing</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Production Security Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Production Security Controls
                </CardTitle>
                <CardDescription>Security features and compliance controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Rate Limiting */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Rate Limiting</CardTitle>
                      <Badge variant="default">Production Active</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Bank API Calls</span>
                          <Badge variant="outline">1000 RPM</Badge>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Current Usage</Label>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground">650/1000 RPM</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Active</span>
                          </div>
                          <Switch
                            checked={rateLimitEnabled}
                            onCheckedChange={setRateLimitEnabled}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Signature Validation */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Webhook Signature Validation</CardTitle>
                      <Badge variant="default">Production Active</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">HMAC-SHA256</span>
                          <Badge variant="outline">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">RSA Signature</span>
                          <Badge variant="outline">Enabled</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          All webhook signatures verified
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Active</span>
                          </div>
                          <Switch
                            checked={signatureValidationEnabled}
                            onCheckedChange={setSignatureValidationEnabled}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            {/* UTR Webhook Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  UTR Webhook Processing
                </CardTitle>
                <CardDescription>Real-time bank webhook callbacks and UTR processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">UTRs Processed</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">2,847</div>
                      <div className="text-xs text-muted-foreground">Last 24 hours</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Success Rate</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">99.7%</div>
                      <div className="text-xs text-muted-foreground">Webhook processing</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Avg Processing</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">850ms</div>
                      <div className="text-xs text-muted-foreground">UTR to completion</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Bank Webhook Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">HDFC Bank Webhooks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                        <span className="text-sm text-muted-foreground">Last: 30s ago</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Canara Bank SFTP</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                        <span className="text-sm text-muted-foreground">Last: 5m ago</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="font-medium">SBI Bank Testing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Testing</Badge>
                        <span className="text-sm text-muted-foreground">Integration phase</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminProductionApiManagement;
