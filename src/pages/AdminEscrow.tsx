import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Shield,
  Globe,
  TestTube,
  Link,
  Copy,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import BankApiIntegration from '@/components/admin/BankApiIntegration';
import BankCallbackSettings from '@/components/admin/settings/BankCallbackSettings';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';

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

  // Callback URL management state
  const [callbackUrls, setCallbackUrls] = useState([
    {
      id: 1,
      bankName: 'HDFC Bank',
      environment: 'production',
      callbackUrl: 'https://rizz-pay.in/api/hdfc-bank/callback',
      webhookUrl: 'https://rizz-pay.in/api/hdfc-bank/webhook',
      status: 'active',
      lastUsed: '2024-06-01 10:30 AM'
    },
    {
      id: 2,
      bankName: 'SBM Bank',
      environment: 'production',
      callbackUrl: 'https://rizz-pay.in/api/sbm-bank/callback',
      webhookUrl: 'https://rizz-pay.in/api/sbm-bank/webhook',
      status: 'active',
      lastUsed: '2024-06-01 09:45 AM'
    },
    {
      id: 3,
      bankName: 'ICICI Bank',
      environment: 'test',
      callbackUrl: 'https://sandbox.rizz-pay.in/api/icici-bank/callback',
      webhookUrl: 'https://sandbox.rizz-pay.in/api/icici-bank/webhook',
      status: 'testing',
      lastUsed: 'Never'
    }
  ]);

  const [newCallbackForm, setNewCallbackForm] = useState({
    bankName: '',
    environment: 'test',
    callbackUrl: '',
    webhookUrl: ''
  });

  const [isAddingCallback, setIsAddingCallback] = useState(false);

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

  const generateCallbackUrl = (bankName: string, environment: string) => {
    const baseUrl = environment === 'production' ? 'https://rizz-pay.in' : 'https://sandbox.rizz-pay.in';
    const sanitizedName = bankName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `${baseUrl}/api/${sanitizedName}/callback`;
  };

  const generateWebhookUrl = (bankName: string, environment: string) => {
    const baseUrl = environment === 'production' ? 'https://rizz-pay.in' : 'https://sandbox.rizz-pay.in';
    const sanitizedName = bankName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `${baseUrl}/api/${sanitizedName}/webhook`;
  };

  const handleAddCallback = () => {
    if (!newCallbackForm.bankName) {
      toast.error('Please select a bank name');
      return;
    }

    const callbackUrl = newCallbackForm.callbackUrl || generateCallbackUrl(newCallbackForm.bankName, newCallbackForm.environment);
    const webhookUrl = newCallbackForm.webhookUrl || generateWebhookUrl(newCallbackForm.bankName, newCallbackForm.environment);

    const newCallback = {
      id: callbackUrls.length + 1,
      bankName: newCallbackForm.bankName,
      environment: newCallbackForm.environment,
      callbackUrl,
      webhookUrl,
      status: 'testing',
      lastUsed: 'Never'
    };

    setCallbackUrls([...callbackUrls, newCallback]);
    setNewCallbackForm({
      bankName: '',
      environment: 'test',
      callbackUrl: '',
      webhookUrl: ''
    });
    setIsAddingCallback(false);
    toast.success('Callback URL configuration added successfully');
  };

  const toggleCallbackEnvironment = (id: number) => {
    setCallbackUrls(urls =>
      urls.map(url =>
        url.id === id
          ? {
              ...url,
              environment: url.environment === 'production' ? 'test' : 'production',
              callbackUrl: generateCallbackUrl(url.bankName, url.environment === 'production' ? 'test' : 'production'),
              webhookUrl: generateWebhookUrl(url.bankName, url.environment === 'production' ? 'test' : 'production')
            }
          : url
      )
    );
    toast.success('Environment switched successfully');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const deleteCallback = (id: number) => {
    setCallbackUrls(urls => urls.filter(url => url.id !== id));
    toast.success('Callback URL configuration deleted');
  };

  const getCallbackStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      testing: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Escrow Management | RizzPay Admin</title>
      </Helmet>
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

        {/* Balance Overview - Only show when connected */}
        {isConnected && (
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
        )}

        {/* Main Content Tabs - Always show callback URLs tab */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="api-integration">Bank API</TabsTrigger>
            <TabsTrigger value="callback-urls">Callback URLs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {isConnected ? (
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
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                    <Building className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Bank Account Not Connected</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect your SBM Bank escrow account to view transaction overview and manage funds.
                  </p>
                  <Button onClick={handleConnect} disabled={isLoading}>
                    {isLoading ? (
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
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            {isConnected ? (
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
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Transaction Data</h3>
                  <p className="text-muted-foreground">
                    Connect your bank account to view transaction history.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="api-integration" className="space-y-4">
            <BankApiIntegration />
          </TabsContent>

          <TabsContent value="callback-urls" className="space-y-4">
            <BankCallbackSettings />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {isConnected ? (
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminEscrow;
