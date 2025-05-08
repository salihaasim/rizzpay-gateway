
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  ArrowRightLeft, 
  Download,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTransactionStore } from '@/stores/transactionStore';
import { toast } from 'sonner';

const TransfersPage = () => {
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [transferNote, setTransferNote] = useState<string>('');
  
  const [payoutAmount, setPayoutAmount] = useState<string>('');
  const [bankAccount, setBankAccount] = useState<string>('');
  const [payoutNote, setPayoutNote] = useState<string>('');
  const [payoutMethod, setPayoutMethod] = useState<string>('bank');
  
  const { transferFunds, getWalletBalance, userEmail } = useTransactionStore();
  
  const walletBalance = getWalletBalance(userEmail || '');
  
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail || !recipientEmail || !transferAmount) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      const amount = parseFloat(transferAmount);
      
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }
      
      if (amount > walletBalance) {
        toast.error('Insufficient balance');
        return;
      }
      
      transferFunds(userEmail, recipientEmail, amount, transferNote || 'Wallet transfer');
      toast.success(`Successfully transferred ₹${amount} to ${recipientEmail}`);
      
      // Reset form
      setTransferAmount('');
      setRecipientEmail('');
      setTransferNote('');
    } catch (error: any) {
      toast.error(error.message || 'Transfer failed');
    }
  };
  
  const handlePayoutRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail || !bankAccount || !payoutAmount) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      const amount = parseFloat(payoutAmount);
      
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }
      
      // Simulate payout request
      toast.success(`Payout request for ₹${amount} has been submitted`);
      
      // Reset form
      setPayoutAmount('');
      setBankAccount('');
      setPayoutNote('');
    } catch (error: any) {
      toast.error(error.message || 'Payout request failed');
    }
  };
  
  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Transfers</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Fund Transfer & Payout</CardTitle>
              <CardDescription>Transfer funds to another account or request a payout to your bank</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="transfer" className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="transfer">
                    <div className="flex items-center">
                      <ArrowRightLeft className="mr-2 h-4 w-4" />
                      <span>Transfer Funds</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="payout">
                    <div className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      <span>Request Payout</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="transfer" className="space-y-4 mt-4">
                  <form onSubmit={handleTransfer} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="recipientEmail">Recipient Email</Label>
                        <Input 
                          id="recipientEmail"
                          type="email"
                          placeholder="Enter recipient's email"
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="transferAmount">Amount (₹)</Label>
                        <Input
                          id="transferAmount"
                          type="number"
                          placeholder="0.00"
                          min="1"
                          step="0.01"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Available balance: ₹{walletBalance.toFixed(2)}
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="transferNote">Note (Optional)</Label>
                        <Input
                          id="transferNote"
                          placeholder="Add a note"
                          value={transferNote}
                          onChange={(e) => setTransferNote(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">Transfer Funds</Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="payout" className="space-y-4 mt-4">
                  <form onSubmit={handlePayoutRequest} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="payoutMethod">Payout Method</Label>
                        <Select
                          value={payoutMethod}
                          onValueChange={setPayoutMethod}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select payout method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="bankAccount">
                          {payoutMethod === 'bank' ? 'Bank Account Number' : 'UPI ID'}
                        </Label>
                        <Input 
                          id="bankAccount"
                          placeholder={payoutMethod === 'bank' ? 'Enter bank account number' : 'Enter UPI ID'}
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="payoutAmount">Amount (₹)</Label>
                        <Input
                          id="payoutAmount"
                          type="number"
                          placeholder="0.00"
                          min="1"
                          step="0.01"
                          value={payoutAmount}
                          onChange={(e) => setPayoutAmount(e.target.value)}
                          required
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Available balance: ₹{walletBalance.toFixed(2)}
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="payoutNote">Note (Optional)</Label>
                        <Input
                          id="payoutNote"
                          placeholder="Add a note"
                          value={payoutNote}
                          onChange={(e) => setPayoutNote(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full">Request Payout</Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Transaction History
              </CardTitle>
              <CardDescription>
                Recent transfers and payouts
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="px-6 py-2 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">
                          {i % 2 === 0 ? 'Transfer to merchant' : 'Payout to bank'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${i % 2 === 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {i % 2 === 0 ? '-' : '+'} ₹{(Math.random() * 5000).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {i % 2 === 0 ? 'Completed' : 'Processing'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="px-6">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Transactions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TransfersPage;
