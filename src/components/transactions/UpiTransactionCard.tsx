
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode } from 'lucide-react';
import { Transaction } from '@/stores/transactionStore';
import { cn } from '@/lib/utils';
import UpiTransactionActions from './UpiTransactionActions';

interface UpiTransactionCardProps {
  transaction: Transaction;
  className?: string;
}

const UpiTransactionCard: React.FC<UpiTransactionCardProps> = ({
  transaction,
  className
}) => {
  // Get UPI ID from payment details if available
  const upiId = transaction.paymentDetails?.upiId;
  // Get UPI Transaction ID if available (could be from razorpay_payment_id or the new upiTransactionId field)
  const upiTransactionId = transaction.paymentDetails?.upiTransactionId || transaction.paymentDetails?.razorpay_payment_id;
  
  return (
    <Card className={cn("border shadow-sm transition-all hover:shadow-md", className)}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2">
              <Badge variant="outline" className="bg-[#f5f3ff] border-[#9b87f5] text-[#9b87f5] flex items-center gap-1 font-medium">
                <QrCode className="h-3 w-3" />
                UPI Plugin
              </Badge>
              <span className="text-xs sm:text-sm font-medium">#{transaction.id}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {new Date(transaction.date).toLocaleString()}
              </span>
            </div>
            
            <div className="mt-2">
              <span className="font-semibold text-sm sm:text-base">{transaction.amount}</span>
              <div className="mt-1">
                <span className="text-xs font-medium text-muted-foreground mr-2">UPI ID:</span>
                {upiId ? (
                  <span className="text-xs sm:text-sm font-mono">{upiId}</span>
                ) : (
                  <span className="text-xs sm:text-sm text-gray-400">Pending UPI submission</span>
                )}
              </div>
              
              {upiTransactionId && (
                <div className="mt-1">
                  <span className="text-xs font-medium text-muted-foreground mr-2">UPI Transaction ID:</span>
                  <span className="text-xs sm:text-sm font-mono">{upiTransactionId}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:items-end gap-2">
            <Badge 
              variant="outline" 
              className={cn(
                "w-fit",
                transaction.status === 'successful' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                transaction.status === 'failed' ? "bg-rose-50 text-rose-600 border-rose-200" :
                "bg-amber-50 text-amber-600 border-amber-200"
              )}
            >
              {transaction.status === 'successful' ? 'Verified' :
               transaction.status === 'failed' ? 'Rejected' : 'Pending'}
            </Badge>
            
            {transaction.status === 'pending' && (
              <UpiTransactionActions transactionId={transaction.id} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpiTransactionCard;
