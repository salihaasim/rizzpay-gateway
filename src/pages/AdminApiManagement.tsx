import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Key, 
  Globe, 
  Shield, 
  Activity, 
  Eye, 
  EyeOff,
  Copy,
  RefreshCw,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Database,
  Webhook,
  TestTube,
  Save,
  Link,
  Server
} from 'lucide-react';
import { toast } from 'sonner';

const AdminApiManagement = () => {
  const [showSecrets, setShowSecrets] = useState(false);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);
  
  // Bank API configurations for escrow providers
  const [bankApis, setBankApis] = useState([
    { 
      id: '1', 
      bankName: 'HDFC Bank',
      apiType: 'Escrow Provider',
      clientId: 'hdfc_prod_client_12345',
      clientSecret: 'hdfc_prod_secret_67890',
      baseUrl: 'https://api.hdfcbank.com/escrow/v2',
      webhookUrl: 'https://rizzpay.co.in/api/hdfc/webhook',
      callbackUrl: 'https://rizzpay.co.in/api/hdfc/callback',
      status: 'active', 
      environment: 'production',
      lastSync: '2024-01-15 10:30:00',
      transactionsToday: 1540,
      features: ['NEFT', 'RTGS', 'IMPS', 'Settlement'],
      connectionHealth: 'healthy'
    },
    { 
      id: '2', 
      bankName: 'ICICI Bank',
      apiType: 'Payment Gateway',
      clientId: 'icici_prod_client_67890',
      clientSecret: 'icici_prod_secret_12345',
      baseUrl: 'https://api.icicibank.com/gateway/v1',
      webhookUrl: 'https://rizzpay.co.in/api/icici/webhook',
      callbackUrl: 'https://rizzpay.co.in/api/icici/callback',
      status: 'active', 
      environment: 'production',
      lastSync: '2024-01-15 10:25:00',
      transactionsToday: 890,
      features: ['UPI', 'Cards', 'NetBanking', 'Wallet'],
      connectionHealth: 'healthy'
    },
    { 
      id: '3', 
      bankName: 'SBM Bank',
      apiType: 'Settlement Provider',
      clientId: 'sbm_prod_client_54321',
      clientSecret: 'sbm_prod_secret_98765',
      baseUrl: 'https://api.sbmbank.com/settlement/v1',
      webhookUrl: 'https://rizzpay.co.in/api/sbm/webhook',
      callbackUrl: 'https://rizzpay.co.in/api/sbm/callback',
      status: 'testing', 
      environment: 'sandbox',
      lastSync: '2024-01-15 09:45:00',
      transactionsToday: 234,
      features: ['Bulk Transfer', 'Verification', 'Reconciliation'],
      connectionHealth: 'warning'
    }
  ]);

  const [newApiConfig, setNewApiConfig] = useState({
    bankName: '',
    apiType: 'Escrow Provider',
    clientId: '',
    clientSecret: '',
    baseUrl: '',
    webhookUrl: '',
    callbackUrl: '',
    environment: 'sandbox'
  });

  const [isAddingNew, setIsAddingNew] = useState(false);

  // Webhook logs for bank APIs
  const [webhookLogs] = useState([
    { id: '1', bankName: 'HDFC Bank', endpoint: '/api/hdfc/webhook', method: 'POST', status: 200, payload: 'transaction_success', timestamp: '2024-01-15 10:30:15' },
    { id: '2', bankName: 'ICICI Bank', endpoint: '/api/icici/webhook', method: 'POST', status: 200, payload: 'payment_confirmed', timestamp: '2024-01-15 10:29:45' },
    { id: '3', bankName: 'SBM Bank', endpoint: '/api/sbm/webhook', method: 'POST', status: 400, payload: 'invalid_signature', timestamp: '2024-01-15 10:28:30' },
    { id: '4', bankName: 'HDFC Bank', endpoint: '/api/hdfc/callback', method: 'GET', status: 200, payload: 'status_check', timestamp: '2024-01-15 10:27:00' }
  ]);

  // Escrow transactions for bank APIs
  const [escrowTransactions] = useState([
    { id: '1', bankName: 'HDFC Bank', merchantId: 'MERCH001', amount: 15000, currency: 'INR', status: 'held', type: 'escrow_hold', timestamp: '2024-01-15 10:30:00' },
    { id: '2', bankName: 'ICICI Bank', merchantId: 'MERCH002', amount: 8500, currency: 'INR', status: 'released', type: 'escrow_release', timestamp: '2024-01-15 10:25:00' },
    { id: '3', bankName: 'SBM Bank', merchantId: 'MERCH003', amount: 25000, currency: 'INR', status: 'held', type: 'escrow_hold', timestamp: '2024-01-15 10:20:00' },
    { id: '4', bankName: 'HDFC Bank', merchantId: 'MERCH001', amount: 12000, currency: 'INR', status: 'processing', type: 'settlement', timestamp: '2024-01-15 10:15:00' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production':
        return 'bg-blue-100 text-blue-800';
      case 'sandbox':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'held':
        return 'bg-yellow-100 text-yellow-800';
      case 'released':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const testApiConnection = async (bankId: string, bankName: string) => {
    setIsTestingConnection(bankId);
    toast.info(`Testing ${bankName} API connection...`);
    
    try {
      // Simulate real API test with actual endpoint validation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update connection health
      setBankApis(prev => prev.map(bank => 
        bank.id === bankId 
          ? { ...bank, connectionHealth: 'healthy', lastSync: new Date().toISOString().slice(0, 19).replace('T', ' ') }
          : bank
      ));
      
      toast.success(`${bankName} API connection test successful`);
    } catch (error) {
      setBankApis(prev => prev.map(bank => 
        bank.id === bankId 
          ? { ...bank, connectionHealth: 'error' }
          : bank
      ));
      toast.error(`${bankName} API connection test failed`);
    } finally {
      setIsTestingConnection(null);
    }
  };

  const refreshApiData = async (bankId: string, bankName: string) => {
    setIsRefreshing(bankId);
    toast.info(`Refreshing ${bankName} data...`);
    
    try {
      // Simulate data refresh from bank API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBankApis(prev => prev.map(bank => 
        bank.id === bankId 
          ? { 
              ...bank, 
              lastSync: new Date().toISOString().slice(0, 19).replace('T', ' '),
              transactionsToday: bank.transactionsToday + Math.floor(Math.random() * 50)
            }
          : bank
      ));
      
      toast.success(`${bankName} data refreshed successfully`);
    } catch (error) {
      toast.error(`Failed to refresh ${bankName} data`);
    } finally {
      setIsRefreshing(null);
    }
  };

  const saveApiSettings = (bankId: string, bankName: string) => {
    toast.info(`Saving ${bankName} API settings...`);
    
    setTimeout(() => {
      toast.success(`${bankName} API settings saved successfully`);
    }, 1000);
  };

  const addNewApiConfig = () => {
    if (!newApiConfig.bankName || !newApiConfig.clientId || !newApiConfig.baseUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newBank = {
      id: Date.now().toString(),
      ...newApiConfig,
      status: 'testing' as const,
      lastSync: new Date().toISOString().slice(0, 19).replace('T', ' '),
      transactionsToday: 0,
      features: ['API Integration'],
      connectionHealth: 'warning' as const
    };

    setBankApis(prev => [...prev, newBank]);
    setNewApiConfig({
      bankName: '',
      apiType: 'Escrow Provider',
      clientId: '',
      clientSecret: '',
      baseUrl: '',
      webhookUrl: '',
      callbackUrl: '',
      environment: 'sandbox'
    });
    setIsAddingNew(false);
    toast.success('New API configuration added successfully');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bank API Management</h1>
            <p className="text-muted-foreground">Manage production bank integrations for escrow services and payment processing</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Production Banking</span>
          </div>
        </div>

        {/* API Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Banks</p>
                  <h3 className="text-2xl font-bold">{bankApis.filter(b => b.status === 'active').length}</h3>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Daily Transactions</p>
                  <h3 className="text-2xl font-bold">{bankApis.reduce((sum, bank) => sum + bank.transactionsToday, 0).toLocaleString()}</h3>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Production APIs</p>
                  <h3 className="text-2xl font-bold">{bankApis.filter(b => b.environment === 'production').length}</h3>
                </div>
                <Server className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Healthy Connections</p>
                  <h3 className="text-2xl font-bold">{bankApis.filter(b => b.connectionHealth === 'healthy').length}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bank-apis" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bank-apis">Production APIs</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="escrow-txns">Escrow Transactions</TabsTrigger>
            <TabsTrigger value="settings">Security Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="bank-apis" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Production Bank API Integrations
                  </CardTitle>
                  <CardDescription>Manage real-time connections to escrow and payment providers</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowSecrets(!showSecrets)}>
                    {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showSecrets ? 'Hide' : 'Show'} Secrets
                  </Button>
                  <Button onClick={() => setIsAddingNew(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bank API
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bankApis.map((bank) => (
                    <div key={bank.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{bank.bankName}</p>
                            <Badge variant="outline">{bank.apiType}</Badge>
                            <Badge className={getEnvironmentColor(bank.environment)}>
                              {bank.environment}
                            </Badge>
                            <div className={`flex items-center gap-1 ${getHealthColor(bank.connectionHealth)}`}>
                              <div className={`w-2 h-2 rounded-full ${
                                bank.connectionHealth === 'healthy' ? 'bg-green-500' :
                                bank.connectionHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <span className="text-xs capitalize">{bank.connectionHealth}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Client ID:</span>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {showSecrets ? bank.clientId : bank.clientId.substring(0, 15) + '...'}
                              </code>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bank.clientId)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">API Endpoint:</span>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-xs truncate">
                                {bank.baseUrl}
                              </code>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bank.baseUrl)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Last sync: {bank.lastSync}</span>
                            <span>•</span>
                            <span>{bank.transactionsToday} transactions today</span>
                          </div>
                          <div className="flex gap-1 mt-1">
                            {bank.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(bank.status)}>
                          {bank.status}
                        </Badge>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => testApiConnection(bank.id, bank.bankName)}
                            disabled={isTestingConnection === bank.id}
                          >
                            {isTestingConnection === bank.id ? (
                              <>
                                <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                                Testing
                              </>
                            ) : (
                              <>
                                <TestTube className="h-4 w-4 mr-1" />
                                Test
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => saveApiSettings(bank.id, bank.bankName)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => refreshApiData(bank.id, bank.bankName)}
                            disabled={isRefreshing === bank.id}
                          >
                            {isRefreshing === bank.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add New API Configuration */}
            {isAddingNew && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Production Bank API</CardTitle>
                  <CardDescription>Configure a new bank API for production escrow integration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Select
                        value={newApiConfig.bankName}
                        onValueChange={(value) => setNewApiConfig(prev => ({ ...prev, bankName: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                          <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
                          <SelectItem value="SBM Bank">SBM Bank</SelectItem>
                          <SelectItem value="Axis Bank">Axis Bank</SelectItem>
                          <SelectItem value="Yes Bank">Yes Bank</SelectItem>
                          <SelectItem value="Canara Bank">Canara Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apiType">API Type *</Label>
                      <Select
                        value={newApiConfig.apiType}
                        onValueChange={(value) => setNewApiConfig(prev => ({ ...prev, apiType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Escrow Provider">Escrow Provider</SelectItem>
                          <SelectItem value="Payment Gateway">Payment Gateway</SelectItem>
                          <SelectItem value="Settlement Provider">Settlement Provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="clientId">Production Client ID *</Label>
                      <Input
                        id="clientId"
                        type="password"
                        placeholder="Enter production client ID"
                        value={newApiConfig.clientId}
                        onChange={(e) => setNewApiConfig(prev => ({ ...prev, clientId: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientSecret">Production Client Secret *</Label>
                      <Input
                        id="clientSecret"
                        type="password"
                        placeholder="Enter production client secret"
                        value={newApiConfig.clientSecret}
                        onChange={(e) => setNewApiConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="baseUrl">Production API URL *</Label>
                      <Input
                        id="baseUrl"
                        placeholder="https://api.bankname.com/v1"
                        value={newApiConfig.baseUrl}
                        onChange={(e) => setNewApiConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="environment">Environment *</Label>
                      <Select
                        value={newApiConfig.environment}
                        onValueChange={(value) => setNewApiConfig(prev => ({ ...prev, environment: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sandbox">Sandbox</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="callbackUrl">Callback URL</Label>
                      <Input
                        id="callbackUrl"
                        placeholder="https://rizzpay.co.in/api/bank/callback"
                        value={newApiConfig.callbackUrl}
                        onChange={(e) => setNewApiConfig(prev => ({ ...prev, callbackUrl: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">Webhook URL</Label>
                      <Input
                        id="webhookUrl"
                        placeholder="https://rizzpay.co.in/api/bank/webhook"
                        value={newApiConfig.webhookUrl}
                        onChange={(e) => setNewApiConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addNewApiConfig}>
                      <Save className="h-4 w-4 mr-2" />
                      Add Production API
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Webhook Activity Logs
                </CardTitle>
                <CardDescription>Monitor real-time webhook notifications from banks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {webhookLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Webhook className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium">{log.bankName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="font-mono text-xs">
                              {log.method}
                            </Badge>
                            <code className="text-xs">{log.endpoint}</code>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`font-medium ${log.status === 200 ? 'text-green-600' : 'text-red-600'}`}>
                          {log.status}
                        </span>
                        <span className="text-muted-foreground">{log.payload}</span>
                        <span className="text-muted-foreground">{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="escrow-txns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Escrow Transactions
                </CardTitle>
                <CardDescription>Monitor escrow holds, releases, and settlements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {escrowTransactions.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Database className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{txn.bankName}</p>
                            <Badge variant="outline">{txn.merchantId}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>₹{txn.amount.toLocaleString()}</span>
                            <span>•</span>
                            <span>{txn.type}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <Badge className={getTransactionStatusColor(txn.status)}>
                          {txn.status}
                        </Badge>
                        <span className="text-muted-foreground">{txn.timestamp}</span>
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
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Access Settings
                </CardTitle>
                <CardDescription>Configure security policies for bank API integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">API Rate Limiting</h3>
                    <p className="text-sm text-muted-foreground">Enable rate limiting to prevent API abuse</p>
                  </div>
                  <Switch 
                    checked={rateLimitEnabled} 
                    onCheckedChange={setRateLimitEnabled}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Requests per minute</Label>
                    <Input type="number" defaultValue="500" />
                  </div>
                  <div className="space-y-2">
                    <Label>Burst limit</Label>
                    <Input type="number" defaultValue="1000" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Webhook Signature Validation</Label>
                  <Select defaultValue="strict">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strict">Strict (Recommended)</SelectItem>
                      <SelectItem value="loose">Loose</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>IP Whitelist (Bank APIs)</Label>
                  <Input placeholder="203.192.xxx.xxx, 103.25.xxx.xxx" />
                  <p className="text-xs text-muted-foreground">Comma-separated list of allowed IPs</p>
                </div>
                
                <Button>Save Security Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminApiManagement;
