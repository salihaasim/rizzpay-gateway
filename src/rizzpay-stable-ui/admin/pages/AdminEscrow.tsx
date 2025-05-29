
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Banknote,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

const AdminEscrow = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock escrow data
  const [escrowData] = useState({
    balance: 2500000, // ₹25,00,000
    todayInflow: 350000, // ₹3,50,000
    todayOutflow: 125000, // ₹1,25,000
    pendingTransactions: 15,
    accountNumber: '****7890',
    ifscCode: 'SBMB0001234',
    bankName: 'SBM Bank',
    recentTransactions: [
      { id: 'ESC001', type: 'inflow', amount: 45000, merchant: 'Tech Solutions Ltd', status: 'completed', time: '10:30 AM' },
      { id: 'ESC002', type: 'outflow', amount: 25000, merchant: 'Digital Services Inc', status: 'pending', time: '09:45 AM' },
      { id: 'ESC003', type: 'inflow', amount: 78000, merchant: 'E-commerce Store', status: 'completed', time: '09:15 AM' },
      { id: 'ESC004', type: 'outflow', amount: 32000, merchant: 'Payment Gateway Co', status: 'completed', time: '08:30 AM' }
    ]
  });

  const [connectionForm, setConnectionForm] = useState({
    accountNumber: '',
    ifscCode: '',
    accountHolderName: 'RizzPay Technologies Pvt Ltd',
    apiKey: '',
    apiSecret: ''
  });

  const handleConnect = async () => {
    setIsLoading(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      toast.success('Successfully connected to SBM Bank escrow account');
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    return type === 'inflow' ? 
      <ArrowDownLeft className="h-4 w-4 text-green-500" /> : 
      <ArrowUpRight className="h-4 w-4 text-blue-500" />;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Escrow Management</h1>
          <p className="text-muted-foreground">Manage your SBM Bank escrow account and transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium">Secure Banking</span>
        </div>
      </div>

      {/* Connection Status */}
      <Card className={`border-l-4 ${isConnected ? 'border-l-green-500 bg-green-50' : 'border-l-orange-500 bg-orange-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isConnected ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                {isConnected ? 
                  <CheckCircle className="h-5 w-5 text-green-500" /> : 
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                }
              </div>
              <div>
                <h3 className={`font-medium ${isConnected ? 'text-green-800' : 'text-orange-800'}`}>
                  {isConnected ? 'SBM Bank Connected' : 'Escrow Account Not Connected'}
                </h3>
                <p className={`text-sm ${isConnected ? 'text-green-600' : 'text-orange-600'}`}>
                  {isConnected ? 
                    `Account: ${escrowData.accountNumber} | IFSC: ${escrowData.ifscCode}` : 
                    'Connect your SBM Bank escrow account to start managing funds'
                  }
                </p>
              </div>
            </div>
            {!isConnected && (
              <Button onClick={handleConnect} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Building className="mr-2 h-4 w-4" />
                    Connect Bank
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isConnected ? (
        <>
          {/* Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Escrow Balance</p>
                    <h3 className="text-2xl font-bold">{formatCurrency(escrowData.balance)}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Inflow</p>
                    <h3 className="text-2xl font-bold text-green-600">{formatCurrency(escrowData.todayInflow)}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <ArrowDownLeft className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Outflow</p>
                    <h3 className="text-2xl font-bold text-blue-600">{formatCurrency(escrowData.todayOutflow)}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <ArrowUpRight className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <h3 className="text-2xl font-bold text-orange-600">{escrowData.pendingTransactions}</h3>
                    <p className="text-xs text-muted-foreground">Transactions</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Recent Transactions and Bank Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest escrow account activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {escrowData.recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            {getTransactionIcon(transaction.type)}
                            <div>
                              <p className="font-medium text-sm">{transaction.merchant}</p>
                              <p className="text-xs text-muted-foreground">{transaction.id} • {transaction.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${transaction.type === 'inflow' ? 'text-green-600' : 'text-blue-600'}`}>
                              {transaction.type === 'inflow' ? '+' : '-'} {formatCurrency(transaction.amount)}
                            </p>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bank Account Details</CardTitle>
                    <CardDescription>Connected SBM Bank escrow account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Building className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">{escrowData.bankName}</p>
                        <p className="text-sm text-muted-foreground">Primary Escrow Account</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Account Number</span>
                        <span className="font-medium">{escrowData.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">IFSC Code</span>
                        <span className="font-medium">{escrowData.ifscCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Account Type</span>
                        <span className="font-medium">Escrow Account</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full">
                        <CreditCard className="mr-2 h-4 w-4" />
                        View Account Statement
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Escrow Transactions</CardTitle>
                  <CardDescription>Complete transaction history for the escrow account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {escrowData.recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            transaction.type === 'inflow' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.merchant}</p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.id} • {transaction.time} • 
                              <span className="ml-1 capitalize">{transaction.type}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium text-lg ${transaction.type === 'inflow' ? 'text-green-600' : 'text-blue-600'}`}>
                            {transaction.type === 'inflow' ? '+' : '-'} {formatCurrency(transaction.amount)}
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

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Escrow Account Settings</CardTitle>
                  <CardDescription>Manage your SBM Bank escrow account configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account Holder Name</Label>
                      <Input value="RizzPay Technologies Pvt Ltd" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Bank Name</Label>
                      <Input value="SBM Bank" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Number</Label>
                      <Input value={escrowData.accountNumber} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>IFSC Code</Label>
                      <Input value={escrowData.ifscCode} disabled />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex gap-3">
                      <Button variant="outline">
                        <Building className="mr-2 h-4 w-4" />
                        Update Bank Details
                      </Button>
                      <Button variant="outline">
                        <Shield className="mr-2 h-4 w-4" />
                        API Configuration
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        /* Connection Form */
        <Card>
          <CardHeader>
            <CardTitle>Connect SBM Bank Escrow Account</CardTitle>
            <CardDescription>
              Enter your SBM Bank escrow account details to enable fund management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input 
                  id="accountNumber"
                  placeholder="Enter escrow account number"
                  value={connectionForm.accountNumber}
                  onChange={(e) => setConnectionForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input 
                  id="ifscCode"
                  placeholder="SBMB0001234"
                  value={connectionForm.ifscCode}
                  onChange={(e) => setConnectionForm(prev => ({ ...prev, ifscCode: e.target.value }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input 
                  id="accountHolderName"
                  value={connectionForm.accountHolderName}
                  onChange={(e) => setConnectionForm(prev => ({ ...prev, accountHolderName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input 
                  id="apiKey"
                  placeholder="Enter SBM Bank API key"
                  type="password"
                  value={connectionForm.apiKey}
                  onChange={(e) => setConnectionForm(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiSecret">API Secret</Label>
                <Input 
                  id="apiSecret"
                  placeholder="Enter API secret"
                  type="password"
                  value={connectionForm.apiSecret}
                  onChange={(e) => setConnectionForm(prev => ({ ...prev, apiSecret: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleConnect} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Connecting to SBM Bank...
                  </>
                ) : (
                  <>
                    <Building className="mr-2 h-4 w-4" />
                    Connect Escrow Account
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminEscrow;
