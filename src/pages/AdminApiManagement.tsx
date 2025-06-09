
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
  Webhook
} from 'lucide-react';
import { toast } from 'sonner';

const AdminApiManagement = () => {
  const [showSecrets, setShowSecrets] = useState(false);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  
  // Bank API configurations for escrow providers
  const [bankApis] = useState([
    { 
      id: '1', 
      bankName: 'HDFC Bank',
      apiType: 'Escrow Provider',
      clientId: 'hdfc_client_12345',
      clientSecret: '••••••••••••••••••••',
      baseUrl: 'https://api.hdfcbank.com/escrow/v2',
      webhookUrl: 'https://rizzpay.co.in/api/hdfc/webhook',
      callbackUrl: 'https://rizzpay.co.in/api/hdfc/callback',
      status: 'active', 
      lastSync: '2024-01-15 10:30:00',
      transactionsToday: 1540,
      environment: 'production',
      features: ['NEFT', 'RTGS', 'IMPS', 'Settlement']
    },
    { 
      id: '2', 
      bankName: 'ICICI Bank',
      apiType: 'Payment Gateway',
      clientId: 'icici_client_67890',
      clientSecret: '••••••••••••••••••••',
      baseUrl: 'https://api.icicibank.com/gateway/v1',
      webhookUrl: 'https://rizzpay.co.in/api/icici/webhook',
      callbackUrl: 'https://rizzpay.co.in/api/icici/callback',
      status: 'active', 
      lastSync: '2024-01-15 10:25:00',
      transactionsToday: 890,
      environment: 'production',
      features: ['UPI', 'Cards', 'NetBanking', 'Wallet']
    },
    { 
      id: '3', 
      bankName: 'SBM Bank',
      apiType: 'Settlement Provider',
      clientId: 'sbm_client_54321',
      clientSecret: '••••••••••••••••••••',
      baseUrl: 'https://api.sbmbank.com/settlement/v1',
      webhookUrl: 'https://rizzpay.co.in/api/sbm/webhook',
      callbackUrl: 'https://rizzpay.co.in/api/sbm/callback',
      status: 'testing', 
      lastSync: '2024-01-15 09:45:00',
      transactionsToday: 234,
      environment: 'sandbox',
      features: ['Bulk Transfer', 'Verification', 'Reconciliation']
    }
  ]);

  const [webhookLogs] = useState([
    { id: '1', bankName: 'HDFC Bank', endpoint: '/api/hdfc/webhook', method: 'POST', status: 200, payload: 'transaction_success', timestamp: '2024-01-15 10:30:15' },
    { id: '2', bankName: 'ICICI Bank', endpoint: '/api/icici/webhook', method: 'POST', status: 200, payload: 'payment_confirmed', timestamp: '2024-01-15 10:29:45' },
    { id: '3', bankName: 'SBM Bank', endpoint: '/api/sbm/webhook', method: 'POST', status: 400, payload: 'invalid_signature', timestamp: '2024-01-15 10:28:30' },
    { id: '4', bankName: 'HDFC Bank', endpoint: '/api/hdfc/callback', method: 'GET', status: 200, payload: 'status_check', timestamp: '2024-01-15 10:27:00' }
  ]);

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

  const testConnection = (bankName: string) => {
    toast.success(`Testing connection to ${bankName}...`);
    // Simulate API test
    setTimeout(() => {
      toast.success(`${bankName} connection test successful`);
    }, 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bank API Management</h1>
            <p className="text-muted-foreground">Manage bank integrations for escrow services and payment processing</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Secure Banking</span>
          </div>
        </div>

        {/* API Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Banks</p>
                  <h3 className="text-2xl font-bold">3</h3>
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
                  <h3 className="text-2xl font-bold">2,664</h3>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Escrow Volume</p>
                  <h3 className="text-2xl font-bold">₹52.5L</h3>
                </div>
                <Database className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <h3 className="text-2xl font-bold">99.2%</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bank-apis" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bank-apis">Bank APIs</TabsTrigger>
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
                    Bank API Integrations
                  </CardTitle>
                  <CardDescription>Manage connections to escrow and payment providers</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowSecrets(!showSecrets)}>
                    {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showSecrets ? 'Hide' : 'Show'} Secrets
                  </Button>
                  <Button>
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
                              <span className="text-muted-foreground">Base URL:</span>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-xs truncate">
                                {bank.baseUrl}
                              </code>
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
                            onClick={() => testConnection(bank.bankName)}
                          >
                            Test
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
