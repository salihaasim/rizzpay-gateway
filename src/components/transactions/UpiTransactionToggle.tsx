
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Transaction } from '@/stores/transactions/types';

interface UpiTransactionToggleProps {
  isUpiView: boolean;
  setIsUpiView: (isUpiView: boolean) => void;
  totalUpiTransactions: number;
}

export function UpiTransactionToggle({ isUpiView, setIsUpiView, totalUpiTransactions }: UpiTransactionToggleProps) {
  // Toggle UPI/Card view
  const handleViewChange = (checked: boolean) => {
    setIsUpiView(checked);
  };
  
  // Extract transaction details helper
  const getTransactionDetails = (transaction: Transaction) => {
    const details = transaction.paymentDetails || {};
    const referenceId = details.upiTransactionId || details.razorpay_payment_id || transaction.id;
    const buyerEmail = details.buyerEmail || transaction.customerEmail || 'Unknown';
    const buyerName = details.buyerName || transaction.customer || 'Unknown';
    
    return { referenceId, buyerEmail, buyerName };
  };
  
  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="mr-2 h-3.5 w-3.5" />
            <span>View {isUpiView ? 'UPI' : 'All'} Transactions</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">View Options</h4>
              <p className="text-sm text-muted-foreground">
                Customize the transaction view
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <Label htmlFor="upi-view" className="font-medium">
                  UPI Transactions View
                </Label>
                <span className="text-xs text-muted-foreground">
                  {totalUpiTransactions} UPI transactions available
                </span>
              </div>
              <Switch 
                id="upi-view" 
                checked={isUpiView}
                onCheckedChange={handleViewChange}
              />
            </div>
            <Separator />
            <div className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Switch to view specific transaction types
              </span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default UpiTransactionToggle;
