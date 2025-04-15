
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import StatCard from '@/components/StatCard';
import TransactionCard from '@/components/TransactionCard';
import PaymentFlow from '@/components/PaymentFlow';
import { Separator } from '@/components/ui/separator';
import AnalyticsChart from '@/components/AnalyticsChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, CreditCard, ArrowUpRight, ArrowDownRight, Users, DollarSign, Percent, Clock, ArrowRight } from 'lucide-react';
import { useTransactionStore, Transaction } from '@/stores/transactionStore';
import { Button } from '@/components/ui/button';
import { 
  generateAnalyticsSummary, 
  getLastMonthTransactions, 
  calculateGrowthRate 
} from '@/utils/analyticsUtils';

// Static data for additional charts (will be replaced with real data)
const paymentMethodData = [
  { name: 'UPI', value: 55 },
  { name: 'Card', value: 30 },
  { name: 'Netbanking', value: 10 },
  { name: 'Wallet', value: 5 },
];

const RecentTransactionsList = React.memo(({ transactions }: { transactions: Transaction[] }) => (
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
  
  // Generate analytics summary from transactions
  const analytics = useMemo(() => generateAnalyticsSummary(transactions), [transactions]);
  
  // Get recent transactions
  const recentTxns = useMemo(() => {
    return [...transactions].slice(0, 4);
  }, [transactions]);

  return (
    <div className="min-h-screen bg-background">
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
            value={`₹${analytics.revenue.monthly.toLocaleString('en-IN')}`}
            icon={<DollarSign className="h-4 w-4" />}
            trend={{ value: analytics.revenue.dailyGrowth, isPositive: analytics.revenue.dailyGrowth > 0 }}
          />
          
          <StatCard
            title="Transactions"
            value={analytics.transactions.monthly.toString()}
            icon={<CreditCard className="h-4 w-4" />}
            trend={{ value: analytics.transactions.dailyGrowth, isPositive: analytics.transactions.dailyGrowth > 0 }}
          />
          
          <StatCard
            title="Customers"
            value={analytics.customers.unique.toString()}
            icon={<Users className="h-4 w-4" />}
            trend={{ value: analytics.customers.unique > 0 ? 2.1 : 0, isPositive: true }}
          />
          
          <StatCard
            title="Success Rate"
            value={`${analytics.performance.monthlySuccessRate.toFixed(1)}%`}
            icon={<Percent className="h-4 w-4" />}
            trend={{ 
              value: calculateGrowthRate(
                analytics.performance.dailySuccessRate, 
                analytics.performance.monthlySuccessRate
              ), 
              isPositive: analytics.performance.dailySuccessRate >= analytics.performance.monthlySuccessRate 
            }}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <AnalyticsChart 
            transactions={transactions} 
            className="lg:col-span-2 dashboard-card"
          />
          
          <Card className="dashboard-card backdrop-blur-sm shadow-lg border-0">
            <CardHeader className="pb-2 bg-gradient-to-r from-background to-secondary/10">
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <CardDescription>24 hours performance</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-emerald-500/5 rounded-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                    <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Incoming</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                  <p className="text-emerald-500 font-semibold">+₹{analytics.revenue.today.toLocaleString('en-IN')}</p>
                </div>
                
                <div className="flex items-center p-3 bg-amber-500/5 rounded-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Avg. Processing</p>
                    <p className="text-xs text-muted-foreground">Time</p>
                  </div>
                  <p className="font-semibold">2.3s</p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="px-3">
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Total Balance</div>
                      <div className="text-xl font-semibold">₹{analytics.revenue.monthly.toLocaleString('en-IN')}</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Avg. Transaction</div>
                      <div className="font-medium">₹{analytics.performance.avgTransactionValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="section-heading">Recent Transactions</h2>
              <Link to="/transactions">
                <Button variant="outline" size="sm" className="gap-1 hover:bg-primary/10 hover:text-primary">
                  View All 
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <RecentTransactionsList transactions={recentTxns} />
          </div>
          
          <div className="lg:col-span-2">
            <h2 className="section-heading">Quick Payment</h2>
            <Card className="dashboard-card backdrop-blur-sm shadow-lg border-0">
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

export default Dashboard;
