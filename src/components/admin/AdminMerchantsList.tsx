
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfileStore, Merchant } from '@/stores/profileStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Wallet, ArrowUpRight, ArrowDownRight, User, DollarSign } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const MerchantWalletDetails = ({ merchant }: { merchant: Merchant }) => {
  const { getWalletBalance, transactions } = useTransactionStore();
  const walletBalance = getWalletBalance(merchant.email);
  
  const merchantTransactions = transactions.filter(t => 
    t.customer === merchant.email || t.createdBy === merchant.email
  ).slice(0, 5);
  
  const totalDeposits = transactions
    .filter(t => t.walletTransactionType === 'deposit' && t.customer === merchant.email)
    .reduce((sum, t) => sum + (t.rawAmount || 0), 0);
    
  const totalWithdrawals = transactions
    .filter(t => t.walletTransactionType === 'withdrawal' && t.customer === merchant.email)
    .reduce((sum, t) => sum + (t.rawAmount || 0), 0);
  
  const pendingTransactions = transactions
    .filter(t => 
      (t.customer === merchant.email || t.createdBy === merchant.email) && 
      (t.status === 'pending' || t.status === 'processing')
    ).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">₹{walletBalance.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Deposits</p>
              <p className="text-2xl font-bold">₹{totalDeposits.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
              <ArrowDownRight className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Withdrawals</p>
              <p className="text-2xl font-bold">₹{totalWithdrawals.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Transactions</p>
              <p className="text-2xl font-bold">{pendingTransactions}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {merchantTransactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchantTransactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.walletTransactionType}</TableCell>
                    <TableCell>
                      <span className={transaction.walletTransactionType === 'deposit' ? 'text-emerald-500' : 'text-rose-500'}>
                        {transaction.amount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.status === 'successful' ? 'secondary' : 'outline'}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">No transactions found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const AdminMerchantsList = () => {
  const { merchants } = useProfileStore();
  const { getWalletBalance } = useTransactionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  
  const filteredMerchants = merchants.filter(merchant => 
    merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    merchant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    merchant.company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl">Merchant Accounts</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search merchants..."
                className="pl-8 w-full md:w-[240px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Wallet Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMerchants.length > 0 ? (
                filteredMerchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">{merchant.name}</TableCell>
                    <TableCell>{merchant.email}</TableCell>
                    <TableCell>{merchant.company}</TableCell>
                    <TableCell>{new Date(merchant.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>₹{getWalletBalance(merchant.email).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedMerchant(merchant)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Merchant Details: {merchant.name}</DialogTitle>
                            <DialogDescription>
                              {merchant.company} • {merchant.email}
                            </DialogDescription>
                          </DialogHeader>
                          <MerchantWalletDetails merchant={merchant} />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    <div className="flex flex-col items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No merchants found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Wallet Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <p className="text-muted-foreground text-sm">Total Merchants</p>
                  <p className="text-3xl font-bold">{merchants.length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <p className="text-muted-foreground text-sm">Total wallet balance</p>
                  <p className="text-3xl font-bold">
                    ₹{merchants.reduce((total, merchant) => 
                      total + getWalletBalance(merchant.email), 0).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <p className="text-muted-foreground text-sm">Active Companies</p>
                  <p className="text-3xl font-bold">
                    {new Set(merchants.map(m => m.company)).size}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <p className="text-muted-foreground text-sm">Average Balance</p>
                  <p className="text-3xl font-bold">
                    ₹{merchants.length ? 
                      (merchants.reduce((total, merchant) => 
                        total + getWalletBalance(merchant.email), 0) / merchants.length).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMerchantsList;
