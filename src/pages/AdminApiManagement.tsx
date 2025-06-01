
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Activity, 
  Shield, 
  Globe, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Monitor,
  Lock,
  Clock,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminApiManagement = () => {
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState(true);
  const [signatureValidationEnabled, setSignatureValidationEnabled] = useState(true);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Management</h1>
          <p className="text-muted-foreground">
            Manage API gateway features and configurations
          </p>
        </div>

        <Tabs defaultValue="gateway" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gateway" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Gateway
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Webhooks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gateway" className="space-y-6">
            {/* API Gateway Layer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  API Gateway Layer
                </CardTitle>
                <CardDescription>Core gateway features and implementations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* REST API Client */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">REST API Client</CardTitle>
                      <Badge variant="secondary">Required Feature</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Implementation</span>
                          <Badge variant="outline">Axios/Go HTTP client with auth</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          HTTP client with authentication headers and request/response handling
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Active</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Retry Handler */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Retry Handler</CardTitle>
                      <Badge variant="secondary">Required Feature</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Implementation</span>
                          <Badge variant="outline">Exponential backoff mechanism</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Automatic retry with exponential backoff for failed requests
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Active</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Signature Validator */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Signature Validator</CardTitle>
                      <Badge variant="secondary">Required Feature</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Implementation</span>
                          <Badge variant="outline">HMAC/SHA256 verification</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Cryptographic signature validation for webhook security
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Active</span>
                          </div>
                          <Switch
                            checked={signatureValidationEnabled}
                            onCheckedChange={setSignatureValidationEnabled}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* IP Whitelisting */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">IP Whitelisting</CardTitle>
                      <Badge variant="secondary">Required Feature</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Implementation</span>
                          <Badge variant="outline">Middleware enforcement</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          IP-based access control with middleware enforcement
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Active</span>
                          </div>
                          <Switch
                            checked={ipWhitelistEnabled}
                            onCheckedChange={setIpWhitelistEnabled}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Configuration
                </CardTitle>
                <CardDescription>Security features and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Rate Limiting */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Rate Limiting</CardTitle>
                      <Badge variant="secondary">Required Feature</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Implementation</span>
                          <Badge variant="outline">Redis + token bucket (500 RPM)</Badge>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Rate Limit (requests per minute)</Label>
                          <Input type="number" defaultValue="500" className="h-8" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Active</span>
                          </div>
                          <Switch
                            checked={rateLimitEnabled}
                            onCheckedChange={setRateLimitEnabled}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* API Logging */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">API Logging</CardTitle>
                      <Badge variant="secondary">Required Feature</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Implementation</span>
                          <Badge variant="outline">Log each API call with status</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Comprehensive logging of all API requests and responses
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Active</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            {/* Monitoring Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  API Performance Monitoring
                </CardTitle>
                <CardDescription>Real-time API metrics and performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Total Requests</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">1,234</div>
                      <div className="text-xs text-muted-foreground">Last 24 hours</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Success Rate</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">99.2%</div>
                      <div className="text-xs text-muted-foreground">Last 24 hours</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Avg Response</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">245ms</div>
                      <div className="text-xs text-muted-foreground">Last 24 hours</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">Error Rate</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">0.8%</div>
                      <div className="text-xs text-muted-foreground">Last 24 hours</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            {/* Webhook Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Callback Listener
                </CardTitle>
                <CardDescription>Webhook consumer and callback management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Callback Listener</CardTitle>
                      <Badge variant="secondary">Required Feature</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Implementation</span>
                          <Badge variant="outline">Webhook consumer `/callback`</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Endpoint for receiving webhook callbacks from payment processors
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Active</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Webhook Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">HDFC Bank</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">SBM Bank</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">ICICI Bank</span>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Testing</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminApiManagement;
