
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Smartphone,
  QrCode,
  BadgeCheck,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Trash,
  Settings,
  Plus,
  Edit,
  Copy,
  Check,
  Search
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { Separator } from "@/components/ui/separator";

interface UpiProvider {
  id: string;
  name: string;
  isActive: boolean;
  apiKey: string;
  merchantId: string;
  saltKey?: string;
  lastActive?: string;
  transactionCount?: number;
  successRate?: number;
  logo: string;
}

interface UpiAccount {
  id: string;
  providerName: string;
  upiId: string;
  isActive: boolean;
  displayName: string;
  dailyLimit: number;
  transactionLimit: number;
  rotationPriority: number;
  lastTransaction?: string;
}

const AdminUpiManagement = () => {
  const [activeTab, setActiveTab] = useState('providers');
  const [providers, setProviders] = useState<UpiProvider[]>([
    {
      id: 'phonepe',
      name: 'PhonePe',
      isActive: true,
      apiKey: 'PHONEPE_API_KEY_XXXX',
      merchantId: 'PHONEPE_MERCHANT_ID',
      saltKey: 'SALT_KEY_XXX',
      lastActive: '2023-05-15T10:30:00',
      transactionCount: 2453,
      successRate: 99.2,
      logo: 'https://play-lh.googleusercontent.com/6iyA2zVz5PyyMjK5SIxdUhrb7oh9cYVXJ93q6DZkmx07Er1o90PXYeo6mzL4VC2Gj9s=w240-h480-rw'
    },
    {
      id: 'gpay',
      name: 'Google Pay',
      isActive: true,
      apiKey: 'GPAY_API_KEY_XXXX',
      merchantId: 'GPAY_MERCHANT_ID',
      lastActive: '2023-05-16T09:45:00',
      transactionCount: 1876,
      successRate: 98.7,
      logo: 'https://play-lh.googleusercontent.com/HArtbyi53u0jnqhnnxkQnMx9dHOERNcQ2hXLgtNGtOAaUlbzXYE7XUrpYT30ov6BJ1s=w240-h480-rw'
    },
    {
      id: 'paytm',
      name: 'Paytm',
      isActive: false,
      apiKey: 'PAYTM_API_KEY_XXXX',
      merchantId: 'PAYTM_MERCHANT_ID',
      lastActive: '2023-05-10T14:22:00',
      transactionCount: 1245,
      successRate: 97.5,
      logo: 'https://play-lh.googleusercontent.com/uEkLdxQQYqZWgQTwG6XhQw7koOKUb7AV1GoZ7AyMe7iv5vPDV_j6BdBc9CJUb1qTPQ=w240-h480-rw'
    }
  ]);
  
  const [accounts, setAccounts] = useState<UpiAccount[]>([
    {
      id: '1',
      providerName: 'PhonePe',
      upiId: 'merchant1@ybl',
      isActive: true,
      displayName: 'RizzPay Primary',
      dailyLimit: 100000,
      transactionLimit: 5000,
      rotationPriority: 1,
      lastTransaction: '2023-05-16T09:23:45'
    },
    {
      id: '2',
      providerName: 'Google Pay',
      upiId: 'rizzpay@okaxis',
      isActive: true,
      displayName: 'RizzPay Business',
      dailyLimit: 150000,
      transactionLimit: 10000,
      rotationPriority: 2,
      lastTransaction: '2023-05-16T08:45:12'
    },
    {
      id: '3',
      providerName: 'Paytm',
      upiId: 'rizzpay1@paytm',
      isActive: false,
      displayName: 'RizzPay Backup',
      dailyLimit: 50000,
      transactionLimit: 5000,
      rotationPriority: 3,
      lastTransaction: '2023-05-15T16:30:21'
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingProvider, setIsEditingProvider] = useState<string | null>(null);
  const [isEditingAccount, setIsEditingAccount] = useState<string | null>(null);
  const [copiedApiKey, setCopiedApiKey] = useState<string | null>(null);
  
  // Filter providers and accounts based on search query
  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.merchantId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredAccounts = accounts.filter(account =>
    account.upiId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const toggleProviderStatus = (providerId: string) => {
    setProviders(prev => 
      prev.map(provider => 
        provider.id === providerId
          ? { ...provider, isActive: !provider.isActive }
          : provider
      )
    );
    
    const provider = providers.find(p => p.id === providerId);
    toast.success(`${provider?.name} is now ${provider?.isActive ? 'inactive' : 'active'}`);
  };
  
  const toggleAccountStatus = (accountId: string) => {
    setAccounts(prev => 
      prev.map(account => 
        account.id === accountId
          ? { ...account, isActive: !account.isActive }
          : account
      )
    );
    
    const account = accounts.find(a => a.id === accountId);
    toast.success(`UPI ID ${account?.upiId} is now ${account?.isActive ? 'inactive' : 'active'}`);
  };
  
  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedApiKey(key);
    
    setTimeout(() => {
      setCopiedApiKey(null);
    }, 2000);
    
    toast.success('API Key copied to clipboard');
  };
  
  const refreshApiKey = (providerId: string) => {
    const newKey = `NEW_API_KEY_${Math.random().toString(36).substring(2, 10)}`;
    
    setProviders(prev => 
      prev.map(provider => 
        provider.id === providerId
          ? { ...provider, apiKey: newKey }
          : provider
      )
    );
    
    toast.success('API Key refreshed successfully');
  };
  
  return (
    <AdminLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">UPI Integrations Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage UPI providers, accounts, and payment gateways
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" onClick={() => toast.info('Refreshing UPI status...')}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="providers">
              <Settings className="h-4 w-4 mr-1" />
              UPI Providers
            </TabsTrigger>
            <TabsTrigger value="accounts">
              <Smartphone className="h-4 w-4 mr-1" />
              UPI Accounts
            </TabsTrigger>
            <TabsTrigger value="qr">
              <QrCode className="h-4 w-4 mr-1" />
              QR Management
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <TabsContent value="providers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>UPI Gateway Providers</span>
                    <Button size="sm" onClick={() => toast.info('Add provider functionality coming soon')}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Provider
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Manage UPI gateway providers and their integration settings
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {filteredProviders.map((provider) => (
                    <div key={provider.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={provider.logo} 
                            alt={provider.name} 
                            className="h-10 w-10 rounded-full mr-3"
                          />
                          <div>
                            <h3 className="font-medium flex items-center">
                              {provider.name}
                              {provider.isActive && (
                                <BadgeCheck className="h-4 w-4 text-green-500 ml-1" />
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {provider.transactionCount?.toLocaleString()} transactions · 
                              {provider.successRate}% success rate
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={provider.isActive}
                            onCheckedChange={() => toggleProviderStatus(provider.id)}
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsEditingProvider(provider.id === isEditingProvider ? null : provider.id)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                      </div>
                      
                      {isEditingProvider === provider.id && (
                        <div className="mt-4 border-t pt-4 grid gap-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`apiKey-${provider.id}`}>API Key</Label>
                              <div className="flex">
                                <Input 
                                  id={`apiKey-${provider.id}`}
                                  value={provider.apiKey}
                                  readOnly
                                  className="rounded-r-none"
                                />
                                <Button 
                                  variant="outline" 
                                  className="rounded-l-none"
                                  onClick={() => copyApiKey(provider.apiKey)}
                                >
                                  {copiedApiKey === provider.apiKey ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`merchantId-${provider.id}`}>Merchant ID</Label>
                              <Input 
                                id={`merchantId-${provider.id}`}
                                value={provider.merchantId}
                                readOnly
                              />
                            </div>
                          </div>
                          
                          {provider.saltKey && (
                            <div className="space-y-2">
                              <Label htmlFor={`saltKey-${provider.id}`}>Salt Key</Label>
                              <div className="flex">
                                <Input 
                                  id={`saltKey-${provider.id}`}
                                  value={provider.saltKey}
                                  readOnly
                                  className="rounded-r-none"
                                />
                                <Button 
                                  variant="outline" 
                                  className="rounded-l-none"
                                  onClick={() => copyApiKey(provider.saltKey!)}
                                >
                                  {copiedApiKey === provider.saltKey ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-end gap-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => refreshApiKey(provider.id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Refresh API Key
                            </Button>
                            
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => {
                                setIsEditingProvider(null);
                                toast.success(`${provider.name} settings updated`);
                              }}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {filteredProviders.length === 0 && (
                    <div className="text-center py-8">
                      <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                      <h3 className="mt-2 font-medium">No providers found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search query
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="accounts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>UPI Accounts</span>
                    <Button size="sm" onClick={() => toast.info('Add account functionality coming soon')}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Account
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Manage UPI accounts used for payments and collections
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {filteredAccounts.map((account) => (
                    <div key={account.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium flex items-center">
                            {account.displayName}
                            {account.isActive && (
                              <BadgeCheck className="h-4 w-4 text-green-500 ml-1" />
                            )}
                          </h3>
                          <p className="text-sm">
                            <span className="font-mono">{account.upiId}</span>
                            <span className="text-muted-foreground ml-2">({account.providerName})</span>
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={account.isActive}
                            onCheckedChange={() => toggleAccountStatus(account.id)}
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsEditingAccount(account.id === isEditingAccount ? null : account.id)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </div>
                      </div>
                      
                      {isEditingAccount === account.id && (
                        <div className="mt-4 border-t pt-4 grid gap-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`displayName-${account.id}`}>Display Name</Label>
                              <Input 
                                id={`displayName-${account.id}`}
                                value={account.displayName}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`providerName-${account.id}`}>Provider</Label>
                              <Input 
                                id={`providerName-${account.id}`}
                                value={account.providerName}
                                readOnly
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor={`transactionLimit-${account.id}`}>Transaction Limit (₹)</Label>
                              <Input 
                                id={`transactionLimit-${account.id}`}
                                type="number"
                                value={account.transactionLimit}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`dailyLimit-${account.id}`}>Daily Limit (₹)</Label>
                              <Input 
                                id={`dailyLimit-${account.id}`}
                                type="number"
                                value={account.dailyLimit}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`rotationPriority-${account.id}`}>Rotation Priority</Label>
                            <Input 
                              id={`rotationPriority-${account.id}`}
                              type="number"
                              value={account.rotationPriority}
                            />
                            <p className="text-xs text-muted-foreground">
                              Lower numbers have higher priority in the rotation
                            </p>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-2">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                toast.error(`This would delete the UPI account ${account.upiId}`);
                              }}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Delete Account
                            </Button>
                            
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => {
                                setIsEditingAccount(null);
                                toast.success(`UPI Account ${account.upiId} updated`);
                              }}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {filteredAccounts.length === 0 && (
                    <div className="text-center py-8">
                      <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                      <h3 className="mt-2 font-medium">No accounts found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search query
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="qr" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>QR Code Management</CardTitle>
                  <CardDescription>
                    Manage and configure static and dynamic QR codes for payments
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="text-center py-12">
                    <QrCode className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-3 font-medium">QR Management</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      QR Code management functionality is coming soon. You'll be able to create, 
                      manage and track static and dynamic QR codes for payments.
                    </p>
                    
                    <Button variant="outline" className="mt-4">
                      Get notified when available
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminUpiManagement;
