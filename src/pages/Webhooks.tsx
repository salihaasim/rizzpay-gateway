
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Webhooks: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = React.useState('');
  const [secretKey, setSecretKey] = React.useState('');
  const [activeWebhook, setActiveWebhook] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [testStatus, setTestStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Sample webhook events (in a real app, fetch these from your API)
  const webhookEvents = [
    { id: 'payment.success', enabled: true, count: 124, description: 'Triggered when a payment is successful' },
    { id: 'payment.failed', enabled: true, count: 36, description: 'Triggered when a payment fails' },
    { id: 'refund.initiated', enabled: false, count: 8, description: 'Triggered when a refund is initiated' },
    { id: 'dispute.created', enabled: false, count: 2, description: 'Triggered when a dispute is created' }
  ];

  // Sample webhook logs (in a real app, fetch these from your API)
  const webhookLogs = [
    { id: 1, event: 'payment.success', status: 'delivered', time: '2023-09-15T10:34:23Z', responseCode: 200 },
    { id: 2, event: 'payment.success', status: 'delivered', time: '2023-09-14T14:12:45Z', responseCode: 200 },
    { id: 3, event: 'payment.failed', status: 'delivered', time: '2023-09-13T08:23:11Z', responseCode: 200 },
    { id: 4, event: 'payment.failed', status: 'failed', time: '2023-09-12T19:45:32Z', responseCode: 500 },
    { id: 5, event: 'refund.initiated', status: 'delivered', time: '2023-09-10T11:22:09Z', responseCode: 200 }
  ];

  const handleSaveWebhook = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Webhook configuration saved successfully');
    }, 1000);
  };

  const handleTestWebhook = () => {
    setTestStatus('loading');
    setTimeout(() => {
      setTestStatus('success');
      toast.success('Webhook test delivered successfully');
    }, 2000);
  };

  const toggleWebhookActive = () => {
    setActiveWebhook(!activeWebhook);
    toast.success(`Webhook ${!activeWebhook ? 'activated' : 'deactivated'}`);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Webhook Management</h1>
        
        <Tabs defaultValue="settings">
          <TabsList className="mb-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Webhook Configuration</CardTitle>
                    <CardDescription>Configure your webhook endpoint and security</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="webhook-active">Active</Label>
                    <Switch 
                      id="webhook-active" 
                      checked={activeWebhook} 
                      onCheckedChange={toggleWebhookActive} 
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://yourdomain.com/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send HTTP POST requests to this URL for all enabled events
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="secret-key">Secret Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secret-key"
                      type="password"
                      placeholder="••••••••••••••••"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                    />
                    <Button variant="outline" onClick={() => setSecretKey(Math.random().toString(36).substring(2, 15))}>
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Used to verify webhook signatures. Keep this secret.
                  </p>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleTestWebhook}
                    disabled={!webhookUrl || testStatus === 'loading'}
                  >
                    {testStatus === 'loading' ? 'Testing...' : 'Test Webhook'}
                  </Button>
                  <Button onClick={handleSaveWebhook} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Configuration'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Events</CardTitle>
                <CardDescription>Select which events should trigger webhook notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhookEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">{event.id}</p>
                        <p className="text-sm text-gray-500">{event.description}</p>
                        <p className="text-xs text-gray-400">{event.count} deliveries</p>
                      </div>
                      <Switch defaultChecked={event.enabled} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Logs</CardTitle>
                <CardDescription>Recent webhook delivery attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2 font-medium">Event</th>
                        <th className="py-2 font-medium">Status</th>
                        <th className="py-2 font-medium">Time</th>
                        <th className="py-2 font-medium">Response</th>
                        <th className="py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {webhookLogs.map((log) => (
                        <tr key={log.id} className="border-b">
                          <td className="py-2">{log.event}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 text-xs rounded ${
                              log.status === 'delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-2">{new Date(log.time).toLocaleString()}</td>
                          <td className="py-2">{log.responseCode}</td>
                          <td className="py-2">
                            <Button variant="ghost" size="sm">View Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Webhooks;
