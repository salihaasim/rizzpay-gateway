
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreditCard, IndianRupee, RefreshCw, Wallet, BanknoteIcon } from 'lucide-react';
import { PaymentMethod } from '@/stores/transactions/types';
import { Transaction } from '@/stores/transactions/types';

interface TransactionStatsProps {
  transactions: Transaction[];
  paymentMethodCount: Record<string, number>;
  calculatePercentage: (count: number) => number;
}

const TransactionStats: React.FC<TransactionStatsProps> = ({
  transactions,
  paymentMethodCount,
  calculatePercentage
}) => {
  // Define payment method display info
  const paymentMethodInfo = [
    {
      key: 'upi' as PaymentMethod,
      label: 'UPI',
      icon: <IndianRupee className="h-4 w-4" />,
      color: 'bg-emerald-500',
    },
    {
      key: 'card' as PaymentMethod,
      label: 'Card',
      icon: <CreditCard className="h-4 w-4" />,
      color: 'bg-blue-500',
    },
    {
      key: 'netbanking' as PaymentMethod,
      label: 'Netbanking',
      icon: <RefreshCw className="h-4 w-4" />,
      color: 'bg-amber-500',
    },
    {
      key: 'neft' as PaymentMethod,
      label: 'NEFT',
      icon: <BanknoteIcon className="h-4 w-4" />,
      color: 'bg-purple-500',
    },
    {
      key: 'wallet' as PaymentMethod,
      label: 'Wallet',
      icon: <Wallet className="h-4 w-4" />,
      color: 'bg-gray-500',
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Distribution across payment types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethodInfo.map(({ key, label, icon, color }) => {
            const count = paymentMethodCount[key] || 0;
            const percentage = calculatePercentage(count);
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted mr-2">
                    {icon}
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-sm text-muted-foreground">{count} ({percentage}%)</span>
                  </div>
                </div>
                <Progress value={percentage} className={color} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionStats;
