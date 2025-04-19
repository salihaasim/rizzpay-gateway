import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, FileText, Download } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { validateIfscCode } from '@/utils/hdfcBankApi';
import html2pdf from 'html2pdf.js';

interface WithdrawFormProps {
  onWithdraw: (amount: number, description?: string, bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    beneficiaryName: string;
    method: string;
  }) => void;
  isProcessing?: boolean;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onWithdraw, isProcessing = false }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('wallet');
  
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  
  const [ifscError, setIfscError] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<{
    id: string;
    amount: string;
    date: string;
    utrNumber?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }
    
    if (withdrawMethod === 'neft') {
      if (!accountNumber || !ifscCode || !beneficiaryName) {
        return;
      }
      
      if (!validateIfscCode(ifscCode)) {
        setIfscError('Invalid IFSC code format');
        return;
      }
      
      setIfscError('');
      
      await onWithdraw(parsedAmount, description, {
        accountNumber,
        ifscCode,
        beneficiaryName,
        method: 'neft'
      });

      setTransactionDetails({
        id: `WD${Date.now()}`,
        amount: parsedAmount.toFixed(2),
        date: new Date().toISOString(),
        utrNumber: `UTR${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });
      
      setShowReceipt(true);
    } else {
      await onWithdraw(parsedAmount, description);
      
      setTransactionDetails({
        id: `WD${Date.now()}`,
        amount: parsedAmount.toFixed(2),
        date: new Date().toISOString()
      });
      
      setShowReceipt(true);
    }
  };

  const downloadReceipt = () => {
    if (!transactionDetails) return;
    
    const receipt = document.getElementById('withdrawal-receipt');
    if (receipt) {
      html2pdf()
        .from(receipt)
        .save(`withdrawal-receipt-${transactionDetails.id}.pdf`);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
            <Input 
              id="amount"
              type="number" 
              min="1"
              step="0.01"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="pl-8"
              disabled={isProcessing}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="withdrawMethod">Withdrawal Method</Label>
          <Select 
            value={withdrawMethod} 
            onValueChange={setWithdrawMethod}
            disabled={isProcessing}
          >
            <SelectTrigger id="withdrawMethod" className="w-full">
              <SelectValue placeholder="Select withdrawal method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wallet">Wallet (Internal)</SelectItem>
              <SelectItem value="neft">NEFT Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {withdrawMethod === 'neft' && (
          <div className="space-y-4 p-4 border rounded-md bg-secondary/20">
            <div className="space-y-2">
              <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
              <Input 
                id="beneficiaryName"
                value={beneficiaryName} 
                onChange={(e) => setBeneficiaryName(e.target.value)}
                placeholder="Account holder's name"
                disabled={isProcessing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input 
                id="accountNumber"
                value={accountNumber} 
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Bank account number"
                disabled={isProcessing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input 
                id="ifscCode"
                value={ifscCode} 
                onChange={(e) => {
                  setIfscCode(e.target.value.toUpperCase());
                  setIfscError('');
                }}
                placeholder="HDFC0000123"
                disabled={isProcessing}
              />
              {ifscError && (
                <p className="text-xs text-destructive">{ifscError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Format: 4 letter bank code + 0 + 6 character branch code (e.g., HDFC0001234)
              </p>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea 
            id="description"
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a note to this withdrawal"
            className="resize-none" 
            rows={3}
            disabled={isProcessing}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isProcessing || 
            !amount || 
            parseFloat(amount) <= 0 || 
            (withdrawMethod === 'neft' && (!accountNumber || !ifscCode || !beneficiaryName))}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            `Withdraw Funds${withdrawMethod === 'neft' ? ' via NEFT' : ''}`
          )}
        </Button>
      </form>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdrawal Receipt</DialogTitle>
          </DialogHeader>
          
          <div id="withdrawal-receipt" className="p-6 space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Payment Receipt</h2>
              <p className="text-muted-foreground">RizzPay Withdrawal</p>
            </div>
            
            {transactionDetails && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-medium">{transactionDetails.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">₹{transactionDetails.amount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {new Date(transactionDetails.date).toLocaleString()}
                  </span>
                </div>
                
                {transactionDetails.utrNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UTR Number:</span>
                    <span className="font-medium">{transactionDetails.utrNumber}</span>
                  </div>
                )}
                
                {withdrawMethod === 'neft' && (
                  <div className="border-t pt-3 mt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Beneficiary:</span>
                      <span className="font-medium">{beneficiaryName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account:</span>
                      <span className="font-medium">XXXX{accountNumber.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IFSC:</span>
                      <span className="font-medium">{ifscCode}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowReceipt(false)}>
              Close
            </Button>
            <Button onClick={downloadReceipt}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WithdrawForm;
