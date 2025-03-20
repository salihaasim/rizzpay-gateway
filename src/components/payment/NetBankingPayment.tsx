
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <>
      <div className="text-sm font-medium mb-2">Net Banking</div>
      <div className="rounded-lg border p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Bank</label>
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
          
          <p className="text-xs text-muted-foreground">
            You will be redirected to the bank's website to complete the payment
          </p>
          
          {onProceed && (
            <Button 
              onClick={onProceed} 
              className="w-full flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  Proceed to Net Banking
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default NetBankingPayment;
