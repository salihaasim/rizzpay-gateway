
import { Transaction } from '@/stores/transactionStore';
import { format, isValid, parseISO } from 'date-fns';
import { TimeFrame } from './ChartHeader';

// Generate chart data based on timeframe
export const generateTimeFrameData = (transactions: Transaction[], timeFrame: TimeFrame) => {
  const today = new Date();
  let interval: Date[] = [];
  let dateFormat = '';
  
  switch (timeFrame) {
    case 'day':
      interval = Array.from({ length: 24 }, (_, i) => {
        const date = new Date(today);
        date.setHours(i, 0, 0, 0);
        return date;
      });
      dateFormat = 'HH:mm';
      break;
    case 'week':
      interval = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - 6 + i);
        return date;
      });
      dateFormat = 'EEE';
      break;
    case 'month':
      interval = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - 29 + i);
        return date;
      });
      dateFormat = 'MMM dd';
      break;
  }
  
  const data = interval.map(date => ({
    name: isValid(date) ? format(date, dateFormat) : `Invalid Date`,
    revenue: 0,
    transactions: 0,
    timestamp: date.getTime(),
  }));
  
  transactions.forEach(transaction => {
    // Ensure we're working with valid date objects
    let txDate = new Date(transaction.date);
    
    // If the date string couldn't be parsed, try using parseISO
    if (!isValid(txDate) && typeof transaction.date === 'string') {
      txDate = parseISO(transaction.date);
    }
    
    if (!isValid(txDate)) {
      console.warn('Invalid transaction date:', transaction.date);
      return;
    }
    
    const txTimestamp = txDate.getTime();
    
    if (transaction.status === 'failed' || transaction.status === 'declined') {
      return;
    }
    
    const dataEntry = data.find(entry => {
      if (!entry.timestamp) return false;
      
      const entryDate = new Date(entry.timestamp);
      if (!isValid(entryDate)) return false;
      
      if (timeFrame === 'day') {
        return txDate.getHours() === entryDate.getHours() &&
               txDate.getDate() === entryDate.getDate();
      } else {
        return txDate.getDate() === entryDate.getDate() && 
               txDate.getMonth() === entryDate.getMonth();
      }
    });
    
    if (dataEntry) {
      // Handle both string and number amount formats
      let amount = 0;
      if (typeof transaction.amount === 'string') {
        // Remove currency symbols and commas
        const amountStr = transaction.amount.replace(/[^0-9.-]+/g, '');
        amount = parseFloat(amountStr);
      } else if (typeof transaction.amount === 'number') {
        amount = transaction.amount;
      }
      
      if (!isNaN(amount)) {
        dataEntry.revenue += amount;
        dataEntry.transactions += 1;
      }
    }
  });
  
  return data;
};

// Calculate average revenue from chart data
export const calculateAverageRevenue = (data: any[]) => {
  if (data.length === 0) return 0;
  
  // Only consider entries with transactions
  const entriesWithRevenue = data.filter(item => item.transactions > 0);
  if (entriesWithRevenue.length === 0) return 0;
  
  const totalRevenue = entriesWithRevenue.reduce((sum, item) => sum + item.revenue, 0);
  return totalRevenue / entriesWithRevenue.length;
};

// Find the peak transaction period from chart data
export const findPeakTransactionPeriod = (data: any[]) => {
  if (data.length === 0) return null;
  return data.reduce((max, item) => 
    item.transactions > max.transactions ? item : max, data[0]);
};
