
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, BadgeCheck, Building, Clock, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { handleWalletToBankTransfer, validateIfscCode } from '@/utils/hdfcBankApi';

interface BankConnectionProps {
  escrowBalance: number;
  formatCurrency: (amount: number) => string;
}

const BankConnection: React.FC<BankConnectionProps> = ({ escrowBalance, formatCurrency }) => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    amount: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBankConnect = async () => {
    setLoading(true);
    
    // Validate form fields
    if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }
    
    if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
      toast.error('Account numbers do not match');
      setLoading(false);
      return;
    }
    
    if (!validateIfscCode(bankDetails.ifscCode)) {
      toast.error('Invalid IFSC code format');
      setLoading(false);
      return;
    }
    
    // Simulate API connection
    setTimeout(() => {
      setConnected(true);
      setLoading(false);
      toast.success('Bank account connected successfully');
    }, 2000);
  };

  const handleWithdraw = async () => {
    setLoading(true);
    
    const amount = parseFloat(bankDetails.amount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      setLoading(false);
      return;
    }
    
    if (amount > escrowBalance) {
      toast.error('Insufficient funds in escrow account');
      setLoading(false);
      return;
    }
    
    try {
      // Call HDFC Bank API integration
      const result = await handleWalletToBankTransfer(
        bankDetails.accountNumber,
        bankDetails.ifscCode,
        bankDetails.accountHolderName,
        amount,
        'admin@rizzpay.com'
      );
      
      if (result) {
        toast.success(`Successfully initiated transfer of ₹${amount.toLocaleString('en-IN')} to bank account`);
      } else {
        toast.error('Failed to process bank transfer');
      }
    } catch (error) {
      console.error('Bank transfer error:', error);
      toast.error('An error occurred while processing the transfer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>Bank Account Connection</CardTitle>
        <CardDescription>
          Connect your bank account for automatic settlements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {connected ? (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <BadgeCheck className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-green-700">Bank Account Connected</h3>
              <p className="text-sm text-green-600">
                Your bank account has been successfully connected
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-medium text-amber-700">No Bank Account Connected</h3>
              <p className="text-sm text-amber-600">
                Connect your bank account to withdraw funds from the escrow account
              </p>
            </div>
          </div>
        )}
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              placeholder="Enter your bank account number"
              value={bankDetails.accountNumber}
              onChange={handleInputChange}
              disabled={connected || loading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="confirmAccountNumber">Confirm Account Number</Label>
            <Input
              id="confirmAccountNumber"
              name="confirmAccountNumber"
              placeholder="Confirm your bank account number"
              value={bankDetails.confirmAccountNumber}
              onChange={handleInputChange}
              disabled={connected || loading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              name="ifscCode"
              placeholder="Enter IFSC code (e.g., HDFC0001234)"
              value={bankDetails.ifscCode}
              onChange={handleInputChange}
              disabled={connected || loading}
            />
            <p className="text-xs text-muted-foreground">
              The IFSC code can be found on your checkbook or bank statement
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="accountHolderName">Account Holder Name</Label>
            <Input
              id="accountHolderName"
              name="accountHolderName"
              placeholder="Enter account holder name"
              value={bankDetails.accountHolderName}
              onChange={handleInputChange}
              disabled={connected || loading}
            />
          </div>
          
          {connected && (
            <div className="grid gap-2 mt-4">
              <Label htmlFor="amount">Withdrawal Amount (₹)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Enter amount to withdraw"
                value={bankDetails.amount}
                onChange={handleInputChange}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Available balance: {formatCurrency(escrowBalance)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {!connected ? (
          <Button
            onClick={handleBankConnect}
            disabled={loading}
          >
            {loading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Building className="mr-2 h-4 w-4" />
                Connect Bank Account
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleWithdraw}
            disabled={loading || !bankDetails.amount}
          >
            {loading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Withdraw to Bank
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BankConnection;
