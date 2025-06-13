
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Database, Globe, Key, Shield, Activity, Settings } from 'lucide-react';

const AdminProductionApi: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 bg-white">
        <div className="bg-white">
          <h1 className="text-2xl font-bold text-slate-800">Production API Management</h1>
          <p className="text-slate-600 mt-1">
            Monitor and manage production API endpoints and integrations
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="admin-tabs-list bg-white border-2 border-black">
            <TabsTrigger value="overview" className="admin-tabs-trigger text-black data-[state=active]:bg-black data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="endpoints" className="admin-tabs-trigger text-black data-[state=active]:bg-black data-[state=active]:text-white">API Endpoints</TabsTrigger>
            <TabsTrigger value="health" className="admin-tabs-trigger text-black data-[state=active]:bg-black data-[state=active]:text-white">Health Monitoring</TabsTrigger>
            <TabsTrigger value="security" className="admin-tabs-trigger text-black data-[state=active]:bg-black data-[state=active]:text-white">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="admin-card bg-white border-2 border-black">
                <CardHeader className="pb-3 bg-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-black">Active APIs</CardTitle>
                    <Database className="h-5 w-5 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="text-2xl font-bold text-black">12</div>
                  <p className="text-xs text-green-600">All operational</p>
                </CardContent>
              </Card>

              <Card className="admin-card bg-white border-2 border-black">
                <CardHeader className="pb-3 bg-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-black">Response Time</CardTitle>
                    <Activity className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="text-2xl font-bold text-black">245ms</div>
                  <p className="text-xs text-green-600">Average</p>
                </CardContent>
              </Card>

              <Card className="admin-card bg-white border-2 border-black">
                <CardHeader className="pb-3 bg-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-black">Uptime</CardTitle>
                    <Globe className="h-5 w-5 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="text-2xl font-bold text-black">99.9%</div>
                  <p className="text-xs text-green-600">Last 30 days</p>
                </CardContent>
              </Card>

              <Card className="admin-card bg-white border-2 border-black">
                <CardHeader className="pb-3 bg-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-black">API Keys</CardTitle>
                    <Key className="h-5 w-5 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="text-2xl font-bold text-black">156</div>
                  <p className="text-xs text-blue-600">Active keys</p>
                </CardContent>
              </Card>
            </div>

            <Card className="admin-card bg-white border-2 border-black">
              <CardHeader className="bg-white">
                <CardTitle className="text-lg font-semibold text-black">API Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg">
                  <p className="text-gray-500">API usage chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <Card className="admin-card bg-white border-2 border-black">
              <CardHeader className="bg-white">
                <CardTitle className="text-lg font-semibold text-black">Production Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-black">/api/v1/payments</div>
                      <div className="text-sm text-gray-600">Payment processing endpoint</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-black">/api/v1/payouts</div>
                      <div className="text-sm text-gray-600">Payout management endpoint</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-black">/api/v1/webhooks</div>
                      <div className="text-sm text-gray-600">Webhook delivery endpoint</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <Card className="admin-card bg-white border-2 border-black">
              <CardHeader className="bg-white">
                <CardTitle className="text-lg font-semibold text-black">System Health</CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-black">Database Connection</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Redis Cache</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Payment Gateway</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Bank Integration</span>
                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="admin-card bg-white border-2 border-black">
              <CardHeader className="bg-white">
                <CardTitle className="text-lg font-semibold text-black">Security Overview</CardTitle>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-black">SSL Certificate</span>
                    <Badge className="bg-green-100 text-green-800">Valid</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">API Rate Limiting</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">IP Whitelist</span>
                    <Badge className="bg-blue-100 text-blue-800">Configured</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">DDoS Protection</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
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

export default AdminProductionApi;
