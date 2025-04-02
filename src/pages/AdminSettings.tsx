
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Users, Shield, Database, Bank, FileSpreadsheet, 
  ListFilter, KeyRound, Check, X, Download 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import AdminLayout from '@/components/admin/AdminLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Role management component
const RoleManagement = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', permissions: ['all'] },
    { id: 2, name: 'Merchant', permissions: ['view_transactions', 'process_payments'] },
    { id: 3, name: 'Support', permissions: ['view_transactions'] },
  ]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDialog, setNewRoleDialog] = useState(false);
  
  const handleAddRole = () => {
    if (newRoleName.trim()) {
      setRoles([...roles, { 
        id: roles.length + 1, 
        name: newRoleName.trim(), 
        permissions: [] 
      }]);
      setNewRoleName('');
      setNewRoleDialog(false);
      toast.success('New role created successfully');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Role Management</h3>
        <Dialog open={newRoleDialog} onOpenChange={setNewRoleDialog}>
          <DialogTrigger asChild>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Create New Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input 
                  id="role-name" 
                  placeholder="Enter role name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </div>
              <div className="pt-3 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setNewRoleDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRole}>
                  Create Role
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
                <TableHead>Role Name</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>
                    {role.permissions.join(', ')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-8 px-2">
                      <Shield className="h-4 w-4 mr-1" />
                      Edit Permissions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Bank API integration component
const BankAPISettings = () => {
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'HDFC Bank API', key: '••••••••••••••', status: 'active' },
    { id: 2, name: 'ICICI Payment Gateway', key: '••••••••••••••', status: 'active' },
  ]);
  const [newAPIDialog, setNewAPIDialog] = useState(false);
  const [newAPI, setNewAPI] = useState({ name: '', key: '' });
  
  const handleAddAPI = () => {
    if (newAPI.name && newAPI.key) {
      setApiKeys([...apiKeys, { 
        id: apiKeys.length + 1, 
        name: newAPI.name, 
        key: '••••••••••••••', 
        status: 'active' 
      }]);
      setNewAPI({ name: '', key: '' });
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Bank API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-3">
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
              <div className="pt-3 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setNewAPIDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAPI}>
                  Add API Key
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
                <TableHead>API Key</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((api) => (
                <TableRow key={api.id}>
                  <TableCell className="font-medium">{api.name}</TableCell>
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
    </div>
  );
};

// Main Admin Settings page
const AdminSettings = () => {
  const navigate = useNavigate();
  const { currentMerchant } = useMerchantAuth();
  
  // Redirect non-admin users
  if (currentMerchant?.role !== 'admin') {
    return null;
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure system settings, roles, and integrations
          </p>
        </div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="api">Bank API</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage basic platform settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <div className="text-sm text-muted-foreground">
                      This will be displayed throughout the application
                    </div>
                  </div>
                  <Input 
                    id="platform-name" 
                    value="RizzPay" 
                    className="max-w-xs" 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <div className="text-sm text-muted-foreground">
                      Put the platform in maintenance mode
                    </div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Default Currency</Label>
                    <div className="text-sm text-muted-foreground">
                      Set the default currency for transactions
                    </div>
                  </div>
                  <Select defaultValue="inr">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">Indian Rupee (INR)</SelectItem>
                      <SelectItem value="usd">US Dollar (USD)</SelectItem>
                      <SelectItem value="eur">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles" className="space-y-6">
            <RoleManagement />
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <BankAPISettings />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security options for the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <div className="text-sm text-muted-foreground">
                      Require 2FA for admin users
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <div className="text-sm text-muted-foreground">
                      Set the timeout period for inactive sessions
                    </div>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Restriction</Label>
                    <div className="text-sm text-muted-foreground">
                      Restrict admin access to specific IP addresses
                    </div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button onClick={() => navigate("/admin")}>Save Settings</Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
