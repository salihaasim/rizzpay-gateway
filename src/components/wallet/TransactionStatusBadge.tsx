
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TransactionStatus } from '@/stores/transactionStore';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
}

const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'successful':
      return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Successful</Badge>;
    case 'processing':
      return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Processing</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">Pending</Badge>;
    case 'failed':
      return <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-200">Failed</Badge>;
    case 'declined':
      return <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-200">Declined</Badge>;
    case 'settled':
      return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 border-indigo-200">Settled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default TransactionStatusBadge;
