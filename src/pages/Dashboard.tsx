
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/StatCard';
import TransactionCard from '@/components/TransactionCard';
import PaymentFlow from '@/components/PaymentFlow';
import Navbar from '@/components/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, CreditCard, ArrowUpRight, ArrowDownRight, Users, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTransactionStore, Transaction } from '@/stores/transactionStore';
import { Separator } from '@/components/ui/separator';

// Static data to prevent recomputation
const chartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const RevenueChart = React.memo(() => (
  <div className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            color: "hsl(var(--card-foreground))"
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ strokeWidth: 2, r: 4, fill: "hsl(var(--background))" }}
          activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
));

RevenueChart.displayName = 'RevenueChart';

interface RecentTransactionsListProps {
  transactions: Transaction[];
}

const RecentTransactionsList = React.memo(({ transactions }: RecentTransactionsListProps) => (
  <div className="space-y-4">
    {transactions.length > 0 ? (
      transactions.map((transaction) => (
        <TransactionCard key={transaction.id} {...transaction} />
      ))
    ) : (
      <div className="text-center py-12 border rounded-lg bg-secondary/30">
        <p className="text-muted-foreground">No transactions yet</p>
      </div>
    )}
  </div>
));

RecentTransactionsList.displayName = 'RecentTransactionsList';

const Dashboard = () => {
  const { transactions, userRole } = useTransactionStore();
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? 'admin' : 'merchant');
  
  const stats = useMemo(() => {
    const successfulTxns = transactions.filter(t => t.status === 'successful');
    
    let revenue = 0;
    for (let i = 0; i < successfulTxns.length; i++) {
      const t = successfulTxns[i];
      const cleanAmount = t.amount.replace(/[^0-9.-]+/g, '');
      const num = Number(cleanAmount);
      if (!isNaN(num)) {
        revenue += num;
      }
    }
    
    const customerEmails = new Set();
    transactions.forEach(t => {
      if (t.customer) {
        customerEmails.add(t.customer);
      }
    });

    const avgTxn = successfulTxns.length > 0 ? revenue / successfulTxns.length : 0;
    
    return { 
      totalRevenue: revenue, 
      uniqueCustomers: customerEmails.size, 
      avgTransaction: avgTxn 
    };
  }, [transactions]);
  
  const recentTxns = useMemo(() => {
    return [...transactions].slice(0, 4);
  }, [transactions]);

  const { totalRevenue, uniqueCustomers, avgTransaction } = stats;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="content-wrapper">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-description">
              {userRole === 'admin' ? 'Admin Control Panel' : 'Merchant Dashboard'}
            </p>
          </div>
          
          {userRole === 'admin' && (
            <Tabs 
              defaultValue="admin" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-[180px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="merchant">Merchant</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString('en-IN')}`}
            icon={<DollarSign className="h-4 w-4" />}
            trend={{ value: transactions.length > 0 ? 12.8 : 0, isPositive: true }}
          />
          
          <StatCard
            title="Transactions"
            value={transactions.length.toString()}
            icon={<CreditCard className="h-4 w-4" />}
            trend={{ value: transactions.length > 0 ? 8.3 : 0, isPositive: true }}
          />
          
          <StatCard
            title="Customers"
            value={uniqueCustomers.toString()}
            icon={<Users className="h-4 w-4" />}
            trend={{ value: uniqueCustomers > 0 ? 2.1 : 0, isPositive: true }}
          />
          
          <StatCard
            title="Avg. Transaction"
            value={`₹${avgTransaction.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            icon={<BarChart3 className="h-4 w-4" />}
            trend={{ value: avgTransaction > 0 ? 1.2 : 0, isPositive: false }}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
              <CardDescription>Daily transaction volume</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-1">
              <RevenueChart />
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <CardDescription>24 hours performance</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-emerald-500/5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                    <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Incoming</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                  <p className="text-emerald-500 font-semibold">+₹{totalRevenue.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="flex items-center p-3 bg-rose-500/5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mr-3">
                    <ArrowDownRight className="h-5 w-5 text-rose-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Outgoing</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                  <p className="text-rose-500 font-semibold">-₹0</p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="px-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Available Balance</div>
                    <div className="text-xl font-semibold">₹{totalRevenue.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <h2 className="section-heading">Recent Transactions</h2>
            <RecentTransactionsList transactions={recentTxns} />
          </div>
          
          <div className="lg:col-span-2">
            <h2 className="section-heading">Quick Payment</h2>
            <Card className="dashboard-card border border-border/50">
              <CardContent className="p-4">
                <PaymentFlow />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
