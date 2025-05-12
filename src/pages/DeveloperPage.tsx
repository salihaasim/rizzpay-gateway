
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebhookIntegration from '@/components/webhook/WebhookIntegration';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { Button } from '@/components/ui/button';
import { Download, FileText, Code, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const DeveloperPage = () => {
  const { currentMerchant } = useMerchantAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiDocumentContent, setApiDocumentContent] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API key fetch or generation
    const fetchApiKey = () => {
      // In a real app, this would come from your backend
      const mockApiKey = currentMerchant?.apiKey || "rzp_test_" + Math.random().toString(36).substring(2, 15);
      setApiKey(mockApiKey);
    };
    
    // Load API documentation from the text file
    const loadApiDocumentation = async () => {
      try {
        const response = await fetch('/src/rizzpay_live/RIZZPAY_API.txt');
        const text = await response.text();
        setApiDocumentContent(text);
      } catch (error) {
        console.error('Error loading API documentation:', error);
      }
    };
    
    fetchApiKey();
    loadApiDocumentation();
  }, [currentMerchant]);

  const handleRegenerateApiKey = () => {
    setIsGenerating(true);
    
    // Simulate API call to regenerate key
    setTimeout(() => {
      const newApiKey = "rzp_test_" + Math.random().toString(36).substring(2, 15);
      setApiKey(newApiKey);
      setIsGenerating(false);
    }, 1000);
  };

  const handleDownloadDocumentation = () => {
    if (!apiDocumentContent) return;
    
    // Create a Blob with the content
    const blob = new Blob([apiDocumentContent], { type: 'text/plain' });
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'RizzPay_API_Documentation.txt');
    
    // Append link to body, trigger click, and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Documentation downloaded successfully');
  };
  
  // Example API endpoints for documentation
  const apiEndpoints = [
    {
      name: "Create Payment",
      endpoint: "/v1/payments",
      method: "POST",
      description: "Create a new payment and generate payment link",
      parameters: "amount, currency, description, customer_email, customer_name",
      responseExample: `{
  "id": "pay_12345abcde",
  "amount": 1000,
  "currency": "INR",
  "status": "created",
  "payment_url": "https://api.rizzpay.co.in/pay/12345abcde"
}`
    },
    {
      name: "Get Payment Status",
      endpoint: "/v1/payments/{id}",
      method: "GET",
      description: "Check the status of an existing payment",
      parameters: "id (in URL)",
      responseExample: `{
  "id": "pay_12345abcde",
  "amount": 1000,
  "currency": "INR",
  "status": "completed",
  "transaction_id": "txn_98765zyxwv"
}`
    },
    {
      name: "Create Refund",
      endpoint: "/v1/refunds",
      method: "POST",
      description: "Initiate a refund for a completed payment",
      parameters: "payment_id, amount, reason",
      responseExample: `{
  "id": "ref_12345abcde",
  "payment_id": "pay_12345abcde",
  "amount": 1000,
  "status": "processing"
}`
    },
    {
      name: "Generate UPI QR Code",
      endpoint: "/v1/upi/qr",
      method: "POST",
      description: "Generate a UPI QR code for payment",
      parameters: "amount, upi_id, description",
      responseExample: `{
  "id": "qr_12345abcde",
  "qr_image_url": "https://api.rizzpay.co.in/qr/12345abcde.png",
  "upi_url": "upi://pay?pa=merchant@rizzpay&pn=RizzPay&am=1000.00"
}`
    }
  ];
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Developer Integration</h1>
            <p className="text-muted-foreground mt-2">
              Integrate RizzPay's payment solutions into your applications.
            </p>
          </div>

          <Tabs defaultValue="api" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="webhook">Webhook</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Reference</CardTitle>
                  <CardDescription>
                    Access our RESTful API endpoints for payment processing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Your API Key</h3>
                        <p className="text-sm font-mono mt-1">{apiKey}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleRegenerateApiKey}
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Generating...' : 'Regenerate'}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Keep this key secret. Use it to authenticate all API requests.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">API Endpoints</h3>
                    <Accordion type="single" collapsible className="w-full">
                      {apiEndpoints.map((endpoint, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 text-xs rounded-md ${
                                endpoint.method === "GET" ? "bg-blue-100 text-blue-800" : 
                                "bg-green-100 text-green-800"
                              }`}>
                                {endpoint.method}
                              </span>
                              <span>{endpoint.name}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 pl-2">
                              <div>
                                <span className="font-semibold">Endpoint:</span> 
                                <code className="ml-2 px-2 py-0.5 bg-muted rounded font-mono text-sm">
                                  {endpoint.endpoint}
                                </code>
                              </div>
                              <div>
                                <span className="font-semibold">Description:</span> 
                                <span className="ml-2">{endpoint.description}</span>
                              </div>
                              <div>
                                <span className="font-semibold">Parameters:</span> 
                                <span className="ml-2">{endpoint.parameters}</span>
                              </div>
                              <div>
                                <span className="font-semibold">Example Response:</span>
                                <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto">
                                  {endpoint.responseExample}
                                </pre>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleDownloadDocumentation} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Full API Docs
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="webhook">
              <Card>
                <CardHeader>
                  <CardTitle>Webhook Integration</CardTitle>
                  <CardDescription>
                    Set up webhooks to receive real-time payment notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WebhookIntegration 
                    apiKey={apiKey} 
                    onRegenerateApiKey={handleRegenerateApiKey}
                    isRegenerating={isGenerating}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="docs">
              <Card>
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>
                    Comprehensive guides to help you integrate our payment solutions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Getting Started Guide</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Step-by-step guide to integrate RizzPay into your application
                      </p>
                      <Button variant="outline" size="sm" className="w-full">View Guide</Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Code Samples</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Example code in various languages for integrating RizzPay
                      </p>
                      <Button variant="outline" size="sm" className="w-full">View Samples</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Full Documentation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Download our comprehensive API documentation for offline reference
                    </p>
                    <Button 
                      variant="default" 
                      className="gap-2" 
                      onClick={handleDownloadDocumentation}
                    >
                      <Download className="h-4 w-4" />
                      Download Documentation
                    </Button>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Need Help?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our support team is available to help you with integration questions
                    </p>
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default DeveloperPage;
