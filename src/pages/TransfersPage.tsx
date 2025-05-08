
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
  IndianRupee,
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
import { useWalletActions } from '@/hooks/useWalletActions';
import { toast } from 'sonner';
import WithdrawForm from '@/components/wallet/WithdrawForm';
import TransferForm from '@/components/wallet/TransferForm';
import { Merchant } from '@/stores/profileStore';

const TransfersPage = () => {
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [transferNote, setTransferNote] = useState<string>('');
  
  const [payoutAmount, setPayoutAmount] = useState<string>('');
  const [bankAccount, setBankAccount] = useState<string>('');
  const [payoutNote, setPayoutNote] = useState<string>('');
  const [payoutMethod, setPayoutMethod] = useState<string>('bank');
  
  const { transferFunds, getWalletBalance, userEmail } = useTransactionStore();
  const { handleWithdraw, handleTransfer, walletBalance, isProcessing } = useWalletActions(userEmail);
  
  // Updated sampleMerchants to match the Merchant type
  const sampleMerchants: Merchant[] = [
    { 
      id: '1', 
      name: 'Merchant 1', 
      email: 'merchant1@example.com',
      company: 'Company 1',
      phone: '+91 9876543210',
      createdAt: '2025-01-01T00:00:00Z'
    },
    { 
      id: '2', 
      name: 'Merchant 2', 
      email: 'merchant2@example.com',
      company: 'Company 2',
      phone: '+91 9876543211',
      createdAt: '2025-01-02T00:00:00Z'
    },
    { 
      id: '3', 
      name: 'Merchant 3', 
      email: 'merchant3@example.com',
      company: 'Company 3',
      phone: '+91 9876543212',
      createdAt: '2025-01-03T00:00:00Z'
    },
  ];
  
  const handleTransferSubmit = (recipient: string, amount: number, description?: string) => {
    if (!userEmail) {
      toast.error('You must be logged in to transfer funds');
      return;
    }
    handleTransfer(recipient, amount, description);
  };
  
  const handleWithdrawSubmit = (amount: number, description?: string, bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    beneficiaryName: string;
    method: string;
  }) => {
    if (!userEmail) {
      toast.error('You must be logged in to withdraw funds');
      return;
    }
    handleWithdraw(amount, description, bankDetails);
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
                  <TabsTrigger value="withdraw">
                    <div className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      <span>Withdraw Money</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="transfer" className="space-y-4 mt-4">
                  <TransferForm 
                    merchants={sampleMerchants}
                    onTransfer={handleTransferSubmit}
                    isProcessing={isProcessing}
                  />
                </TabsContent>
                
                <TabsContent value="withdraw" className="space-y-4 mt-4">
                  <WithdrawForm 
                    onWithdraw={handleWithdrawSubmit}
                    isProcessing={isProcessing}
                  />
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
