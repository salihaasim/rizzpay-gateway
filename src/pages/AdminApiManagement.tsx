
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
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
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const AdminApiManagement = () => {
  const [showSecrets, setShowSecrets] = useState(false);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  
  // Mock API keys data
  const [apiKeys] = useState([
    { 
      id: '1', 
      name: 'Production API', 
      key: 'rizz_live_sk_1234567890abcdef',
      secret: 'sk_test_hidden_secret_key',
      status: 'active', 
      lastUsed: '2024-01-15 10:30:00',
      requests: 15420,
      environment: 'production'
    },
    { 
      id: '2', 
      name: 'Test API', 
      key: 'rizz_test_sk_abcdef1234567890',
      secret: 'sk_test_another_secret',
      status: 'active', 
      lastUsed: '2024-01-15 09:45:00',
      requests: 8930,
      environment: 'test'
    },
    { 
      id: '3', 
      name: 'Development API', 
      key: 'rizz_dev_sk_fedcba0987654321',
      secret: 'sk_dev_secret_key',
      status: 'inactive', 
      lastUsed: '2024-01-12 16:20:00',
      requests: 2340,
      environment: 'development'
    }
  ]);

  const [webhookEndpoints] = useState([
    { id: '1', url: 'https://merchant.example.com/webhook', events: ['payment.success', 'payment.failed'], status: 'active', lastDelivery: '2024-01-15 10:28:00' },
    { id: '2', url: 'https://api.merchant2.com/rizzpay/webhook', events: ['payment.success'], status: 'active', lastDelivery: '2024-01-15 10:25:00' },
    { id: '3', url: 'https://backup.merchant.com/webhook', events: ['payment.success', 'payment.failed', 'payout.completed'], status: 'failed', lastDelivery: '2024-01-15 09:15:00' }
  ]);

  const [apiLogs] = useState([
    { id: '1', endpoint: '/api/v1/payments/create', method: 'POST', status: 200, responseTime: '245ms', timestamp: '2024-01-15 10:30:15', ip: '192.168.1.100' },
    { id: '2', endpoint: '/api/v1/payments/verify', method: 'GET', status: 200, responseTime: '123ms', timestamp: '2024-01-15 10:29:45', ip: '192.168.1.100' },
    { id: '3', endpoint: '/api/v1/merchant/balance', method: 'GET', status: 401, responseTime: '89ms', timestamp: '2024-01-15 10:28:30', ip: '192.168.1.200' },
    { id: '4', endpoint: '/api/v1/payments/create', method: 'POST', status: 422, responseTime: '156ms', timestamp: '2024-01-15 10:27:00', ip: '192.168.1.150' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production':
        return 'bg-red-100 text-red-800';
      case 'test':
        return 'bg-blue-100 text-blue-800';
      case 'development':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusCodeColor = (code: number) => {
    if (code >= 200 && code < 300) return 'text-green-600';
    if (code >= 400 && code < 500) return 'text-yellow-600';
    if (code >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const regenerateApiKey = (keyId: string) => {
    toast.success('API key regenerated successfully');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Management</h1>
            <p className="text-muted-foreground">Manage API keys, endpoints, webhooks, and access controls</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Secure Access</span>
          </div>
        </div>

        {/* API Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total API Calls</p>
                  <h3 className="text-2xl font-bold">26,690</h3>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
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
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                  <h3 className="text-2xl font-bold">178ms</h3>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Keys</p>
                  <h3 className="text-2xl font-bold">2</h3>
                </div>
                <Key className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="api-keys" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="logs">API Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Keys Management
                  </CardTitle>
                  <CardDescription>Manage API keys for different environments</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowSecrets(!showSecrets)}>
                    {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showSecrets ? 'Hide' : 'Show'} Secrets
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Key className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{apiKey.name}</p>
                            <Badge className={getEnvironmentColor(apiKey.environment)}>
                              {apiKey.environment}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Key:</span>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {showSecrets ? apiKey.key : apiKey.key.substring(0, 20) + '...'}
                              </code>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiKey.key)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Secret:</span>
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {showSecrets ? apiKey.secret : '••••••••••••••••'}
                              </code>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(apiKey.secret)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last used: {apiKey.lastUsed} • {apiKey.requests.toLocaleString()} requests
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(apiKey.status)}>
                          {apiKey.status}
                        </Badge>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => regenerateApiKey(apiKey.id)}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
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
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Webhook Endpoints
                  </CardTitle>
                  <CardDescription>Manage webhook URLs and event subscriptions</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhookEndpoints.map((webhook) => (
                    <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                          <Globe className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium">{webhook.url}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {webhook.events.map((event, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last delivery: {webhook.lastDelivery}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(webhook.status)}>
                          {webhook.status}
                        </Badge>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Test
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  API Request Logs
                </CardTitle>
                <CardDescription>Monitor API requests and responses in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {apiLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="font-mono text-xs">
                          {log.method}
                        </Badge>
                        <code className="text-sm">{log.endpoint}</code>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`font-medium ${getStatusCodeColor(log.status)}`}>
                          {log.status}
                        </span>
                        <span className="text-muted-foreground">{log.responseTime}</span>
                        <span className="text-muted-foreground">{log.ip}</span>
                        <span className="text-muted-foreground">{log.timestamp}</span>
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
                  API Security Settings
                </CardTitle>
                <CardDescription>Configure API access controls and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Rate Limiting</h3>
                    <p className="text-sm text-muted-foreground">Enable API rate limiting to prevent abuse</p>
                  </div>
                  <Switch 
                    checked={rateLimitEnabled} 
                    onCheckedChange={setRateLimitEnabled}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Requests per minute</Label>
                    <Input type="number" defaultValue="100" />
                  </div>
                  <div className="space-y-2">
                    <Label>Burst limit</Label>
                    <Input type="number" defaultValue="200" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Allowed IP Ranges (CIDR)</Label>
                  <Input placeholder="192.168.1.0/24, 10.0.0.0/8" />
                </div>
                
                <div className="space-y-2">
                  <Label>Webhook Secret Key</Label>
                  <div className="flex gap-2">
                    <Input type="password" defaultValue="webhook_secret_key_123" />
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminApiManagement;
