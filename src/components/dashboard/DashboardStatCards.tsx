
import React from 'react';
import StatCard from '@/components/StatCard';
import { DollarSign, CreditCard, Percent, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTransactionStore } from '@/stores/transactionStore';
import { generateAnalyticsSummary, calculateGrowthRate } from '@/utils/analyticsUtils';

const DashboardStatCards = () => {
  const { transactions } = useTransactionStore();
  
  // Generate analytics summary from transactions
  const analytics = React.useMemo(() => generateAnalyticsSummary(transactions), [transactions]);
  
  // Calculate pay-in and pay-out totals
  const { payInTotal, payOutTotal, todayPayIn, todayPayOut } = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    const payIn = transactions
      .filter(txn => 
        (txn.status === 'successful' || txn.status === 'settled') && 
        !txn.walletTransactionType?.includes('withdrawal')
      )
      .reduce((sum, txn) => sum + (typeof txn.amount === 'string' ? parseFloat(txn.amount) : Number(txn.amount)), 0);
      
    const payOut = transactions
      .filter(txn => 
        (txn.status === 'successful' || txn.status === 'settled') && 
        txn.walletTransactionType?.includes('withdrawal')
      )
      .reduce((sum, txn) => sum + (typeof txn.amount === 'string' ? parseFloat(txn.amount) : Number(txn.amount)), 0);

    // Calculate today's pay-in and pay-out
    const todayIn = transactions
      .filter(txn => 
        (txn.status === 'successful' || txn.status === 'settled') && 
        !txn.walletTransactionType?.includes('withdrawal') &&
        new Date(txn.date).getTime() >= todayTimestamp
      )
      .reduce((sum, txn) => sum + (typeof txn.amount === 'string' ? parseFloat(txn.amount) : Number(txn.amount)), 0);
      
    const todayOut = transactions
      .filter(txn => 
        (txn.status === 'successful' || txn.status === 'settled') && 
        txn.walletTransactionType?.includes('withdrawal') &&
        new Date(txn.date).getTime() >= todayTimestamp
      )
      .reduce((sum, txn) => sum + (typeof txn.amount === 'string' ? parseFloat(txn.amount) : Number(txn.amount)), 0);
      
    return { 
      payInTotal: payIn, 
      payOutTotal: payOut,
      todayPayIn: todayIn,
      todayPayOut: todayOut
    };
  }, [transactions]);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
      <StatCard
        title="Total Revenue"
        value={`₹${analytics.revenue.monthly.toLocaleString('en-IN')}`}
        icon={<DollarSign className="h-4 w-4" />}
        trend={{ value: analytics.revenue.dailyGrowth, isPositive: analytics.revenue.dailyGrowth > 0 }}
      />
      
      <StatCard
        title="Today's Pay-in"
        value={`₹${todayPayIn.toLocaleString('en-IN')}`}
        icon={<ArrowRight className="h-4 w-4" />}
        trend={{ value: 0, isPositive: true }}
        className="bg-green-50 border-green-100"
        iconBackground="bg-green-100"
        iconColor="text-green-600"
      />
      
      <StatCard
        title="Today's Pay-out"
        value={`₹${todayPayOut.toLocaleString('en-IN')}`}
        icon={<ArrowLeft className="h-4 w-4" />}
        trend={{ value: 0, isPositive: false }}
        className="bg-red-50 border-red-100"
        iconBackground="bg-red-100"
        iconColor="text-red-600"
      />
      
      <StatCard
        title="Transactions"
        value={analytics.transactions.monthly.toString()}
        icon={<CreditCard className="h-4 w-4" />}
        trend={{ value: analytics.transactions.dailyGrowth, isPositive: analytics.transactions.dailyGrowth > 0 }}
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
  );
};

export default DashboardStatCards;
