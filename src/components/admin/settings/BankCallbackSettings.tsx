import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building, 
  Globe, 
  TestTube, 
  Link, 
  Copy, 
  Plus, 
  Trash2 
} from 'lucide-react';
import { toast } from 'sonner';

const BankCallbackSettings = () => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Bank API Callback URLs</h3>
          <p className="text-sm text-muted-foreground">Manage callback and webhook URLs for bank integrations</p>
        </div>
        <Button onClick={() => setIsAddingCallback(true)} disabled={isAddingCallback}>
          <Plus className="mr-2 h-4 w-4" />
          Add Callback URL
        </Button>
      </div>

      {/* Add New Callback Form */}
      {isAddingCallback && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Callback URL Configuration</CardTitle>
            <CardDescription>Configure callback and webhook URLs for bank API integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Select value={newCallbackForm.bankName} onValueChange={(value) => setNewCallbackForm(prev => ({ ...prev, bankName: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HDFC Bank">HDFC Bank</SelectItem>
                    <SelectItem value="SBM Bank">SBM Bank</SelectItem>
                    <SelectItem value="ICICI Bank">ICICI Bank</SelectItem>
                    <SelectItem value="Axis Bank">Axis Bank</SelectItem>
                    <SelectItem value="Yes Bank">Yes Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Environment</Label>
                <Select value={newCallbackForm.environment} onValueChange={(value) => setNewCallbackForm(prev => ({ ...prev, environment: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Test/Sandbox</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Callback URL (auto-generated if empty)</Label>
                <Input
                  placeholder={newCallbackForm.bankName ? generateCallbackUrl(newCallbackForm.bankName, newCallbackForm.environment) : 'Select bank to see auto-generated URL'}
                  value={newCallbackForm.callbackUrl}
                  onChange={(e) => setNewCallbackForm(prev => ({ ...prev, callbackUrl: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Webhook URL (auto-generated if empty)</Label>
                <Input
                  placeholder={newCallbackForm.bankName ? generateWebhookUrl(newCallbackForm.bankName, newCallbackForm.environment) : 'Select bank to see auto-generated URL'}
                  value={newCallbackForm.webhookUrl}
                  onChange={(e) => setNewCallbackForm(prev => ({ ...prev, webhookUrl: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingCallback(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCallback}>
                Add Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Callback URLs */}
      <div className="grid gap-4">
        {callbackUrls.map((callback) => (
          <Card key={callback.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {callback.bankName}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={callback.environment === 'production' ? 'default' : 'secondary'}>
                    {callback.environment === 'production' ? (
                      <>
                        <Globe className="h-3 w-3 mr-1" />
                        Production
                      </>
                    ) : (
                      <>
                        <TestTube className="h-3 w-3 mr-1" />
                        Test
                      </>
                    )}
                  </Badge>
                  <Switch
                    checked={callback.environment === 'production'}
                    onCheckedChange={() => toggleCallbackEnvironment(callback.id)}
                  />
                  {getCallbackStatusBadge(callback.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCallback(callback.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Callback URL</Label>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                    <code className="font-mono text-xs flex-1 break-all">{callback.callbackUrl}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(callback.callbackUrl, 'Callback URL')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Webhook URL</Label>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                    <code className="font-mono text-xs flex-1 break-all">{callback.webhookUrl}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(callback.webhookUrl, 'Webhook URL')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Last used: {callback.lastUsed}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Domain Information */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Configuration</CardTitle>
          <CardDescription>Current domain setup for callback URLs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-medium">Production Domain</Label>
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <code className="text-green-800">https://rizz-pay.in</code>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Test/Sandbox Domain</Label>
              <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                <code className="text-yellow-800">https://sandbox.rizz-pay.in</code>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            URLs are automatically generated based on bank name and environment. 
            You can override them manually when adding new configurations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankCallbackSettings;
