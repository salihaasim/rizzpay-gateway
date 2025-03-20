
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/StatCard';
import TransactionCard from '@/components/TransactionCard';
import PaymentFlow from '@/components/PaymentFlow';
import Navbar from '@/components/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, CreditCard, ArrowUpRight, ArrowDownRight, Users, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const chartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const transactions = [
  { id: '8721', date: 'Today, 2:30 PM', amount: '₹12,500', paymentMethod: 'Google Pay', status: 'successful', customer: 'Ajay Sharma' },
  { id: '8720', date: 'Today, 11:15 AM', amount: '₹3,200', paymentMethod: 'UPI', status: 'pending', customer: 'Priya Patel' },
  { id: '8719', date: 'Yesterday, 5:45 PM', amount: '₹8,750', paymentMethod: 'Credit Card', status: 'successful', customer: 'Rahul Verma' },
  { id: '8718', date: 'Yesterday, 1:20 PM', amount: '₹950', paymentMethod: 'Google Pay', status: 'failed', customer: 'Neha Singh' },
] as const;

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container px-4 pt-20 pb-16 mx-auto">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Merchant Account</p>
          </div>
          
          <Tabs defaultValue="merchant" className="w-[260px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="merchant">Merchant</TabsTrigger>
              <TabsTrigger value="client">Client</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value="₹86,429"
            icon={<DollarSign className="h-4 w-4" />}
            trend={{ value: 12.8, isPositive: true }}
          />
          
          <StatCard
            title="Transactions"
            value="924"
            icon={<CreditCard className="h-4 w-4" />}
            trend={{ value: 8.3, isPositive: true }}
          />
          
          <StatCard
            title="Customers"
            value="512"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: 2.1, isPositive: true }}
          />
          
          <StatCard
            title="Avg. Transaction"
            value="₹935"
            icon={<BarChart3 className="h-4 w-4" />}
            trend={{ value: 1.2, isPositive: false }}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-0 shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
              <CardDescription>Daily transaction volume</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-1">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #f0f0f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <CardDescription>24 hours performance</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                    <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium">Incoming</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                  <p className="text-emerald-500 font-semibold ml-auto">+₹24,500</p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mr-3">
                    <ArrowDownRight className="h-5 w-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="font-medium">Outgoing</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                  <p className="text-rose-500 font-semibold ml-auto">-₹8,250</p>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Available Balance</div>
                    <div className="text-xl font-semibold">₹62,390</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <TransactionCard key={transaction.id} {...transaction} />
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6">Quick Payment</h2>
            <PaymentFlow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
