
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
  
  // Cast status to string for comparison
  const statusStr = status.toString();
  
  if (statusStr === 'successful' || statusStr === 'settled') {
    badgeVariant = "default";
    badgeText = statusStr === 'successful' ? 'Successful' : 'Settled';
  } else if (statusStr === 'failed' || statusStr === 'declined') {
    badgeVariant = "destructive";
    badgeText = statusStr === 'failed' ? 'Failed' : 'Declined';
  } else if (statusStr === 'pending' || statusStr === 'processing') {
    badgeVariant = "secondary";
    badgeText = statusStr === 'pending' ? 'Pending' : 'Processing';
  } else if (statusStr === 'refunded') {
    badgeVariant = "outline";
    badgeText = 'Refunded';
  }
  
  return (
    <Badge 
      variant={badgeVariant} 
      className={cn(
        statusStr === 'successful' || statusStr === 'settled' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "",
        statusStr === 'pending' ? "bg-amber-100 text-amber-700 hover:bg-amber-100" : "",
        statusStr === 'processing' ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "",
        statusStr === 'refunded' ? "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200" : "",
        statusStr === 'failed' || statusStr === 'declined' ? "bg-rose-100 text-rose-700 hover:bg-rose-100" : "",
        className
      )}
    >
      {badgeText}
    </Badge>
  );
};

export default TransactionStatusBadge;
