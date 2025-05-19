
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const AdminUpiManagement: React.FC = () => {
  const [newAccount, setNewAccount] = useState({
    provider: "",
    merchantId: "",
    upiId: "",
    maxDaily: "10000",
    maxTransaction: "5000",
    isActive: true,
    description: ""
  });

  // Sample UPI account data
  const [upiAccounts, setUpiAccounts] = useState([
    {
      id: 1,
      provider: "PhonePe",
      merchantId: "PHPE0000001",
      upiId: "merchant@phonepe",
      maxDaily: 50000,
      maxTransaction: 10000,
      status: "active",
      balance: "₹125,450",
      todayVolume: "₹23,450",
      monthlyVolume: "₹450,780",
      successRate: "98.5%",
      lastActive: "2023-09-15T10:34:23Z"
    },
    {
      id: 2,
      provider: "Google Pay",
      merchantId: "GPAY0000002",
      upiId: "merchant@okaxis",
      maxDaily: 100000,
      maxTransaction: 25000,
      status: "active",
      balance: "₹240,300",
      todayVolume: "₹15,670",
      monthlyVolume: "₹320,450",
      successRate: "99.2%",
      lastActive: "2023-09-15T09:12:45Z"
    },
    {
      id: 3,
      provider: "Paytm",
      merchantId: "PYTM0000003",
      upiId: "merchant@paytm",
      maxDaily: 75000,
      maxTransaction: 15000,
      status: "inactive",
      balance: "₹87,650",
      todayVolume: "₹0",
      monthlyVolume: "₹245,780",
      successRate: "97.8%",
      lastActive: "2023-09-12T14:22:11Z"
    }
  ]);

  // Sample QR code data
  const [qrCodes, setQrCodes] = useState([
    {
      id: 1,
      name: "Store Front QR",
      upiId: "merchant@phonepe",
      type: "static",
      amount: null,
      downloads: 124,
      scans: 542,
      created: "2023-08-20T14:22:11Z"
    },
    {
      id: 2,
      name: "Coffee Payment QR",
      upiId: "merchant@okaxis",
      type: "static",
      amount: 200,
      downloads: 56,
      scans: 189,
      created: "2023-08-25T10:15:32Z"
    },
    {
      id: 3,
      name: "Donation QR",
      upiId: "merchant@paytm",
      type: "dynamic",
      amount: null,
      downloads: 78,
      scans: 312,
      created: "2023-09-01T09:45:18Z"
    }
  ]);

  // Handler for adding a new UPI account
  const handleAddUpiAccount = () => {
    if (!newAccount.provider || !newAccount.upiId || !newAccount.merchantId) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const newId = Math.max(...upiAccounts.map(a => a.id)) + 1;
    
    setUpiAccounts([
      ...upiAccounts,
      {
        id: newId,
        provider: newAccount.provider,
        merchantId: newAccount.merchantId,
        upiId: newAccount.upiId,
        maxDaily: parseInt(newAccount.maxDaily),
        maxTransaction: parseInt(newAccount.maxTransaction),
        status: newAccount.isActive ? "active" : "inactive",
        balance: "₹0",
        todayVolume: "₹0",
        monthlyVolume: "₹0",
        successRate: "0%",
        lastActive: new Date().toISOString()
      }
    ]);
    
    toast.success(`Added ${newAccount.provider} UPI account`);
    
    // Reset form
    setNewAccount({
      provider: "",
      merchantId: "",
      upiId: "",
      maxDaily: "10000",
      maxTransaction: "5000",
      isActive: true,
      description: ""
    });
  };

  // Handler for toggling UPI account status
  const toggleAccountStatus = (id: number) => {
    setUpiAccounts(upiAccounts.map(account => {
      if (account.id === id) {
        const newStatus = account.status === "active" ? "inactive" : "active";
        toast.success(`UPI account ${account.upiId} set to ${newStatus}`);
        return {
          ...account,
          status: newStatus
        };
      }
      return account;
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">UPI Management</h1>
      
      <Tabs defaultValue="accounts">
        <TabsList className="mb-6">
          <TabsTrigger value="accounts">UPI Accounts</TabsTrigger>
          <TabsTrigger value="qr-codes">QR Codes</TabsTrigger>
          <TabsTrigger value="settings">UPI Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts">
          <div className="grid gap-6 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>UPI Accounts</CardTitle>
                <CardDescription>
                  Manage UPI accounts for payment processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left">Provider</th>
                        <th className="py-3 text-left">UPI ID</th>
                        <th className="py-3 text-left">Daily Limit</th>
                        <th className="py-3 text-left">Per Txn Limit</th>
                        <th className="py-3 text-left">Balance</th>
                        <th className="py-3 text-left">Today's Volume</th>
                        <th className="py-3 text-left">Success Rate</th>
                        <th className="py-3 text-left">Status</th>
                        <th className="py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upiAccounts.map((account) => (
                        <tr key={account.id} className="border-b hover:bg-muted/50">
                          <td className="py-3">{account.provider}</td>
                          <td className="py-3">{account.upiId}</td>
                          <td className="py-3">₹{account.maxDaily.toLocaleString()}</td>
                          <td className="py-3">₹{account.maxTransaction.toLocaleString()}</td>
                          <td className="py-3">{account.balance}</td>
                          <td className="py-3">{account.todayVolume}</td>
                          <td className="py-3">{account.successRate}</td>
                          <td className="py-3">
                            <div className="flex items-center space-x-2">
                              <Switch 
                                checked={account.status === "active"} 
                                onCheckedChange={() => toggleAccountStatus(account.id)} 
                              />
                              <span className={account.status === "active" ? "text-green-600" : "text-gray-500"}>
                                {account.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-3">
                            <Button variant="ghost" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Add New UPI Account</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="provider">Provider</Label>
                      <Select 
                        value={newAccount.provider}
                        onValueChange={(value) => setNewAccount({...newAccount, provider: value})}
                      >
                        <SelectTrigger id="provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PhonePe">PhonePe</SelectItem>
                          <SelectItem value="Google Pay">Google Pay</SelectItem>
                          <SelectItem value="Paytm">Paytm</SelectItem>
                          <SelectItem value="BHIM">BHIM</SelectItem>
                          <SelectItem value="Amazon Pay">Amazon Pay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="merchant-id">Merchant ID</Label>
                      <Input 
                        id="merchant-id" 
                        placeholder="Enter merchant ID"
                        value={newAccount.merchantId}
                        onChange={(e) => setNewAccount({...newAccount, merchantId: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input 
                        id="upi-id" 
                        placeholder="merchant@provider"
                        value={newAccount.upiId}
                        onChange={(e) => setNewAccount({...newAccount, upiId: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="max-daily">Daily Limit (₹)</Label>
                      <Input 
                        id="max-daily" 
                        type="number" 
                        placeholder="10000"
                        value={newAccount.maxDaily}
                        onChange={(e) => setNewAccount({...newAccount, maxDaily: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="max-transaction">Per Transaction Limit (₹)</Label>
                      <Input 
                        id="max-transaction" 
                        type="number" 
                        placeholder="5000"
                        value={newAccount.maxTransaction}
                        onChange={(e) => setNewAccount({...newAccount, maxTransaction: e.target.value})}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch 
                        id="is-active" 
                        checked={newAccount.isActive} 
                        onCheckedChange={(checked) => setNewAccount({...newAccount, isActive: checked})}
                      />
                      <Label htmlFor="is-active">Account Active</Label>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Add notes about this UPI account"
                      value={newAccount.description}
                      onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="mt-6">
                    <Button onClick={handleAddUpiAccount}>Add UPI Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="qr-codes">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Management</CardTitle>
              <CardDescription>
                Manage UPI QR codes for in-person payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left">QR Name</th>
                      <th className="py-3 text-left">UPI ID</th>
                      <th className="py-3 text-left">Type</th>
                      <th className="py-3 text-left">Amount</th>
                      <th className="py-3 text-left">Downloads</th>
                      <th className="py-3 text-left">Scans</th>
                      <th className="py-3 text-left">Created</th>
                      <th className="py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qrCodes.map((qr) => (
                      <tr key={qr.id} className="border-b hover:bg-muted/50">
                        <td className="py-3">{qr.name}</td>
                        <td className="py-3">{qr.upiId}</td>
                        <td className="py-3">{qr.type}</td>
                        <td className="py-3">{qr.amount ? `₹${qr.amount}` : "Variable"}</td>
                        <td className="py-3">{qr.downloads}</td>
                        <td className="py-3">{qr.scans}</td>
                        <td className="py-3">{new Date(qr.created).toLocaleDateString()}</td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Download</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Generate New QR Code</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="qr-name">QR Name</Label>
                    <Input id="qr-name" placeholder="e.g., Store Front QR" />
                  </div>
                  
                  <div>
                    <Label htmlFor="qr-upi">UPI ID</Label>
                    <Select defaultValue={upiAccounts[0]?.upiId || ""}>
                      <SelectTrigger id="qr-upi">
                        <SelectValue placeholder="Select UPI ID" />
                      </SelectTrigger>
                      <SelectContent>
                        {upiAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.upiId}>
                            {account.upiId} ({account.provider})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="qr-type">QR Type</Label>
                    <Select defaultValue="static">
                      <SelectTrigger id="qr-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="static">Static (Fixed UPI ID)</SelectItem>
                        <SelectItem value="dynamic">Dynamic (Can update later)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="qr-amount">Amount (Optional)</Label>
                    <Input id="qr-amount" type="number" placeholder="Leave empty for variable amount" />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button>Generate QR Code</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>UPI Settings</CardTitle>
              <CardDescription>
                Configure global UPI settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Rotation</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="rotation-enable">Enable Account Rotation</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically rotate between UPI accounts to balance transaction load
                        </p>
                      </div>
                      <Switch id="rotation-enable" defaultChecked />
                    </div>
                    
                    <div>
                      <Label htmlFor="rotation-method">Rotation Method</Label>
                      <Select defaultValue="round-robin">
                        <SelectTrigger id="rotation-method">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="round-robin">Round Robin</SelectItem>
                          <SelectItem value="least-used">Least Used First</SelectItem>
                          <SelectItem value="weighted">Weighted Distribution</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Fallback Strategy</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="fallback-enable">Enable Automatic Fallback</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically switch to backup UPI provider if primary fails
                        </p>
                      </div>
                      <Switch id="fallback-enable" defaultChecked />
                    </div>
                    
                    <div>
                      <Label htmlFor="max-attempts">Maximum Fallback Attempts</Label>
                      <Select defaultValue="3">
                        <SelectTrigger id="max-attempts">
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 attempt</SelectItem>
                          <SelectItem value="2">2 attempts</SelectItem>
                          <SelectItem value="3">3 attempts</SelectItem>
                          <SelectItem value="5">5 attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-downtime">Notify on Provider Downtime</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications when a UPI provider experiences downtime
                        </p>
                      </div>
                      <Switch id="notify-downtime" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notify-limit">Notify on Limit Reached</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications when account approaches daily transaction limit
                        </p>
                      </div>
                      <Switch id="notify-limit" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUpiManagement;
