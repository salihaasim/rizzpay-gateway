
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
  Wallet,
  Clock,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransactionStore } from '@/stores/transactionStore';
import { toast } from 'sonner';
import WithdrawForm from '@/components/wallet/WithdrawForm';
import TransferForm from '@/components/wallet/TransferForm';
import { Merchant } from '@/stores/profileStore';

const TransfersPage = () => {
  const [activeTab, setActiveTab] = useState<string>('transfer');
  const [walletBalance, setWalletBalance] = useState(5000); // Default wallet balance
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { transferFunds, userEmail } = useTransactionStore();
  
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
    
    setIsProcessing(true);
    
    // Simulate transfer process
    setTimeout(() => {
      try {
        transferFunds(userEmail, recipient, amount, description);
        toast.success(`₹${amount.toFixed(2)} has been transferred successfully`);
        setWalletBalance(prev => prev - amount); // Update wallet balance
      } catch (error) {
        toast.error("Transfer failed", {
          description: error instanceof Error ? error.message : "An unexpected error occurred"
        });
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
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
    
    setIsProcessing(true);
    
    // Simulate withdrawal process
    setTimeout(() => {
      try {
        if (amount > walletBalance) {
          throw new Error("Insufficient wallet balance");
        }
        
        toast.success(`₹${amount.toFixed(2)} withdrawal initiated successfully`);
        setWalletBalance(prev => prev - amount); // Update wallet balance
        
        // Show details of the withdrawal
        if (bankDetails) {
          toast.info(`Withdrawal to ${bankDetails.beneficiaryName}'s account will be processed within 24 hours`);
        }
      } catch (error) {
        toast.error("Withdrawal failed", {
          description: error instanceof Error ? error.message : "An unexpected error occurred"
        });
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };
  
  return (
    <Layout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Transfers & Withdrawals</h1>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-2xl font-bold">₹{walletBalance.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-md bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="text-xl">Fund Transfer & Payout</CardTitle>
              <CardDescription>Transfer funds to another account or withdraw to your bank</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="transfer" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 w-full bg-muted/50">
                  <TabsTrigger 
                    value="transfer"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <div className="flex items-center">
                      <ArrowRightLeft className="mr-2 h-4 w-4" />
                      <span>Transfer Funds</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="withdraw"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <div className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      <span>Withdraw to Bank</span>
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
          
          <Card className="border-0 shadow-md bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Recent transfers and payouts
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="px-6 py-3 hover:bg-muted/20 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {i % 2 === 0 ? 
                          <ArrowRightLeft className="h-8 w-8 p-1.5 rounded-full bg-blue-100 text-blue-600" /> : 
                          <Download className="h-8 w-8 p-1.5 rounded-full bg-green-100 text-green-600" />
                        }
                        <div>
                          <p className="font-medium text-sm">
                            {i % 2 === 0 ? 'Transfer to merchant' : 'Withdrawal to bank'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${i % 2 === 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {i % 2 === 0 ? '-' : '+'} ₹{(Math.random() * 5000).toFixed(2)}
                        </p>
                        <p className="text-xs">
                          {i % 2 === 0 ? 
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px]">Completed</span> : 
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px]">Processing</span>
                          }
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
