
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { KeyRound } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BankAPISettings = () => {
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'HDFC Bank API', key: '••••••••••••••', status: 'active', baseUrl: 'https://api.hdfcbank.com/v1' },
    { id: 2, name: 'ICICI Payment Gateway', key: '••••••••••••••', status: 'active', baseUrl: 'https://api.icicibank.com/v1' },
  ]);
  const [newAPIDialog, setNewAPIDialog] = useState(false);
  const [newAPI, setNewAPI] = useState({ 
    name: '', 
    key: '', 
    baseUrl: '', 
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
        baseUrl: newAPI.baseUrl
      }]);
      setNewAPI({ name: '', key: '', baseUrl: '', callbackUrl: '', webhookUrl: '' });
      setNewAPIDialog(false);
      toast.success('Bank API key added successfully');
    }
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
                  <Label htmlFor="api-key">API Key</Label>
                  <Input 
                    id="api-key" 
                    type="password"
                    placeholder="Enter secret API key"
                    value={newAPI.key}
                    onChange={(e) => setNewAPI({...newAPI, key: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="base-url">Base URL</Label>
                  <Input 
                    id="base-url"
                    placeholder="https://api.bankname.com/v1"
                    value={newAPI.baseUrl}
                    onChange={(e) => setNewAPI({...newAPI, baseUrl: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="callback-url">Callback URL</Label>
                  <Input 
                    id="callback-url"
                    placeholder="https://rizzpay.co.in/api/callback"
                    value={newAPI.callbackUrl}
                    onChange={(e) => setNewAPI({...newAPI, callbackUrl: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">URL where the bank will send transaction updates</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input 
                    id="webhook-url"
                    placeholder="https://rizzpay.co.in/api/webhook"
                    value={newAPI.webhookUrl}
                    onChange={(e) => setNewAPI({...newAPI, webhookUrl: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">URL for receiving real-time notifications</p>
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
                  <TableCell className="font-mono text-xs">{api.baseUrl}</TableCell>
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
          <CardTitle>URL Configuration</CardTitle>
          <CardDescription>Configure callback and webhook URLs for bank integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Callback URL</Label>
              <Input value="https://rizzpay.co.in/api/bank/callback" readOnly />
              <p className="text-xs text-muted-foreground">Used for transaction status updates</p>
            </div>
            <div className="space-y-2">
              <Label>Default Webhook URL</Label>
              <Input value="https://rizzpay.co.in/api/bank/webhook" readOnly />
              <p className="text-xs text-muted-foreground">Used for real-time notifications</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankAPISettings;
