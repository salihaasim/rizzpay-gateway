
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Book, 
  Terminal, 
  Zap, 
  Shield, 
  Globe,
  Copy,
  ExternalLink,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Helmet } from 'react-helmet';

const DeveloperIntegration = () => {
  const sdks = [
    { name: "Node.js", version: "v2.1.0", status: "Stable" },
    { name: "Python", version: "v2.0.8", status: "Stable" },
    { name: "PHP", version: "v1.9.2", status: "Stable" },
    { name: "Java", version: "v1.8.5", status: "Stable" },
    { name: "React", version: "v3.0.1", status: "Beta" },
    { name: "Flutter", version: "v1.2.0", status: "Preview" }
  ];

  const features = [
    {
      icon: Code,
      title: "RESTful APIs",
      description: "Clean, intuitive REST APIs with comprehensive documentation"
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "OAuth 2.0 and API key authentication with rate limiting"
    },
    {
      icon: Zap,
      title: "Real-time Webhooks",
      description: "Instant notifications for all payment events"
    },
    {
      icon: Globe,
      title: "Multi-language SDKs",
      description: "Native SDKs for popular programming languages"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Developer Integration | RizzPay APIs</title>
        <meta name="description" content="Complete developer guide for integrating RizzPay payment APIs." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Terminal className="h-4 w-4 mr-1" />
            Developer Resources
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Build with RizzPay APIs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive developer tools and documentation to integrate payments seamlessly into your applications
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* SDK Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Available SDKs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdks.map((sdk, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{sdk.name}</CardTitle>
                    <Badge variant={sdk.status === 'Stable' ? 'default' : sdk.status === 'Beta' ? 'secondary' : 'outline'}>
                      {sdk.status}
                    </Badge>
                  </div>
                  <CardDescription>Version {sdk.version}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Book className="h-4 w-4 mr-2" />
                      Docs
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Code Examples */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Start Examples</h2>
          <Card>
            <CardHeader>
              <CardTitle>Integration Examples</CardTitle>
              <CardDescription>Choose your preferred language to see integration examples</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="php">PHP</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>
                
                <TabsContent value="javascript">
                  <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500">// JavaScript SDK</span>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>const RizzPay = require(&apos;rizzpay-sdk&apos;);</div>
                      <div>const client = new RizzPay(&apos;your-api-key&apos;);</div>
                      <div className="mt-4"></div>
                      <div>const payment = await client.payments.create(&#123;</div>
                      <div className="ml-4">amount: 1000,</div>
                      <div className="ml-4">currency: &apos;INR&apos;,</div>
                      <div className="ml-4">customer_email: &apos;user@example.com&apos;</div>
                      <div>&#125;);</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="python">
                  <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500"># Python SDK</span>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>import rizzpay</div>
                      <div>client = rizzpay.Client(&apos;your-api-key&apos;)</div>
                      <div className="mt-4"></div>
                      <div>payment = client.payments.create(&#123;</div>
                      <div className="ml-4">&apos;amount&apos;: 1000,</div>
                      <div className="ml-4">&apos;currency&apos;: &apos;INR&apos;,</div>
                      <div className="ml-4">&apos;customer_email&apos;: &apos;user@example.com&apos;</div>
                      <div>&#125;)</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="php">
                  <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500">// PHP SDK</span>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>use RizzPay\Client;</div>
                      <div>$client = new Client(&apos;your-api-key&apos;);</div>
                      <div className="mt-4"></div>
                      <div>$payment = $client-&gt;payments-&gt;create([</div>
                      <div className="ml-4">&apos;amount&apos; =&gt; 1000,</div>
                      <div className="ml-4">&apos;currency&apos; =&gt; &apos;INR&apos;,</div>
                      <div className="ml-4">&apos;customer_email&apos; =&gt; &apos;user@example.com&apos;</div>
                      <div>]);</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="curl">
                  <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500"># cURL</span>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div>curl -X POST https://api.rizzpay.com/v1/payments \</div>
                      <div className="ml-4">-H &quot;Authorization: Bearer your-api-key&quot; \</div>
                      <div className="ml-4">-H &quot;Content-Type: application/json&quot; \</div>
                      <div className="ml-4">-d &apos;&#123; \</div>
                      <div className="ml-8">&quot;amount&quot;: 1000,</div>
                      <div className="ml-8">&quot;currency&quot;: &quot;INR&quot;,</div>
                      <div className="ml-8">&quot;customer_email&quot;: &quot;user@example.com&quot;</div>
                      <div className="ml-4">&#125;&apos;</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Developer Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Book className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>Comprehensive API reference and guides</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Authentication</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Payment APIs</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Webhook Events</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Error Handling</li>
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  View Docs
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Terminal className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Sandbox Environment</CardTitle>
                <CardDescription>Test your integration safely</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Test API Keys</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Mock Payments</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Webhook Testing</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Debug Tools</li>
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  Access Sandbox
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Code className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>Ready-to-use code snippets</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Payment Forms</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Webhook Handlers</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Error Handling</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Best Practices</li>
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  Browse Examples
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Building?</h3>
              <p className="mb-6 opacity-90">
                Get your API keys and start integrating RizzPay into your application today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Get API Keys
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeveloperIntegration;
