
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NetBankingPaymentProps {
  onBankSelect?: (bank: string) => void;
  selectedBank?: string;
  onAccountChange?: (account: string) => void;
  onIfscChange?: (ifsc: string) => void;
  onProceed?: () => void;
  isLoading?: boolean;
}

const NetBankingPayment: React.FC<NetBankingPaymentProps> = ({ 
  onBankSelect, 
  selectedBank = "hdfc",
  onAccountChange,
  onIfscChange,
  onProceed,
  isLoading = false
}) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setAccountNumber(value);
    if (onAccountChange) {
      onAccountChange(value);
    }
  };
  
  const handleIfscChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase(); // Convert to uppercase
    setIfscCode(value);
    if (onIfscChange) {
      onIfscChange(value);
    }
  };
  
  return (
    <>
      <div className="text-sm font-medium mb-2">Razorpay NetBanking</div>
      <div className="rounded-lg border p-4">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <Building className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">Secure NetBanking via Razorpay</div>
            <div className="text-sm text-muted-foreground">
              Process using Razorpay's secure payment gateway
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Your Bank</label>
            <Select 
              defaultValue={selectedBank}
              onValueChange={(value) => onBankSelect && onBankSelect(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hdfc">HDFC Bank</SelectItem>
                <SelectItem value="sbi">State Bank of India</SelectItem>
                <SelectItem value="icici">ICICI Bank</SelectItem>
                <SelectItem value="axis">Axis Bank</SelectItem>
                <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                <SelectItem value="idbi">IDBI Bank</SelectItem>
                <SelectItem value="boi">Bank of India</SelectItem>
                <SelectItem value="bob">Bank of Baroda</SelectItem>
                <SelectItem value="pnb">Punjab National Bank</SelectItem>
                <SelectItem value="canara">Canara Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Account Number</label>
            <Input 
              placeholder="Enter your account number"
              value={accountNumber}
              onChange={handleAccountChange}
              maxLength={18}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">IFSC Code</label>
            <Input 
              placeholder="Enter IFSC code"
              value={ifscCode}
              onChange={handleIfscChange}
              maxLength={11}
            />
          </div>
          
          <div className="p-3 bg-muted/50 rounded flex items-start">
            <div className="mr-2 mt-0.5">
              <AlertCircle size={16} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Your bank details will be securely processed through Razorpay. Click "Proceed to Pay" to continue to Razorpay's secure payment page.
            </p>
          </div>
          
          {onProceed && (
            <Button 
              onClick={onProceed}
              disabled={isLoading || !accountNumber || !ifscCode}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Proceed to Pay'}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default NetBankingPayment;
