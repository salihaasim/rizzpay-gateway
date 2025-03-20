
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WalletIcon } from 'lucide-react';

interface WalletBalanceProps {
  balance: number;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ balance }) => {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-primary/5 rounded-lg">
      <div>
        <p className="text-sm text-muted-foreground">Available Balance</p>
        <p className="text-3xl font-bold">₹{balance.toFixed(2)}</p>
      </div>
      <WalletIcon className="h-12 w-12 text-primary/50" />
    </div>
  );
};

export default WalletBalance;
