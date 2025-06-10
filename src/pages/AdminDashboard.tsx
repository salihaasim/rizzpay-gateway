
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of system performance and key metrics
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹24,765,453</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">243,587</div>
              <p className="text-xs text-muted-foreground">+8.2% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Merchants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,284</div>
              <p className="text-xs text-muted-foreground">+64 new this month</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>Transaction data would be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>API Gateway</span>
                        <span className="text-green-500">Operational</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Payment Processor</span>
                        <span className="text-green-500">Operational</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Database</span>
                        <span className="text-green-500">Operational</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Authentication</span>
                        <span className="text-green-500">Operational</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="mt-6">
              <RevenueChart />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md flex justify-between items-center">
                      <span className="font-medium">Daily Transaction Summary</span>
                      <button className="text-primary">Download</button>
                    </div>
                    <div className="p-4 border rounded-md flex justify-between items-center">
                      <span className="font-medium">Monthly Revenue Report</span>
                      <button className="text-primary">Download</button>
                    </div>
                    <div className="p-4 border rounded-md flex justify-between items-center">
                      <span className="font-medium">Merchant Activity Log</span>
                      <button className="text-primary">Download</button>
                    </div>
                    <div className="p-4 border rounded-md flex justify-between items-center">
                      <span className="font-medium">System Performance</span>
                      <button className="text-primary">Download</button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
