
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, X, Clock } from 'lucide-react';
import { Transaction } from '@/stores/transactionStore';

interface TransactionCardProps extends Transaction {
  className?: string;
}

const statusConfig = {
  successful: {
    icon: Check,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    label: 'Successful'
  },
  failed: {
    icon: X,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
    label: 'Failed'
  },
  pending: {
    icon: Clock,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    label: 'Pending'
  }
};

const TransactionCard = ({
  id,
  date,
  amount,
  paymentMethod,
  status,
  customer,
  className
}: TransactionCardProps) => {
  const { icon: StatusIcon, color, bgColor, label } = statusConfig[status];

  // Format payment method for display
  const displayPaymentMethod = paymentMethod ? paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) : 'Unknown';

  return (
    <Card className={cn("border shadow-sm transition-all hover:shadow-md", className)}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-sm font-medium">#{id}</span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{date}</span>
            </div>
            
            <div className="mt-1">
              <span className="font-semibold">{amount}</span>
              <span className="text-sm text-muted-foreground ml-1 hidden md:inline">via {displayPaymentMethod}</span>
            </div>
            
            <div className="text-sm text-muted-foreground mt-1 md:hidden">
              via {displayPaymentMethod}
            </div>
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-4">
            <div className="text-sm order-last md:order-first">{customer}</div>
            
            <div className={cn("flex items-center px-3 py-1 rounded-full text-xs font-medium", bgColor, color)}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {label}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
