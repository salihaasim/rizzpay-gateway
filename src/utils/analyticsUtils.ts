
import { Transaction } from '@/stores/transactionStore';

// Function to get transactions from the last 30 days
export const getLastMonthTransactions = (transactions: Transaction[]): Transaction[] => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return transactions.filter(txn => {
    const txnDate = new Date(txn.date);
    return txnDate >= thirtyDaysAgo;
  });
};

// Calculate growth rate between two values
export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Generate the analytics summary for the dashboard
export const generateAnalyticsSummary = (transactions: Transaction[]) => {
  // Filter transactions from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayTxns = transactions.filter(txn => {
    const txnDate = new Date(txn.date);
    txnDate.setHours(0, 0, 0, 0);
    return txnDate.getTime() === today.getTime();
  });
  
  // Filter transactions from last 30 days
  const monthTxns = getLastMonthTransactions(transactions);
  
  // Calculate totals for today
  const todayTotal = todayTxns.reduce((sum, txn) => sum + txn.amount, 0);
  const todaySuccessful = todayTxns.filter(txn => txn.status === 'completed').length;
  const todayCount = todayTxns.length;
  
  // Calculate totals for month
  const monthlyTotal = monthTxns.reduce((sum, txn) => sum + txn.amount, 0);
  const monthlySuccessful = monthTxns.filter(txn => txn.status === 'completed').length;
  const monthlyCount = monthTxns.length;
  
  // Calculate success rates
  const dailySuccessRate = todayCount > 0 ? (todaySuccessful / todayCount) * 100 : 0;
  const monthlySuccessRate = monthlyCount > 0 ? (monthlySuccessful / monthlyCount) * 100 : 0;
  
  // Calculate daily growth rate for revenue
  const yesterdayTxns = transactions.filter(txn => {
    const txnDate = new Date(txn.date);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    txnDate.setHours(0, 0, 0, 0);
    return txnDate.getTime() === yesterday.getTime();
  });
  
  const yesterdayTotal = yesterdayTxns.reduce((sum, txn) => sum + txn.amount, 0);
  const revenueGrowthDaily = calculateGrowthRate(todayTotal, yesterdayTotal);
  
  // Calculate daily growth rate for transactions
  const yesterdayCount = yesterdayTxns.length;
  const txnGrowthDaily = calculateGrowthRate(todayCount, yesterdayCount);
  
  // Get unique customers
  const uniqueCustomers = new Set(monthTxns.map(txn => txn.customerId)).size;
  
  // Calculate average transaction value
  const avgTxnValue = monthlyCount > 0 ? monthlyTotal / monthlyCount : 0;
  
  // Generate and return the analytics summary
  return {
    revenue: {
      today: todayTotal,
      monthly: monthlyTotal,
      dailyGrowth: revenueGrowthDaily
    },
    transactions: {
      today: todayCount,
      monthly: monthlyCount,
      dailyGrowth: txnGrowthDaily
    },
    customers: {
      unique: uniqueCustomers
    },
    performance: {
      dailySuccessRate,
      monthlySuccessRate,
      avgTransactionValue: avgTxnValue
    }
  };
};
