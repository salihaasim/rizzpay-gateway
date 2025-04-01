
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { handleWalletToBankTransfer, validateIfscCode } from '@/utils/hdfcBankApi';
import { Coins, ArrowUpRight, Building, FileText, Clock, AlertCircle, BadgeCheck, Wallet } from 'lucide-react';

const EscrowAccount = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    amount: ''
  });
  const [connected, setConnected] = useState(false);

  // Mock escrow data
  const escrowData = {
    balance: 1250000, // ₹12,50,000
    pendingSettlements: 45000, // ₹45,000
    todayTransactions: 75000, // ₹75,000
    weeklyVolume: 450000, // ₹4,50,000
    monthlyVolume: 2100000, // ₹21,00,000
    recentTransactions: [
      { id: 'TR123456', amount: 25000, type: 'deposit', status: 'completed', date: '2025-04-01T10:15:00' },
      { id: 'TR123455', amount: 15000, type: 'withdrawal', status: 'pending', date: '2025-04-01T09:30:00' },
      { id: 'TR123454', amount: 35000, type: 'deposit', status: 'completed', date: '2025-03-31T16:45:00' },
      { id: 'TR123453', amount: 50000, type: 'withdrawal', status: 'completed', date: '2025-03-30T14:20:00' }
    ]
  };

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
    
    if (amount > escrowData.balance) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Card className="flex-1 border border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Escrow Balance</p>
                <h3 className="text-3xl font-bold mt-1">{formatCurrency(escrowData.balance)}</h3>
                <p className="text-xs text-muted-foreground mt-1">Updated just now</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1 border border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Today's Volume</p>
                <h3 className="text-3xl font-bold mt-1">{formatCurrency(escrowData.todayTransactions)}</h3>
                <p className="text-xs text-muted-foreground mt-1">From {escrowData.recentTransactions.length} transactions</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1 border border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Pending Settlements</p>
                <h3 className="text-3xl font-bold mt-1">{formatCurrency(escrowData.pendingSettlements)}</h3>
                <p className="text-xs text-muted-foreground mt-1">Waiting for confirmation</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Bank Connection
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Transactions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Escrow Account Overview</CardTitle>
              <CardDescription>
                Monitor your platform's escrow balance and transaction activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Volume Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Weekly</p>
                      <p className="text-xl font-bold">{formatCurrency(escrowData.weeklyVolume)}</p>
                    </div>
                    <div className="bg-secondary/20 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Monthly</p>
                      <p className="text-xl font-bold">{formatCurrency(escrowData.monthlyVolume)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setActiveTab('bank')}
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Connect Bank
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => setActiveTab('transactions')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View All Transactions
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
                <div className="space-y-3">
                  {escrowData.recentTransactions.slice(0, 3).map(transaction => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'deposit' ? 'bg-green-500/10' : 'bg-blue-500/10'
                        }`}>
                          {transaction.type === 'deposit' ? (
                            <ArrowUpRight className={`h-5 w-5 text-green-500`} />
                          ) : (
                            <Building className={`h-5 w-5 text-blue-500`} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.id}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {transaction.type === 'deposit' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </p>
                        <div className="mt-1">
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bank" className="space-y-4">
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
                      Available balance: {formatCurrency(escrowData.balance)}
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
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Escrow Transactions</CardTitle>
              <CardDescription>
                View all incoming and outgoing escrow transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {escrowData.recentTransactions.map(transaction => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === 'deposit' ? 'bg-green-500/10' : 'bg-blue-500/10'
                      }`}>
                        {transaction.type === 'deposit' ? (
                          <ArrowUpRight className={`h-6 w-6 text-green-500`} />
                        ) : (
                          <Building className={`h-6 w-6 text-blue-500`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'} • {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg">
                        {transaction.type === 'deposit' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </p>
                      <div className="mt-1">
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EscrowAccount;
