
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Coins, ArrowUpRight, Building, FileText, Clock, Wallet } from 'lucide-react';
import BankConnection from './BankConnection';

const EscrowAccount = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
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
          <BankConnection 
            escrowBalance={escrowData.balance}
            formatCurrency={formatCurrency}
          />
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
