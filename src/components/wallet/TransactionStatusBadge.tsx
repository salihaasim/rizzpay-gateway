
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TransactionStatus } from '@/stores/transactions/types';

interface TransactionStatusBadgeProps {
  status: TransactionStatus | string;
  className?: string;
}

const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({
  status,
  className
}) => {
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let badgeText: string = status.toString().charAt(0).toUpperCase() + status.toString().slice(1);
  
  if (status === 'successful' || status === 'settled') {
    badgeVariant = "default";
    badgeText = status === 'successful' ? 'Successful' : 'Settled';
  } else if (status === 'failed' || status === 'declined') {
    badgeVariant = "destructive";
    badgeText = status === 'failed' ? 'Failed' : 'Declined';
  } else if (status === 'pending' || status === 'processing') {
    badgeVariant = "secondary";
    badgeText = status === 'pending' ? 'Pending' : 'Processing';
  } else if (status === 'refunded') {
    badgeVariant = "outline";
    badgeText = 'Refunded';
  }
  
  return (
    <Badge 
      variant={badgeVariant} 
      className={cn(
        status === 'successful' || status === 'settled' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "",
        status === 'pending' ? "bg-amber-100 text-amber-700 hover:bg-amber-100" : "",
        status === 'processing' ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "",
        status === 'refunded' ? "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200" : "",
        status === 'failed' || status === 'declined' ? "bg-rose-100 text-rose-700 hover:bg-rose-100" : "",
        className
      )}
    >
      {badgeText}
    </Badge>
  );
};

export default TransactionStatusBadge;
