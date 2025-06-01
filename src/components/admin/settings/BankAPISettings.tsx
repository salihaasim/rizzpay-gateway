
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { KeyRound, Globe, TestTube } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const BankAPISettings = () => {
  const [apiKeys, setApiKeys] = useState([
    { 
      id: 1, 
      name: 'HDFC Bank API', 
      key: '••••••••••••••', 
      status: 'active', 
      environment: 'production',
      baseUrl: 'https://api.hdfcbank.com/v1',
      testUrl: 'https://sandbox.hdfcbank.com/v1'
    },
    { 
      id: 2, 
      name: 'ICICI Payment Gateway', 
      key: '••••••••••••••', 
      status: 'active', 
      environment: 'test',
      baseUrl: 'https://api.icicibank.com/v1',
      testUrl: 'https://sandbox.icicibank.com/v1'
    },
  ]);
  const [newAPIDialog, setNewAPIDialog] = useState(false);
  const [newAPI, setNewAPI] = useState({ 
    name: '', 
    key: '', 
    baseUrl: '', 
    testUrl: '',
    environment: 'test',
    callbackUrl: '', 
    webhookUrl: '' 
  });
  
  const handleAddAPI = () => {
    if (newAPI.name && newAPI.key && newAPI.baseUrl) {
      setApiKeys([...apiKeys, { 
        id: apiKeys.length + 1, 
        name: newAPI.name, 
        key: '••••••••••••••', 
        status: 'active',
        environment: newAPI.environment,
        baseUrl: newAPI.baseUrl,
        testUrl: newAPI.testUrl || newAPI.baseUrl
      }]);
      setNewAPI({ 
        name: '', 
        key: '', 
        baseUrl: '', 
        testUrl: '',
        environment: 'test',
        callbackUrl: '', 
        webhookUrl: '' 
      });
      setNewAPIDialog(false);
      toast.success('Bank API key added successfully');
    }
  };

  const toggleEnvironment = (id: number) => {
    setApiKeys(apis => 
      apis.map(api => 
        api.id === id 
          ? { ...api, environment: api.environment === 'test' ? 'production' : 'test' }
          : api
      )
    );
    toast.success('API environment switched successfully');
  };

  const getCallbackUrl = (bankName: string, environment: string) => {
    const baseUrl = environment === 'test' ? 'https://sandbox.rizz-pay.in' : 'https://rizz-pay.in';
    const sanitizedName = bankName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `${baseUrl}/api/bank/${sanitizedName}/callback`;
  };

  const getWebhookUrl = (bankName: string, environment: string) => {
    const baseUrl = environment === 'test' ? 'https://sandbox.rizz-pay.in' : 'https://rizz-pay.in';
    const sanitizedName = bankName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `${baseUrl}/api/bank/${sanitizedName}/webhook`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Bank API Integration</h3>
        <Dialog open={newAPIDialog} onOpenChange={setNewAPIDialog}>
          <DialogTrigger asChild>
            <Button>
              <KeyRound className="mr-2 h-4 w-4" />
              Add New API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Bank API Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api-name">API Name</Label>
                  <Input 
                    id="api-name" 
                    placeholder="e.g., HDFC Bank API"
                    value={newAPI.name}
                    onChange={(e) => setNewAPI({...newAPI, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <Select value={newAPI.environment} onValueChange={(value) => setNewAPI({...newAPI, environment: value})}>
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
                  <Label htmlFor="api-key">API Key</Label>
                  <Input 
                    id="api-key" 
                    type="password"
                    placeholder="Enter secret API key"
                    value={newAPI.key}
                    onChange={(e) => setNewAPI({...newAPI, key: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="production-url">Production URL</Label>
                  <Input 
                    id="production-url"
                    placeholder="https://api.bankname.com/v1"
                    value={newAPI.baseUrl}
                    onChange={(e) => setNewAPI({...newAPI, baseUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="test-url">Test/Sandbox URL</Label>
                  <Input 
                    id="test-url"
                    placeholder="https://sandbox.bankname.com/v1"
                    value={newAPI.testUrl}
                    onChange={(e) => setNewAPI({...newAPI, testUrl: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Auto-generated URLs</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-blue-600">Callback URL:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
                      {newAPI.name ? getCallbackUrl(newAPI.name, newAPI.environment) : 'Enter API name to see URL'}
                    </code>
                  </div>
                  <div>
                    <span className="text-blue-600">Webhook URL:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
                      {newAPI.name ? getWebhookUrl(newAPI.name, newAPI.environment) : 'Enter API name to see URL'}
                    </code>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setNewAPIDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAPI}>
                  Add API Configuration
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>API Name</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Base URL</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((api) => (
                <TableRow key={api.id}>
                  <TableCell className="font-medium">{api.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={api.environment === 'production' ? 'default' : 'secondary'}>
                        {api.environment === 'production' ? (
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
                        checked={api.environment === 'production'}
                        onCheckedChange={() => toggleEnvironment(api.id)}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {api.environment === 'production' ? api.baseUrl : api.testUrl}
                  </TableCell>
                  <TableCell>{api.key}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${api.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {api.status === 'active' ? 'Active' : 'Inactive'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-8 px-2">
                      <KeyRound className="h-4 w-4 mr-1" />
                      Rotate Key
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Domain Configuration - rizz-pay.in</CardTitle>
          <CardDescription>Auto-generated callback and webhook URLs for bank integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {apiKeys.map((api) => (
              <div key={api.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{api.name}</h4>
                  <Badge variant={api.environment === 'production' ? 'default' : 'secondary'}>
                    {api.environment}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Callback URL</Label>
                    <Input 
                      value={getCallbackUrl(api.name, api.environment)} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <p className="text-xs text-muted-foreground">Used for transaction status updates</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input 
                      value={getWebhookUrl(api.name, api.environment)} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <p className="text-xs text-muted-foreground">Used for real-time notifications</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">Domain Information</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p><strong>Production:</strong> https://rizz-pay.in</p>
              <p><strong>Sandbox:</strong> https://sandbox.rizz-pay.in</p>
              <p className="text-xs">URLs are automatically generated based on bank name and environment</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankAPISettings;
