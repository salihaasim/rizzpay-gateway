import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Building, Key, Globe, CheckCircle, AlertTriangle, Copy } from 'lucide-react';

interface BankApiConfig {
  id: string;
  bankName: string;
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  callbackUrl: string;
  webhookUrl: string;
  status: 'active' | 'inactive' | 'testing';
}

const BankApiIntegration = () => {
  const [apiConfigs, setApiConfigs] = useState<BankApiConfig[]>([
    {
      id: '1',
      bankName: 'HDFC Bank',
      apiKey: 'hdfc_••••••••••••••',
      apiSecret: '••••••••••••••',
      baseUrl: 'https://api.hdfcbank.com/v1',
      callbackUrl: 'https://rizzpay.co.in/api/hdfc/callback',
      webhookUrl: 'https://rizzpay.co.in/api/hdfc/webhook',
      status: 'active'
    },
    {
      id: '2',
      bankName: 'SBM Bank',
      apiKey: 'sbm_••••••••••••••',
      apiSecret: '••••••••••••••',
      baseUrl: 'https://api.sbmbank.com/v1',
      callbackUrl: 'https://rizzpay.co.in/api/sbm/callback',
      webhookUrl: 'https://rizzpay.co.in/api/sbm/webhook',
      status: 'testing'
    }
  ]);

  const [newApiConfig, setNewApiConfig] = useState({
    bankName: '',
    apiKey: '',
    apiSecret: '',
    baseUrl: '',
    callbackUrl: '',
    webhookUrl: ''
  });

  const [isAdding, setIsAdding] = useState(false);

  const handleAddApiConfig = () => {
    if (!newApiConfig.bankName || !newApiConfig.apiKey || !newApiConfig.baseUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newConfig: BankApiConfig = {
      id: Date.now().toString(),
      ...newApiConfig,
      status: 'testing'
    };

    setApiConfigs([...apiConfigs, newConfig]);
    setNewApiConfig({
      bankName: '',
      apiKey: '',
      apiSecret: '',
      baseUrl: '',
      callbackUrl: '',
      webhookUrl: ''
    });
    setIsAdding(false);
    toast.success('Bank API configuration added successfully');
  };

  const handleStatusChange = (id: string, status: 'active' | 'inactive' | 'testing') => {
    setApiConfigs(configs =>
      configs.map(config =>
        config.id === id ? { ...config, status } : config
      )
    );
    toast.success('API status updated');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Bank API Integration</h3>
          <p className="text-sm text-muted-foreground">Configure bank APIs for escrow management</p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Building className="mr-2 h-4 w-4" />
          Add Bank API
        </Button>
      </div>

      {/* Existing API Configurations */}
      <div className="grid gap-4">
        {apiConfigs.map((config) => (
          <Card key={config.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {config.bankName}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(config.status)}>
                    {config.status}
                  </Badge>
                  <Select
                    value={config.status}
                    onValueChange={(value: 'active' | 'inactive' | 'testing') =>
                      handleStatusChange(config.id, value)
                    }
                  >
                    <SelectTrigger className="w-24 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="testing">Testing</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">API Key</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{config.apiKey}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(config.apiKey, 'API Key')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Base URL</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{config.baseUrl}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(config.baseUrl, 'Base URL')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Callback URL</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{config.callbackUrl}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(config.callbackUrl, 'Callback URL')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Webhook URL</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{config.webhookUrl}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(config.webhookUrl, 'Webhook URL')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New API Configuration */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Bank API</CardTitle>
            <CardDescription>Configure a new bank API for escrow integration</CardDescription>
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
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key *</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter API key"
                  value={newApiConfig.apiKey}
                  onChange={(e) => setNewApiConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiSecret">API Secret</Label>
                <Input
                  id="apiSecret"
                  type="password"
                  placeholder="Enter API secret"
                  value={newApiConfig.apiSecret}
                  onChange={(e) => setNewApiConfig(prev => ({ ...prev, apiSecret: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseUrl">Base URL *</Label>
                <Input
                  id="baseUrl"
                  placeholder="https://api.bankname.com/v1"
                  value={newApiConfig.baseUrl}
                  onChange={(e) => setNewApiConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                />
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
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddApiConfig}>
                Add API Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankApiIntegration;
