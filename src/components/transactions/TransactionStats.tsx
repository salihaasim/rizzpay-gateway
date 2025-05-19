
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Transaction, PaymentMethod } from '@/stores/transactions/types';

interface TransactionStatsProps {
  transactions: Transaction[];
}

const TransactionStats: React.FC<TransactionStatsProps> = ({ transactions }) => {
  // Calculate totals
  const getTotalAmount = (status: string) => {
    return transactions
      .filter(t => status === 'all' || t.status === status)
      .reduce((sum, t) => {
        const amount = Number(t.amount.replace(/[^0-9.-]+/g, ''));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
  };

  const successfulTotal = getTotalAmount('successful');
  const pendingTotal = getTotalAmount('pending');
  const failedTotal = getTotalAmount('failed');
  const processingTotal = getTotalAmount('processing');

  // Generate payment method data for pie chart
  const getPaymentMethodData = () => {
    const methodCounts: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      // Group similar payment methods together for cleaner display
      let method = transaction.paymentMethod;
      
      // Group similar payment methods
      if (method.includes('upi')) method = 'upi';
      else if (method.includes('card')) method = 'card';
      else if (method.includes('netbanking')) method = 'netbanking';
      else if (method.includes('neft')) method = 'neft';
      else if (method.includes('wallet')) method = 'wallet';
      else method = method.charAt(0).toUpperCase() + method.slice(1);
      
      methodCounts[method] = (methodCounts[method] || 0) + 1;
    });
    
    const colors: Record<string, string> = {
      'upi': '#34A853',
      'card': '#EA4335',
      'netbanking': '#003087',
      'neft': '#4285F4', 
      'wallet': '#FBBC05',
    };
    
    // Calculate percentages
    const total = Object.values(methodCounts).reduce((a, b) => a + b, 0);
    
    return Object.entries(methodCounts).map(([name, value]) => ({
      name: `${name} (${Math.round((value / total) * 100)}%)`,
      value,
      color: colors[name] || '#6B7280',
    }));
  };

  const paymentMethodData = getPaymentMethodData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <Card className="border-0 shadow-sm overflow-hidden lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Transaction Overview</CardTitle>
          <CardDescription>Summary of transaction status</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex gap-4 flex-wrap">
            <div className="bg-emerald-50 text-emerald-500 rounded-lg p-4 flex-1 min-w-[120px]">
              <div className="text-sm font-medium mb-1">Successful</div>
              <div className="text-2xl font-bold">₹{successfulTotal.toLocaleString('en-IN')}</div>
              <div className="text-xs text-emerald-600 mt-1">{transactions.filter(t => t.status === 'successful').length} transactions</div>
            </div>
            
            <div className="bg-blue-50 text-blue-500 rounded-lg p-4 flex-1 min-w-[120px]">
              <div className="text-sm font-medium mb-1">Processing</div>
              <div className="text-2xl font-bold">₹{processingTotal.toLocaleString('en-IN')}</div>
              <div className="text-xs text-blue-600 mt-1">{transactions.filter(t => t.status === 'processing').length} transactions</div>
            </div>
            
            <div className="bg-amber-50 text-amber-500 rounded-lg p-4 flex-1 min-w-[120px]">
              <div className="text-sm font-medium mb-1">Pending</div>
              <div className="text-2xl font-bold">₹{pendingTotal.toLocaleString('en-IN')}</div>
              <div className="text-xs text-amber-600 mt-1">{transactions.filter(t => t.status === 'pending').length} transactions</div>
            </div>
            
            <div className="bg-rose-50 text-rose-500 rounded-lg p-4 flex-1 min-w-[120px]">
              <div className="text-sm font-medium mb-1">Failed</div>
              <div className="text-2xl font-bold">₹{failedTotal.toLocaleString('en-IN')}</div>
              <div className="text-xs text-rose-600 mt-1">{transactions.filter(t => t.status === 'failed').length} transactions</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Payment Methods</CardTitle>
          <CardDescription>Distribution by type</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[250px]">
            {paymentMethodData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={({ name }) => name}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No transaction data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionStats;
