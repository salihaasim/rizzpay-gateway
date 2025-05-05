
import React from 'react';
import StatCard from '@/components/StatCard';
import { DollarSign, CreditCard, Percent } from 'lucide-react';
import { useTransactionStore } from '@/stores/transactionStore';
import { generateAnalyticsSummary, calculateGrowthRate } from '@/utils/analyticsUtils';

const DashboardStatCards = () => {
  const { transactions } = useTransactionStore();
  
  // Generate analytics summary from transactions
  const analytics = React.useMemo(() => generateAnalyticsSummary(transactions), [transactions]);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
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
