import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';
import { Users, CreditCard, TrendingUp, DollarSign, Search, Eye, FileText } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 bg-white">
        <div className="bg-white">
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Manage merchants and monitor platform performance
          </p>
        </div>
        
        {/* Merchant Accounts Section */}
        <Card className="admin-card bg-white border-2 border-black">
          <CardHeader className="pb-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Merchant Accounts
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search merchants..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
            
            {/* Merchant Tabs */}
            <div className="mt-4">
              <Tabs defaultValue="all" className="bg-white">
                <TabsList className="bg-white border border-gray-200">
                  <TabsTrigger value="all" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">All Merchants</TabsTrigger>
                  <TabsTrigger value="pending" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">Pending KYC</TabsTrigger>
                  <TabsTrigger value="approved" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">Approved KYC</TabsTrigger>
                  <TabsTrigger value="rejected" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">Rejected KYC</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent className="bg-white">
            {/* Merchant Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Company</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Join Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Wallet Balance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">KYC Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-black">Merchant 1</td>
                    <td className="py-3 px-4 text-gray-600">merchant1@example.com</td>
                    <td className="py-3 px-4 text-gray-600">Company 1</td>
                    <td className="py-3 px-4 text-gray-600">1/1/2025</td>
                    <td className="py-3 px-4 text-black">₹0.00</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Pending</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View KYC Docs
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-black">Merchant 2</td>
                    <td className="py-3 px-4 text-gray-600">merchant2@example.com</td>
                    <td className="py-3 px-4 text-gray-600">Company 2</td>
                    <td className="py-3 px-4 text-gray-600">1/2/2025</td>
                    <td className="py-3 px-4 text-black">₹0.00</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Approved</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View KYC Docs
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-black">Merchant 3</td>
                    <td className="py-3 px-4 text-gray-600">merchant3@example.com</td>
                    <td className="py-3 px-4 text-gray-600">Company 3</td>
                    <td className="py-3 px-4 text-gray-600">1/3/2025</td>
                    <td className="py-3 px-4 text-black">₹0.00</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Rejected</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View KYC Docs
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-black">Merchant 4</td>
                    <td className="py-3 px-4 text-gray-600">merchant4@example.com</td>
                    <td className="py-3 px-4 text-gray-600">Company 4</td>
                    <td className="py-3 px-4 text-gray-600">1/4/2025</td>
                    <td className="py-3 px-4 text-black">₹0.00</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Not Submitted</span>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline" className="text-xs">
                        View Details
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Wallet Statistics */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-black mb-4">Wallet Statistics</h3>
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">Total Merchants</div>
                    <div className="text-2xl font-bold text-black">4</div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">Total wallet balance</div>
                    <div className="text-2xl font-bold text-black">₹0.00</div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">Active Companies</div>
                    <div className="text-2xl font-bold text-black">4</div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-600">Average Balance</div>
                    <div className="text-2xl font-bold text-black">₹0.00</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Escrow Account Overview Section */}
        <Card className="admin-card bg-white border-2 border-black">
          <CardHeader className="pb-4 bg-white">
            <CardTitle className="text-lg font-semibold text-black">Escrow Account Overview</CardTitle>
            <p className="text-sm text-gray-600">Monitor your platform's escrow balance and transaction activity</p>
            
            {/* Escrow Tabs */}
            <div className="mt-4">
              <Tabs defaultValue="overview" className="bg-white">
                <TabsList className="bg-white border border-gray-200">
                  <TabsTrigger value="overview" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">Overview</TabsTrigger>
                  <TabsTrigger value="bank" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">Bank Connection</TabsTrigger>
                  <TabsTrigger value="transactions" className="text-black data-[state=active]:bg-black data-[state=active]:text-white">Transactions</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent className="bg-white">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {/* Volume Statistics */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-black mb-4">Volume Statistics</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm text-gray-600">Weekly</div>
                      <div className="text-2xl font-bold text-black">₹4,50,000</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Monthly</div>
                      <div className="text-2xl font-bold text-black">₹21,00,000</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-base font-semibold text-black mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-black">TR123456</div>
                          <div className="text-sm text-gray-600">01 Apr, 10:15 am</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-medium">+ ₹25,000</div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-black">TR123455</div>
                          <div className="text-sm text-gray-600">01 Apr, 09:30 am</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-600 font-medium">- ₹15,000</div>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Pending</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-black">TR123454</div>
                          <div className="text-sm text-gray-600">31 Mar, 04:45 pm</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-medium">+ ₹35,000</div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                {/* Quick Actions */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-black mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full bg-white border-2 border-black text-black hover:bg-black hover:text-white">
                      <FileText className="h-4 w-4 mr-2" />
                      Connect Bank
                    </Button>
                    <Button className="w-full bg-white border-2 border-black text-black hover:bg-black hover:text-white">
                      <Eye className="h-4 w-4 mr-2" />
                      View All Transactions
                    </Button>
                  </div>
                </div>

                {/* Bank API Integration Info */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-blue-900">Bank API Integration</h4>
                  </div>
                  <p className="text-sm text-blue-800 mb-2">
                    The escrow account is integrated with HDFC Bank's NEFT API for secure and reliable transfers. All transactions are processed according to RBI guidelines.
                  </p>
                  <Button variant="link" className="text-blue-600 text-sm p-0 h-auto">
                    See NEFT Integration Guide
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Original Dashboard Stats */}
        <div className="grid gap-6 md:grid-cols-4 bg-white">
          <Card className="admin-card bg-white border-2 border-black">
            <CardHeader className="pb-3 bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-black">Total Merchants</CardTitle>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold text-black">4</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                12.5% this month
              </p>
            </CardContent>
          </Card>
          
          <Card className="admin-card bg-white border-2 border-black">
            <CardHeader className="pb-3 bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-black">Total Revenue</CardTitle>
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold text-black">₹1.2M</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                8.2% this month
              </p>
            </CardContent>
          </Card>
          
          <Card className="admin-card bg-white border-2 border-black">
            <CardHeader className="pb-3 bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-black">Transactions</CardTitle>
                <CreditCard className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold text-black">5,698</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                15.3% this month
              </p>
            </CardContent>
          </Card>
          
          <Card className="admin-card bg-white border-2 border-black">
            <CardHeader className="pb-3 bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-black">Success Rate</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="text-2xl font-bold text-black">98.2%</div>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                2.3% this month
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3 bg-white">
          <div className="lg:col-span-2">
            <Card className="admin-card bg-white border-2 border-black">
              <CardHeader className="pb-4 bg-white">
                <CardTitle className="text-lg font-semibold text-black">Transaction Overview</CardTitle>
                <p className="text-sm text-slate-600">Month-to-date transaction performance</p>
              </CardHeader>
              <CardContent className="bg-white">
                <div className="h-80 w-full rounded-lg flex items-center justify-center border-2 border-black bg-white">
                  <p className="text-slate-500">Transaction chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="admin-card bg-white border-2 border-black">
            <CardHeader className="pb-4 bg-white">
              <CardTitle className="text-lg font-semibold text-black">Payment Methods</CardTitle>
              <p className="text-sm text-slate-600">Distribution by payment type</p>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-black">UPI: 55%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-black">Cards: 35%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-black">Wallet: 10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 bg-white">
          <Tabs defaultValue="overview" className="bg-white">
            <TabsList className="admin-tabs-list bg-white border-2 border-black">
              <TabsTrigger value="overview" className="admin-tabs-trigger text-black data-[state=active]:bg-black data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="revenue" className="admin-tabs-trigger text-black data-[state=active]:bg-black data-[state=active]:text-white">Revenue Analytics</TabsTrigger>
              <TabsTrigger value="reports" className="admin-tabs-trigger text-black data-[state=active]:bg-black data-[state=active]:text-white">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 bg-white">
              <div className="grid gap-6 md:grid-cols-2 bg-white">
                <Card className="admin-card bg-white border-2 border-black">
                  <CardHeader className="bg-white">
                    <CardTitle className="text-lg font-semibold text-black">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <div className="space-y-4">
                      <p className="text-slate-600">Transaction data would be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="admin-card bg-white border-2 border-black">
                  <CardHeader className="bg-white">
                    <CardTitle className="text-lg font-semibold text-black">System Status</CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-black">API Gateway</span>
                        <span className="text-green-600 font-medium">Operational</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-black">Payment Processor</span>
                        <span className="text-green-600 font-medium">Operational</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-black">Database</span>
                        <span className="text-green-600 font-medium">Operational</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-black">Authentication</span>
                        <span className="text-green-600 font-medium">Operational</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="mt-6 bg-white">
              <div className="bg-white">
                <RevenueChart />
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6 bg-white">
              <Card className="admin-card bg-white border-2 border-black">
                <CardHeader className="bg-white">
                  <CardTitle className="text-lg font-semibold text-black">Reports</CardTitle>
                </CardHeader>
                <CardContent className="bg-white">
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-black rounded-lg flex justify-between items-center hover:border-blue-300 transition-colors bg-white">
                      <span className="font-medium text-black">Daily Transaction Summary</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">Download</button>
                    </div>
                    <div className="p-4 border-2 border-black rounded-lg flex justify-between items-center hover:border-blue-300 transition-colors bg-white">
                      <span className="font-medium text-black">Monthly Revenue Report</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">Download</button>
                    </div>
                    <div className="p-4 border-2 border-black rounded-lg flex justify-between items-center hover:border-blue-300 transition-colors bg-white">
                      <span className="font-medium text-black">Merchant Activity Log</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">Download</button>
                    </div>
                    <div className="p-4 border-2 border-black rounded-lg flex justify-between items-center hover:border-blue-300 transition-colors bg-white">
                      <span className="font-medium text-black">System Performance</span>
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
