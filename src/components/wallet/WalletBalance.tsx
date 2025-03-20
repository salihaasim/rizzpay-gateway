
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WalletIcon } from 'lucide-react';

interface WalletBalanceProps {
  balance: number;
}

const WalletBalance: React.FC<WalletBalanceProps> = React.memo(({ balance }) => {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-primary/5 rounded-lg shadow">
      <div>
        <p className="text-sm text-muted-foreground">Available Balance</p>
        <p className="text-3xl font-bold">₹{balance.toFixed(2)}</p>
      </div>
      <WalletIcon className="h-12 w-12 text-primary/50" />
    </div>
  );
});

// Add display name for debugging
WalletBalance.displayName = 'WalletBalance';

export default WalletBalance;
