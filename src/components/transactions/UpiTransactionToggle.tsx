
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface UpiTransactionToggleProps {
  isUpiView: boolean;
  setIsUpiView: (isUpiView: boolean) => void;
  totalUpiTransactions: number;
  showUpiTransactions?: boolean;
  setShowUpiTransactions?: (show: boolean) => void;
}

const UpiTransactionToggle: React.FC<UpiTransactionToggleProps> = ({
  isUpiView,
  setIsUpiView,
  totalUpiTransactions,
  showUpiTransactions,
  setShowUpiTransactions
}) => {
  // Use either isUpiView/setIsUpiView or showUpiTransactions/setShowUpiTransactions
  const isUpi = showUpiTransactions !== undefined ? showUpiTransactions : isUpiView;
  
  const handleToggle = (checked: boolean) => {
    if (setShowUpiTransactions) {
      setShowUpiTransactions(checked);
    } else {
      setIsUpiView(checked);
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="upi-view-toggle" 
        checked={isUpi}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="upi-view-toggle" className="text-sm cursor-pointer">
        UPI Transactions {totalUpiTransactions > 0 && `(${totalUpiTransactions})`}
      </Label>
    </div>
  );
};

export default UpiTransactionToggle;
