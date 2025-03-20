
import React, { useState } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useProfileStore, Merchant } from '@/stores/profileStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUpCircle, ArrowDownCircle, Wallet as WalletIcon, UserPlus, RefreshCw, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const walletSchema = z.object({
  amount: z.string()
    .min(1, { message: "Amount is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  description: z.string().optional(),
});

const merchantSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(6, { message: "Valid phone number is required" }),
  company: z.string().min(2, { message: "Company name is required" }),
});

const transferSchema = z.object({
  recipient: z.string().min(1, { message: "Recipient is required" }),
  amount: z.string()
    .min(1, { message: "Amount is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  description: z.string().optional(),
});

type WalletFormValues = z.infer<typeof walletSchema>;
type MerchantFormValues = z.infer<typeof merchantSchema>;
type TransferFormValues = z.infer<typeof transferSchema>;

const Wallet = () => {
  const { userEmail, getWalletBalance, depositToWallet, withdrawFromWallet, transferFunds, transactions } = useTransactionStore();
  const { merchants, addMerchant } = useProfileStore();
  const [activeTab, setActiveTab] = useState('deposit');
  const [showAddMerchant, setShowAddMerchant] = useState(false);
  
  const depositForm = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      amount: '',
      description: '',
    },
  });

  const withdrawForm = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      amount: '',
      description: '',
    },
  });
  
  const merchantForm = useForm<MerchantFormValues>({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
    },
  });
  
  const transferForm = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipient: '',
      amount: '',
      description: '',
    },
  });
  
  if (!userEmail) {
    return (
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Wallet</CardTitle>
          <CardDescription>Please login to access your wallet</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const walletBalance = getWalletBalance(userEmail);
  
  // Filter wallet transactions
  const walletTransactions = transactions
    .filter(t => (t.walletTransactionType && (t.customer === userEmail || t.createdBy === userEmail)))
    .slice(0, 5); // Show only 5 most recent

  const handleDeposit = (data: WalletFormValues) => {
    try {
      const amount = Number(data.amount);
      depositToWallet(userEmail, amount, 'wallet');
      depositForm.reset();
      toast.success('Deposit successful!');
    } catch (error) {
      toast.error('Deposit failed. Please try again.');
    }
  };

  const handleWithdraw = (data: WalletFormValues) => {
    try {
      const amount = Number(data.amount);
      if (amount > walletBalance) {
        toast.error('Insufficient balance!');
        return;
      }
      withdrawFromWallet(userEmail, amount, 'wallet');
      withdrawForm.reset();
      toast.success('Withdrawal successful!');
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.');
    }
  };
  
  const handleAddMerchant = (data: MerchantFormValues) => {
    try {
      // Check if merchant with this email already exists
      const existingMerchant = merchants.find(m => m.email === data.email);
      if (existingMerchant) {
        toast.error('A merchant with this email already exists');
        return;
      }
      
      addMerchant(data);
      merchantForm.reset();
      setShowAddMerchant(false);
      toast.success('Merchant added successfully!');
    } catch (error) {
      toast.error('Failed to add merchant. Please try again.');
    }
  };
  
  const handleTransfer = (data: TransferFormValues) => {
    try {
      const amount = Number(data.amount);
      
      if (amount > walletBalance) {
        toast.error('Insufficient balance!');
        return;
      }
      
      transferFunds(userEmail, data.recipient, amount, data.description);
      transferForm.reset();
      toast.success('Transfer successful!');
    } catch (error) {
      toast.error('Transfer failed. Please try again.');
    }
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium flex items-center">
              <WalletIcon className="h-5 w-5 mr-2" />
              My Wallet
            </CardTitle>
            <CardDescription>Manage your funds</CardDescription>
          </div>
          
          <Dialog open={showAddMerchant} onOpenChange={setShowAddMerchant}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                Add Merchant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Merchant</DialogTitle>
                <DialogDescription>
                  Create a new merchant that you can transfer funds to.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...merchantForm}>
                <form onSubmit={merchantForm.handleSubmit(handleAddMerchant)} className="space-y-4">
                  <FormField
                    control={merchantForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="John Doe" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={merchantForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="john@example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={merchantForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+91 1234567890" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={merchantForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ABC Enterprises" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter className="mt-4">
                    <Button type="button" variant="outline" onClick={() => setShowAddMerchant(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Merchant</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center justify-between mb-6 p-4 bg-primary/5 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-3xl font-bold">₹{walletBalance.toFixed(2)}</p>
          </div>
          <WalletIcon className="h-12 w-12 text-primary/50" />
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="mt-4">
            <Form {...depositForm}>
              <form onSubmit={depositForm.handleSubmit(handleDeposit)} className="space-y-4">
                <FormField
                  control={depositForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                          <Input {...field} type="text" placeholder="0.00" className="pl-8" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={depositForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note (optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Add a note for this deposit" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" size="lg">
                  <ArrowUpCircle className="mr-2 h-4 w-4" />
                  Deposit Funds
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="withdraw" className="mt-4">
            <Form {...withdrawForm}>
              <form onSubmit={withdrawForm.handleSubmit(handleWithdraw)} className="space-y-4">
                <FormField
                  control={withdrawForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                          <Input {...field} type="text" placeholder="0.00" className="pl-8" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={withdrawForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note (optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Add a note for this withdrawal" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" size="lg" variant="outline">
                  <ArrowDownCircle className="mr-2 h-4 w-4" />
                  Withdraw Funds
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="transfer" className="mt-4">
            <Form {...transferForm}>
              <form onSubmit={transferForm.handleSubmit(handleTransfer)} className="space-y-4">
                <FormField
                  control={transferForm.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select merchant" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {merchants.length > 0 ? (
                            merchants.map((merchant) => (
                              <SelectItem key={merchant.id} value={merchant.email}>
                                {merchant.name} ({merchant.email})
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-center text-sm text-muted-foreground">
                              No merchants added yet
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={transferForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                          <Input {...field} type="text" placeholder="0.00" className="pl-8" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={transferForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note (optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Add a note for this transfer" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={merchants.length === 0}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Transfer Funds
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col">
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Recent Transactions</p>
            {merchants.length > 0 && (
              <div className="text-xs text-muted-foreground">
                You have {merchants.length} merchants
              </div>
            )}
          </div>
          {walletTransactions.length > 0 ? (
            <div className="space-y-3">
              {walletTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center">
                    {transaction.walletTransactionType === 'deposit' ? (
                      <ArrowUpCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    ) : transaction.walletTransactionType === 'withdrawal' ? (
                      <ArrowDownCircle className="h-4 w-4 text-rose-500 mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 text-blue-500 mr-2" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {transaction.walletTransactionType === 'deposit' 
                          ? 'Deposit' 
                          : transaction.walletTransactionType === 'withdrawal'
                            ? 'Withdrawal'
                            : transaction.customer === userEmail
                              ? 'Received Transfer'
                              : 'Sent Transfer'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className={`font-medium ${
                    transaction.walletTransactionType === 'deposit' || (transaction.walletTransactionType === 'transfer' && transaction.customer === userEmail)
                      ? 'text-emerald-500' 
                      : 'text-rose-500'
                  }`}>
                    {transaction.walletTransactionType === 'deposit' || (transaction.walletTransactionType === 'transfer' && transaction.customer === userEmail)
                      ? '+' 
                      : '-'}{transaction.amount}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-3">No transactions yet</p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default Wallet;
