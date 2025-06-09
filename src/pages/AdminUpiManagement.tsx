
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
  Smartphone, 
  QrCode, 
  CreditCard, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

const AdminUpiManagement = () => {
  const [upiRotationEnabled, setUpiRotationEnabled] = useState(true);
  const [autoSwitchEnabled, setAutoSwitchEnabled] = useState(false);
  
  // Mock UPI IDs data
  const [upiIds] = useState([
    { id: '1', upiId: 'rizzpay@paytm', provider: 'Paytm', status: 'active', dailyLimit: 100000, usedToday: 45000 },
    { id: '2', upiId: 'rizzpay@phonepe', provider: 'PhonePe', status: 'active', dailyLimit: 150000, usedToday: 0 },
    { id: '3', upiId: 'rizzpay@gpay', provider: 'Google Pay', status: 'inactive', dailyLimit: 200000, usedToday: 0 },
    { id: '4', upiId: 'rizzpay@ybl', provider: 'BHIM', status: 'active', dailyLimit: 100000, usedToday: 25000 },
  ]);

  const [qrCodes] = useState([
    { id: '1', name: 'Main QR', upiId: 'rizzpay@paytm', amount: 0, isStatic: true, scans: 1250 },
    { id: '2', name: 'Backup QR', upiId: 'rizzpay@phonepe', amount: 0, isStatic: true, scans: 890 },
    { id: '3', name: 'Dynamic QR 1', upiId: 'rizzpay@ybl', amount: 500, isStatic: false, scans: 45 },
  ]);

  const [newUpiId, setNewUpiId] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newLimit, setNewLimit] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const handleAddUpiId = () => {
    if (!newUpiId || !newProvider || !newLimit) {
      toast.error('Please fill all fields');
      return;
    }
    toast.success('UPI ID added successfully');
    setNewUpiId('');
    setNewProvider('');
    setNewLimit('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">UPI Management</h1>
            <p className="text-muted-foreground">Manage UPI configurations, payment settings, and rotation</p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Live Monitoring</span>
          </div>
        </div>

        {/* System Status */}
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">UPI System Online</h3>
                  <p className="text-sm text-green-600">All payment channels operational</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-800">₹2,45,680</p>
                <p className="text-sm text-green-600">Today's Collection</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="upi-ids" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upi-ids">UPI IDs</TabsTrigger>
            <TabsTrigger value="qr-codes">QR Codes</TabsTrigger>
            <TabsTrigger value="rotation">Rotation Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="upi-ids" className="space-y-4">
            {/* Add New UPI ID */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New UPI ID
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>UPI ID</Label>
                    <Input
                      placeholder="merchant@provider"
                      value={newUpiId}
                      onChange={(e) => setNewUpiId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Provider</Label>
                    <Input
                      placeholder="e.g., Paytm, PhonePe"
                      value={newProvider}
                      onChange={(e) => setNewProvider(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Limit (₹)</Label>
                    <Input
                      type="number"
                      placeholder="100000"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddUpiId} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add UPI ID
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* UPI IDs List */}
            <Card>
              <CardHeader>
                <CardTitle>Active UPI IDs</CardTitle>
                <CardDescription>Manage your UPI payment channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upiIds.map((upi) => (
                    <div key={upi.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Smartphone className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">{upi.upiId}</p>
                          <p className="text-sm text-muted-foreground">{upi.provider}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">₹{upi.usedToday.toLocaleString()} / ₹{upi.dailyLimit.toLocaleString()}</p>
                          <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                            <div 
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ width: `${getUsagePercentage(upi.usedToday, upi.dailyLimit)}%` }}
                            />
                          </div>
                        </div>
                        
                        <Badge className={getStatusColor(upi.status)}>
                          {upi.status}
                        </Badge>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
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

          <TabsContent value="qr-codes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code Management
                </CardTitle>
                <CardDescription>Manage static and dynamic QR codes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {qrCodes.map((qr) => (
                    <div key={qr.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{qr.name}</h3>
                        <Badge variant={qr.isStatic ? "default" : "secondary"}>
                          {qr.isStatic ? 'Static' : 'Dynamic'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">UPI ID:</span> {qr.upiId}</p>
                        <p><span className="text-muted-foreground">Amount:</span> {qr.amount === 0 ? 'Variable' : `₹${qr.amount}`}</p>
                        <p><span className="text-muted-foreground">Scans:</span> {qr.scans}</p>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <QrCode className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate New QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rotation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  UPI Rotation Settings
                </CardTitle>
                <CardDescription>Configure automatic UPI ID rotation for optimal performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable UPI Rotation</h3>
                    <p className="text-sm text-muted-foreground">Automatically rotate UPI IDs to prevent blocking</p>
                  </div>
                  <Switch 
                    checked={upiRotationEnabled} 
                    onCheckedChange={setUpiRotationEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto Switch on Limit</h3>
                    <p className="text-sm text-muted-foreground">Switch UPI ID when daily limit is reached</p>
                  </div>
                  <Switch 
                    checked={autoSwitchEnabled} 
                    onCheckedChange={setAutoSwitchEnabled}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rotation Interval (minutes)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Failure Threshold</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                </div>
                
                <Button>Save Rotation Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Transactions</p>
                      <h3 className="text-2xl font-bold">1,247</h3>
                    </div>
                    <CreditCard className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <h3 className="text-2xl font-bold">98.5%</h3>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Failed Payments</p>
                      <h3 className="text-2xl font-bold">18</h3>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminUpiManagement;
