
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const WalletFees = () => {
  return (
    <Card className="border-0 shadow-sm overflow-hidden mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Transaction Fees</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-muted-foreground">Deposit</span>
            <span className="font-medium">1.2%</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-muted-foreground">Withdrawal</span>
            <span className="font-medium">₹25 or 1.5%</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-muted-foreground">Transfer</span>
            <span className="font-medium">0.5%</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-muted-foreground">Currency Conversion</span>
            <span className="font-medium">2.5%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletFees;
