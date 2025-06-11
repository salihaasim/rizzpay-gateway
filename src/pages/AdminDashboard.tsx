
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';
import { Users, CreditCard, TrendingUp, DollarSign } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6" style={{ backgroundColor: 'white' }}>
        <div style={{ backgroundColor: 'white' }}>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Manage merchants and monitor platform performance
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-4" style={{ backgroundColor: 'white' }}>
          <Card className="admin-stat-card" style={{ backgroundColor: 'white' }}>
            <CardHeader className="pb-3" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Total Merchants</CardTitle>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent style={{ backgroundColor: 'white' }}>
              <div className="text-2xl font-bold text-slate-800">4</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                12.5% this month
              </p>
            </CardContent>
          </Card>
          
          <Card className="admin-stat-card" style={{ backgroundColor: 'white' }}>
            <CardHeader className="pb-3" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent style={{ backgroundColor: 'white' }}>
              <div className="text-2xl font-bold text-slate-800">₹1.2M</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                8.2% this month
              </p>
            </CardContent>
          </Card>
          
          <Card className="admin-stat-card" style={{ backgroundColor: 'white' }}>
            <CardHeader className="pb-3" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Transactions</CardTitle>
                <CreditCard className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent style={{ backgroundColor: 'white' }}>
              <div className="text-2xl font-bold text-slate-800">5,698</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                15.3% this month
              </p>
            </CardContent>
          </Card>
          
          <Card className="admin-stat-card" style={{ backgroundColor: 'white' }}>
            <CardHeader className="pb-3" style={{ backgroundColor: 'white' }}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">Success Rate</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent style={{ backgroundColor: 'white' }}>
              <div className="text-2xl font-bold text-slate-800">98.2%</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                2.3% this month
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3" style={{ backgroundColor: 'white' }}>
          <div className="lg:col-span-2">
            <Card className="admin-card" style={{ backgroundColor: 'white' }}>
              <CardHeader className="pb-4" style={{ backgroundColor: 'white' }}>
                <CardTitle className="text-lg font-semibold text-slate-800">Transaction Overview</CardTitle>
                <p className="text-sm text-slate-600">Month-to-date transaction performance</p>
              </CardHeader>
              <CardContent style={{ backgroundColor: 'white' }}>
                <div className="h-80 w-full rounded-lg flex items-center justify-center border border-slate-200" style={{ backgroundColor: 'white' }}>
                  <p className="text-slate-500">Transaction chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="admin-card" style={{ backgroundColor: 'white' }}>
            <CardHeader className="pb-4" style={{ backgroundColor: 'white' }}>
              <CardTitle className="text-lg font-semibold text-slate-800">Payment Methods</CardTitle>
              <p className="text-sm text-slate-600">Distribution by payment type</p>
            </CardHeader>
            <CardContent style={{ backgroundColor: 'white' }}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-700">UPI: 55%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-700">Cards: 35%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-slate-700">Wallet: 10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6" style={{ backgroundColor: 'white' }}>
          <Tabs defaultValue="overview" style={{ backgroundColor: 'white' }}>
            <TabsList className="admin-tabs-list" style={{ backgroundColor: 'white' }}>
              <TabsTrigger value="overview" className="admin-tabs-trigger">Overview</TabsTrigger>
              <TabsTrigger value="revenue" className="admin-tabs-trigger">Revenue Analytics</TabsTrigger>
              <TabsTrigger value="reports" className="admin-tabs-trigger">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6" style={{ backgroundColor: 'white' }}>
              <div className="grid gap-6 md:grid-cols-2" style={{ backgroundColor: 'white' }}>
                <Card className="admin-card" style={{ backgroundColor: 'white' }}>
                  <CardHeader style={{ backgroundColor: 'white' }}>
                    <CardTitle className="text-lg font-semibold text-slate-800">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent style={{ backgroundColor: 'white' }}>
                    <div className="space-y-4">
                      <p className="text-slate-600">Transaction data would be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="admin-card" style={{ backgroundColor: 'white' }}>
                  <CardHeader style={{ backgroundColor: 'white' }}>
                    <CardTitle className="text-lg font-semibold text-slate-800">System Status</CardTitle>
                  </CardHeader>
                  <CardContent style={{ backgroundColor: 'white' }}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">API Gateway</span>
                        <span className="text-green-600 font-medium">Operational</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Payment Processor</span>
                        <span className="text-green-600 font-medium">Operational</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Database</span>
                        <span className="text-green-600 font-medium">Operational</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Authentication</span>
                        <span className="text-green-600 font-medium">Operational</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="mt-6" style={{ backgroundColor: 'white' }}>
              <div style={{ backgroundColor: 'white' }}>
                <RevenueChart />
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6" style={{ backgroundColor: 'white' }}>
              <Card className="admin-card" style={{ backgroundColor: 'white' }}>
                <CardHeader style={{ backgroundColor: 'white' }}>
                  <CardTitle className="text-lg font-semibold text-slate-800">Reports</CardTitle>
                </CardHeader>
                <CardContent style={{ backgroundColor: 'white' }}>
                  <div className="space-y-4">
                    <div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center hover:border-blue-300 transition-colors" style={{ backgroundColor: 'white' }}>
                      <span className="font-medium text-slate-800">Daily Transaction Summary</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">Download</button>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center hover:border-blue-300 transition-colors" style={{ backgroundColor: 'white' }}>
                      <span className="font-medium text-slate-800">Monthly Revenue Report</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">Download</button>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center hover:border-blue-300 transition-colors" style={{ backgroundColor: 'white' }}>
                      <span className="font-medium text-slate-800">Merchant Activity Log</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">Download</button>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center hover:border-blue-300 transition-colors" style={{ backgroundColor: 'white' }}>
                      <span className="font-medium text-slate-800">System Performance</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">Download</button>
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
