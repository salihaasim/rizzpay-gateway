
import React, { useState } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUpCircle, ArrowDownCircle, Wallet as WalletIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const walletSchema = z.object({
  amount: z.string()
    .min(1, { message: "Amount is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  description: z.string().optional(),
});

type WalletFormValues = z.infer<typeof walletSchema>;

const Wallet = () => {
  const { userEmail, getWalletBalance, depositToWallet, withdrawFromWallet, transactions } = useTransactionStore();
  const [activeTab, setActiveTab] = useState('deposit');
  
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
    .filter(t => t.walletTransactionType && t.customer === userEmail)
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

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium flex items-center">
          <WalletIcon className="h-5 w-5 mr-2" />
          My Wallet
        </CardTitle>
        <CardDescription>Manage your funds</CardDescription>
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
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
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col">
        <div className="w-full">
          <p className="text-sm font-medium mb-3">Recent Transactions</p>
          {walletTransactions.length > 0 ? (
            <div className="space-y-3">
              {walletTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center">
                    {transaction.walletTransactionType === 'deposit' ? (
                      <ArrowUpCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 text-rose-500 mr-2" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {transaction.walletTransactionType === 'deposit' ? 'Deposit' : 'Withdrawal'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className={`font-medium ${
                    transaction.walletTransactionType === 'deposit' ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {transaction.walletTransactionType === 'deposit' ? '+' : '-'}{transaction.amount}
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
