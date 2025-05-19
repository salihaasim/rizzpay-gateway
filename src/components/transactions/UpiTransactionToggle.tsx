
import React, { useState } from 'react';
import { Transaction } from '@/stores/transactions/types';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Activity } from 'lucide-react';
import TransactionStatusBadge from '../wallet/TransactionStatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import UpiTransactionActions from './UpiTransactionActions';

interface UpiTransactionToggleProps {
  transaction: Transaction;
}

const UpiTransactionToggle: React.FC<UpiTransactionToggleProps> = ({ transaction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Format transaction date
  const formattedDate = new Date(transaction.date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const transactionIcon = <Activity className="h-5 w-5 text-primary mr-2" />;

  const getTransactionIdDisplay = () => {
    const paymentDetails = transaction.paymentDetails || {};
    return (
      paymentDetails.upiTransactionId || 
      paymentDetails.razorpay_payment_id || 
      transaction.id
    );
  };
  
  const customerEmail = transaction.paymentDetails?.buyerEmail || transaction.customerEmail || 'Unknown';
  const customerName = transaction.paymentDetails?.buyerName || transaction.customer || 'Unknown';
  
  return (
    <Card className="border-0 shadow-sm mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {transactionIcon}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">₹{parseFloat(transaction.amount.replace(/[^\d.]/g, '')).toFixed(2)}</h3>
                <TransactionStatusBadge status={transaction.status} />
              </div>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleExpand}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isExpanded ? 'Less' : 'More'}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
              <p className="text-sm font-mono">{getTransactionIdDisplay()}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Customer Details</p>
              <p className="text-sm">{customerName}</p>
              <p className="text-xs text-muted-foreground">{customerEmail}</p>
            </div>
            
            {transaction.status === 'pending' && (
              <div className="mt-4">
                <UpiTransactionActions transactionId={transaction.id} />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpiTransactionToggle;
