
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NetBankingPayment: React.FC = () => {
  return (
    <>
      <div className="text-sm font-medium mb-2">Net Banking</div>
      <div className="rounded-lg border p-4">
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Bank</label>
          <Select defaultValue="hdfc">
            <SelectTrigger>
              <SelectValue placeholder="Select Bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hdfc">HDFC Bank</SelectItem>
              <SelectItem value="sbi">State Bank of India</SelectItem>
              <SelectItem value="icici">ICICI Bank</SelectItem>
              <SelectItem value="axis">Axis Bank</SelectItem>
              <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">You will be redirected to the bank's website to complete the payment</p>
        </div>
      </div>
    </>
  );
};

export default NetBankingPayment;
