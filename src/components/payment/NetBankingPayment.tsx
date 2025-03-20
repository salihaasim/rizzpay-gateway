
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NetBankingPaymentProps {
  onBankSelect?: (bank: string) => void;
  selectedBank?: string;
  onProceed?: () => void;
  isLoading?: boolean;
}

const NetBankingPayment: React.FC<NetBankingPaymentProps> = ({ 
  onBankSelect, 
  selectedBank = "hdfc",
  onProceed,
  isLoading = false
}) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  
  return (
    <>
      <div className="text-sm font-medium mb-2">NEFT Bank Transfer</div>
      <div className="rounded-lg border p-4">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <Building className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">Secure NEFT Bank Transfer</div>
            <div className="text-sm text-muted-foreground">
              Process using direct bank transfer
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
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">IFSC Code</label>
            <Input 
              placeholder="Enter IFSC code"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
            />
          </div>
          
          <div className="p-3 bg-muted/50 rounded flex items-start">
            <div className="mr-2 mt-0.5">
              <AlertCircle size={16} className="text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Your bank details will be used to verify your NEFT transfer. After completing the payment, you'll receive confirmation details.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NetBankingPayment;
