
import { Transaction, TransactionStatus } from '@/stores/transactionStore';
import { subDays, isWithinInterval, startOfDay, endOfDay, format, isValid } from 'date-fns';

// Get transactions by date range
export const getTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
) => {
  if (!isValid(startDate) || !isValid(endDate)) {
    console.error('Invalid date range provided', { startDate, endDate });
    return [];
  }
  
  return transactions.filter((transaction) => {
    const txDate = new Date(transaction.date);
    if (!isValid(txDate)) return false;
    
    return isWithinInterval(txDate, { start: startDate, end: endDate });
  });
};

// Get today's transactions
export const getTodayTransactions = (transactions: Transaction[]) => {
  const today = new Date();
  return getTransactionsByDateRange(
    transactions,
    startOfDay(today),
    endOfDay(today)
  );
};

// Get yesterday's transactions
export const getYesterdayTransactions = (transactions: Transaction[]) => {
  const yesterday = subDays(new Date(), 1);
  return getTransactionsByDateRange(
    transactions,
    startOfDay(yesterday),
    endOfDay(yesterday)
  );
};

// Get transactions for last 7 days
export const getLastWeekTransactions = (transactions: Transaction[]) => {
  const today = new Date();
  const lastWeek = subDays(today, 7);
  return getTransactionsByDateRange(transactions, lastWeek, today);
};

// Get transactions for last 30 days
export const getLastMonthTransactions = (transactions: Transaction[]) => {
  const today = new Date();
  const lastMonth = subDays(today, 30);
  return getTransactionsByDateRange(transactions, lastMonth, today);
};

// Calculate total revenue from transactions
export const calculateTotalRevenue = (transactions: Transaction[]) => {
  return transactions.reduce((total, transaction) => {
    // Skip failed transactions
    if (transaction.status === 'failed' || transaction.status === 'declined') {
      return total;
    }
    
    const cleanAmount = transaction.amount.replace(/[^0-9.-]+/g, '');
    const amount = parseFloat(cleanAmount);
    return !isNaN(amount) ? total + amount : total;
  }, 0);
};

// Calculate average transaction value
export const calculateAvgTransactionValue = (transactions: Transaction[]) => {
  const successfulTxns = transactions.filter(
    t => t.status === 'successful' || t.status === 'settled'
  );
  
  if (successfulTxns.length === 0) return 0;
  
  const totalRevenue = calculateTotalRevenue(successfulTxns);
  return totalRevenue / successfulTxns.length;
};

// Calculate success rate
export const calculateSuccessRate = (transactions: Transaction[]) => {
  if (transactions.length === 0) return 0;
  
  const successfulTransactions = transactions.filter(
    t => t.status === 'successful' || t.status === 'settled'
  );
  
  return (successfulTransactions.length / transactions.length) * 100;
};

// Get payment method distribution
export const getPaymentMethodDistribution = (transactions: Transaction[]) => {
  const distribution: Record<string, number> = {};
  
  transactions.forEach(transaction => {
    const method = transaction.paymentMethod;
    distribution[method] = (distribution[method] || 0) + 1;
  });
  
  return distribution;
};

// Get transactions by status
export const getTransactionsByStatus = (transactions: Transaction[], status: TransactionStatus) => {
  return transactions.filter(t => t.status === status);
};

// Calculate growth compared to previous period
export const calculateGrowthRate = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Get hourly distribution of transactions
export const getHourlyDistribution = (transactions: Transaction[]) => {
  const hourlyDistribution: number[] = Array(24).fill(0);
  
  transactions.forEach(transaction => {
    const txDate = new Date(transaction.date);
    if (isValid(txDate)) {
      const hour = txDate.getHours();
      hourlyDistribution[hour]++;
    }
  });
  
  return hourlyDistribution;
};

// Get peak transaction time
export const getPeakTransactionHour = (transactions: Transaction[]) => {
  const hourly = getHourlyDistribution(transactions);
  let peakHour = 0;
  let peakCount = 0;
  
  hourly.forEach((count, hour) => {
    if (count > peakCount) {
      peakCount = count;
      peakHour = hour;
    }
  });
  
  return { hour: peakHour, count: peakCount };
};

// Get customer statistics
export const getCustomerStatistics = (transactions: Transaction[]) => {
  const uniqueCustomers = new Set(transactions.map(t => t.customer)).size;
  const transactionsPerCustomer = uniqueCustomers > 0 
    ? transactions.length / uniqueCustomers 
    : 0;
    
  return { uniqueCustomers, transactionsPerCustomer };
};

// Generate analytics summary for dashboard
export const generateAnalyticsSummary = (transactions: Transaction[]) => {
  const todayTxns = getTodayTransactions(transactions);
  const yesterdayTxns = getYesterdayTransactions(transactions);
  const lastWeekTxns = getLastWeekTransactions(transactions);
  const lastMonthTxns = getLastMonthTransactions(transactions);
  
  // Calculate revenue
  const todayRevenue = calculateTotalRevenue(todayTxns);
  const yesterdayRevenue = calculateTotalRevenue(yesterdayTxns);
  const weeklyRevenue = calculateTotalRevenue(lastWeekTxns);
  const monthlyRevenue = calculateTotalRevenue(lastMonthTxns);
  
  // Calculate growth rates
  const dailyRevenueGrowth = calculateGrowthRate(todayRevenue, yesterdayRevenue);
  
  // Calculate payment method distribution
  const paymentMethods = getPaymentMethodDistribution(lastMonthTxns);
  
  // Get customer stats
  const customerStats = getCustomerStatistics(lastMonthTxns);
  
  // Success rates
  const dailySuccessRate = calculateSuccessRate(todayTxns);
  const monthlySuccessRate = calculateSuccessRate(lastMonthTxns);
  
  // Average transaction value
  const avgTransactionValue = calculateAvgTransactionValue(lastMonthTxns);
  
  // Get peak transaction hour
  const peakHour = getPeakTransactionHour(lastMonthTxns);
  
  return {
    revenue: {
      today: todayRevenue,
      yesterday: yesterdayRevenue,
      weekly: weeklyRevenue,
      monthly: monthlyRevenue,
      dailyGrowth: dailyRevenueGrowth,
    },
    transactions: {
      today: todayTxns.length,
      yesterday: yesterdayTxns.length,
      weekly: lastWeekTxns.length,
      monthly: lastMonthTxns.length,
      dailyGrowth: calculateGrowthRate(todayTxns.length, yesterdayTxns.length),
    },
    customers: {
      unique: customerStats.uniqueCustomers,
      averageTransactions: customerStats.transactionsPerCustomer,
    },
    performance: {
      dailySuccessRate,
      monthlySuccessRate,
      avgTransactionValue,
      peakHour,
    },
    paymentMethods,
  };
};
