
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  User, 
  CreditCard, 
  Settings, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const AdminActivityLog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [selectedActivityType, setSelectedActivityType] = useState('all');

  // Mock activity logs data
  const [activityLogs] = useState([
    {
      id: '1',
      timestamp: '2024-01-15 10:30:00',
      activityType: 'user_login',
      userEmail: 'merchant@example.com',
      userName: 'John Merchant',
      description: 'User logged into merchant dashboard',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'info',
      details: { sessionId: 'sess_123456', location: 'Mumbai, India' }
    },
    {
      id: '2',
      timestamp: '2024-01-15 10:25:00',
      activityType: 'payment_created',
      userEmail: 'merchant@example.com',
      userName: 'John Merchant',
      description: 'New payment transaction created',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'info',
      details: { transactionId: 'txn_789012', amount: 1500, currency: 'INR' }
    },
    {
      id: '3',
      timestamp: '2024-01-15 10:20:00',
      activityType: 'api_key_generated',
      userEmail: 'admin@rizzpay.com',
      userName: 'Admin User',
      description: 'New API key generated for merchant',
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'warning',
      details: { merchantId: 'mer_345678', keyType: 'production' }
    },
    {
      id: '4',
      timestamp: '2024-01-15 09:45:00',
      activityType: 'failed_login',
      userEmail: 'unknown@example.com',
      userName: 'Unknown',
      description: 'Failed login attempt',
      ipAddress: '203.192.45.67',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      severity: 'error',
      details: { reason: 'invalid_credentials', attempts: 3 }
    },
    {
      id: '5',
      timestamp: '2024-01-15 09:30:00',
      activityType: 'merchant_verified',
      userEmail: 'admin@rizzpay.com',
      userName: 'Admin User',
      description: 'Merchant KYC verification completed',
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'info',
      details: { merchantId: 'mer_234567', verificationLevel: 'full' }
    },
    {
      id: '6',
      timestamp: '2024-01-15 09:15:00',
      activityType: 'payout_processed',
      userEmail: 'merchant2@example.com',
      userName: 'Jane Merchant',
      description: 'Payout request processed successfully',
      ipAddress: '192.168.1.200',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      severity: 'info',
      details: { payoutId: 'pay_456789', amount: 25000, bankAccount: '****1234' }
    },
    {
      id: '7',
      timestamp: '2024-01-15 08:50:00',
      activityType: 'webhook_failed',
      userEmail: 'system@rizzpay.com',
      userName: 'System',
      description: 'Webhook delivery failed',
      ipAddress: '10.0.0.100',
      userAgent: 'RizzPay-Webhook/1.0',
      severity: 'error',
      details: { webhookUrl: 'https://merchant.com/webhook', responseCode: 500, retryCount: 3 }
    },
    {
      id: '8',
      timestamp: '2024-01-15 08:30:00',
      activityType: 'settings_updated',
      userEmail: 'admin@rizzpay.com',
      userName: 'Admin User',
      description: 'System settings updated',
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      severity: 'warning',
      details: { settingType: 'api_rate_limit', oldValue: '100', newValue: '150' }
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'critical':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'user_login':
      case 'failed_login':
        return <User className="h-4 w-4" />;
      case 'payment_created':
      case 'payout_processed':
        return <CreditCard className="h-4 w-4" />;
      case 'settings_updated':
      case 'api_key_generated':
        return <Settings className="h-4 w-4" />;
      case 'merchant_verified':
        return <Shield className="h-4 w-4" />;
      case 'webhook_failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.activityType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedActivityType === 'all' || log.activityType === selectedActivityType;
    
    return matchesSearch && matchesType;
  });

  const exportLogs = () => {
    toast.success('Activity logs exported successfully');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
            <p className="text-muted-foreground">Monitor all system activities and user actions</p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <Button variant="outline" onClick={exportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Activities</p>
                  <h3 className="text-2xl font-bold">8,426</h3>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Activities</p>
                  <h3 className="text-2xl font-bold">142</h3>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Failed Events</p>
                  <h3 className="text-2xl font-bold">12</h3>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <h3 className="text-2xl font-bold">89</h3>
                </div>
                <User className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities, users, or events..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedActivityType} onValueChange={setSelectedActivityType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="user_login">User Login</SelectItem>
                  <SelectItem value="payment_created">Payment Created</SelectItem>
                  <SelectItem value="payout_processed">Payout Processed</SelectItem>
                  <SelectItem value="api_key_generated">API Key Generated</SelectItem>
                  <SelectItem value="merchant_verified">Merchant Verified</SelectItem>
                  <SelectItem value="settings_updated">Settings Updated</SelectItem>
                  <SelectItem value="webhook_failed">Webhook Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent">Recent Activities</TabsTrigger>
            <TabsTrigger value="security">Security Events</TabsTrigger>
            <TabsTrigger value="payments">Payment Activities</TabsTrigger>
            <TabsTrigger value="system">System Events</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <CardDescription>
                  {filteredLogs.length} activities found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredLogs.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        {getActivityIcon(activity.activityType)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm">{activity.description}</p>
                              <Badge className={getSeverityColor(activity.severity)}>
                                {activity.severity}
                              </Badge>
                            </div>
                            
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>
                                <span className="font-medium">User:</span> {activity.userName} ({activity.userEmail})
                              </p>
                              <p>
                                <span className="font-medium">Time:</span> {activity.timestamp} • 
                                <span className="font-medium ml-2">IP:</span> {activity.ipAddress}
                              </p>
                              {activity.details && Object.keys(activity.details).length > 0 && (
                                <p>
                                  <span className="font-medium">Details:</span> {JSON.stringify(activity.details)}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredLogs.filter(log => 
                    log.activityType.includes('login') || 
                    log.activityType.includes('api_key') ||
                    log.severity === 'error'
                  ).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-red-500" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{activity.description}</p>
                          <Badge className={getSeverityColor(activity.severity)}>
                            {activity.severity}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          <p>{activity.timestamp} • {activity.ipAddress}</p>
                          <p>User: {activity.userEmail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredLogs.filter(log => 
                    log.activityType.includes('payment') || 
                    log.activityType.includes('payout')
                  ).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="h-5 w-5 text-green-500" />
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.description}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          <p>{activity.timestamp} • {activity.userEmail}</p>
                          {activity.details && (
                            <p>Amount: ₹{activity.details.amount?.toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredLogs.filter(log => 
                    log.activityType.includes('settings') || 
                    log.activityType.includes('webhook') ||
                    log.userEmail.includes('system')
                  ).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Settings className="h-5 w-5 text-blue-500" />
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.description}</p>
                        <div className="text-xs text-muted-foreground mt-1">
                          <p>{activity.timestamp} • {activity.userEmail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminActivityLog;
