
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  AlertTriangle,
  CheckCircle,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Settings,
  FileText,
  ExternalLink,
  Code,
  Banknote
} from 'lucide-react';
import { toast } from 'sonner';

const AdminEscrow = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [connectionForm, setConnectionForm] = useState({
    accountNumber: '',
    ifscCode: 'SBMB0001234',
    accountHolderName: 'RizzPay Technologies Pvt Ltd',
    apiKey: '',
    apiSecret: ''
  });

  // Mock escrow data
  const [escrowData] = useState({
    balance: 2500000, // ₹25,00,000
    todayInflow: 350000, // ₹3,50,000
    todayOutflow: 125000, // ₹1,25,000
    pendingTransactions: 15,
    recentTransactions: [
      { id: 'ESC001', type: 'inflow', amount: 45000, merchant: 'Tech Solutions Ltd', status: 'completed', time: '10:30 AM' },
      { id: 'ESC002', type: 'outflow', amount: 25000, merchant: 'Digital Services Inc', status: 'pending', time: '09:45 AM' },
      { id: 'ESC003', type: 'inflow', amount: 78000, merchant: 'E-commerce Store', status: 'completed', time: '09:15 AM' },
      { id: 'ESC004', type: 'outflow', amount: 32000, merchant: 'Payment Gateway Co', status: 'completed', time: '08:30 AM' }
    ]
  });

  const handleConnect = async () => {
    if (!connectionForm.accountNumber || !connectionForm.apiKey || !connectionForm.apiSecret) {
      toast.error('Please fill in all required fields');
      return;
    }

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
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Escrow Management</h1>
            <p className="text-muted-foreground">Manage your platform from here</p>
          </div>
        </div>

        {/* Connection Status Alert */}
        {!isConnected && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-medium text-orange-800">Escrow Account Not Connected</h3>
                <p className="text-sm text-orange-600">
                  Connect your SBM Bank escrow account to start managing funds
                </p>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Building className="mr-2 h-4 w-4" />
              Connect Bank
            </Button>
          </div>
        )}

        {isConnected && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium text-green-800">SBM Bank Connected</h3>
              <p className="text-sm text-green-600">
                Account: ****7890 | IFSC: SBMB0001234
              </p>
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground mb-4">
          Manage your SBM Bank escrow account and transactions
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="bank-api">Bank API</TabsTrigger>
            <TabsTrigger value="callback-urls">Callback URLs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
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
              </>
            ) : (
              /* Connection Form */
              <Card>
                <CardHeader>
                  <CardTitle>Connect SBM Bank Escrow Account</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Enter your SBM Bank escrow account details to enable fund management
                  </p>
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name</Label>
                    <Input 
                      id="accountHolderName"
                      value={connectionForm.accountHolderName}
                      onChange={(e) => setConnectionForm(prev => ({ ...prev, accountHolderName: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Button 
                      onClick={handleConnect} 
                      disabled={isLoading} 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
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
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Escrow Transactions</CardTitle>
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

          <TabsContent value="bank-api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bank API Configuration</CardTitle>
                <p className="text-sm text-muted-foreground">Configure SBM Bank API settings</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Code className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">API Status: Connected</p>
                      <p className="text-sm text-muted-foreground">Last sync: 2 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>API Endpoint</Label>
                      <Input value="https://api.sbmbank.com/escrow/v1" disabled />
                    </div>
                    <div>
                      <Label>API Version</Label>
                      <Input value="v1.2.0" disabled />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="callback-urls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Callback URL Configuration</CardTitle>
                <p className="text-sm text-muted-foreground">Configure webhook URLs for transaction updates</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="webhook-url"
                        placeholder="https://your-domain.com/webhook/escrow"
                      />
                      <Button variant="outline">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="callback-secret">Webhook Secret</Label>
                    <Input
                      id="callback-secret"
                      type="password"
                      placeholder="Enter webhook secret"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Escrow Account Settings</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your escrow account configuration</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Account Holder Name</Label>
                      <Input value="RizzPay Technologies Pvt Ltd" disabled />
                    </div>
                    <div>
                      <Label>Bank Name</Label>
                      <Input value="SBM Bank" disabled />
                    </div>
                    <div>
                      <Label>Account Number</Label>
                      <Input value="****7890" disabled />
                    </div>
                    <div>
                      <Label>IFSC Code</Label>
                      <Input value="SBMB0001234" disabled />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex gap-3">
                      <Button variant="outline">
                        <Building className="mr-2 h-4 w-4" />
                        Update Bank Details
                      </Button>
                      <Button variant="outline">
                        <Settings className="mr-2 h-4 w-4" />
                        API Configuration
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminEscrow;
