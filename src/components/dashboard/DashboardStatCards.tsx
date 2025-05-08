
import React from 'react';
import StatCard from '@/components/StatCard';
import { DollarSign, CreditCard, Percent, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTransactionStore } from '@/stores/transactionStore';
import { generateAnalyticsSummary, calculateGrowthRate } from '@/utils/analyticsUtils';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {/* Current Balance Card */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-base font-medium text-gray-700 mb-2">Current Balance</h3>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">₹{(payInTotal - payOutTotal).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Total Pay-Ins Card */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-base font-medium text-gray-700 mb-2">Total Pay - Ins</h3>
          <div className="flex flex-col">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="text-sm">₹{payInTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Success</span>
              <div className="h-2 w-24 bg-gray-200 rounded self-center">
                <div className="h-full w-3/4 bg-green-500 rounded"></div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Pending</span>
              <div className="h-2 w-24 bg-gray-200 rounded self-center">
                <div className="h-full w-1/4 bg-yellow-500 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Total Payouts Card */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between mb-2">
            <h3 className="text-base font-medium text-gray-700">Total Payouts</h3>
            <span className="text-xs text-blue-600">Actions</span>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Amount</span>
              <span className="text-sm">₹{payOutTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Success</span>
              <div className="h-2 w-24 bg-gray-200 rounded self-center">
                <div className="h-full w-5/6 bg-green-500 rounded"></div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Faunt</span>
              <div className="h-2 w-24 bg-gray-200 rounded self-center">
                <div className="h-full w-1/6 bg-red-500 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Transaction Overview Card */}
      <Card className="border border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-base font-medium text-gray-700 mb-2">Transaction Overview</h3>
          <div className="h-24 w-full bg-gray-100 rounded-md flex items-center justify-center">
            <div className="h-full w-full flex items-end p-2 space-x-1">
              {[30, 45, 60, 40, 50, 70, 55].map((height, index) => (
                <div 
                  key={index} 
                  className="bg-gray-300 rounded-t" 
                  style={{ height: `${height}%`, width: '14%' }}
                ></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStatCards;
