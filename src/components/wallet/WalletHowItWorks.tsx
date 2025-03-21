
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const WalletHowItWorks = () => {
  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">How It Works</h3>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 mt-0.5">
              1
            </div>
            <div>
              <p className="font-medium mb-1">Deposit Funds</p>
              <p className="text-sm text-muted-foreground">Add money to your wallet for secure storage</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 mt-0.5">
              2
            </div>
            <div>
              <p className="font-medium mb-1">Use for Payments</p>
              <p className="text-sm text-muted-foreground">Pay for services directly from your wallet</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 mt-0.5">
              3
            </div>
            <div>
              <p className="font-medium mb-1">Withdraw Anytime</p>
              <p className="text-sm text-muted-foreground">Transfer funds back to your bank account when needed</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletHowItWorks;
