
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { QrCode } from 'lucide-react';

interface UpiTransactionToggleProps {
  showUpiTransactions: boolean;
  setShowUpiTransactions: (value: boolean) => void;
}

const UpiTransactionToggle: React.FC<UpiTransactionToggleProps> = ({
  showUpiTransactions,
  setShowUpiTransactions
}) => {
  return (
    <div className="flex items-center space-x-2 bg-secondary/30 p-2 rounded-lg">
      <QrCode className="h-4 w-4 text-[#9b87f5]" />
      <Label htmlFor="upi-toggle" className="text-sm font-medium cursor-pointer">
        Show Manual UPI Plugin Transactions
      </Label>
      <Switch 
        id="upi-toggle" 
        checked={showUpiTransactions} 
        onCheckedChange={setShowUpiTransactions}
        className="data-[state=checked]:bg-[#9b87f5]"
      />
    </div>
  );
};

export default UpiTransactionToggle;
