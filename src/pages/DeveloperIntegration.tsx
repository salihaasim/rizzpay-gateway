import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, Copy, Code, Server, Globe, Key, AlertCircle, Webhook, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useMobile } from '@/hooks/use-mobile';
import { motion } from '@/components/ui/motion';

const DeveloperIntegration: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("api-keys");
  const isMobile = useMobile();
  
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
    
    toast.success('Copied to clipboard!');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="container py-6 md:py-10 max-w-6xl px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-6">Developer Integration</h1>
        <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
          Integrate Rizzpay payment solutions into your applications with our API documentation and tools.
        </p>
      </motion.div>
      
      <Tabs defaultValue="api-keys" className="w-full" onValueChange={handleTabChange}>
        <TabsList className={`grid ${isMobile ? 'grid-cols-2 gap-2 mb-4' : 'grid-cols-4 mb-8'} w-full`}>
          <TabsTrigger value="api-keys" className="flex items-center gap-2 text-xs md:text-sm">
            <Key className="h-3 w-3 md:h-4 md:w-4" />
            <span>API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="web-integration" className="flex items-center gap-2 text-xs md:text-sm">
            <Globe className="h-3 w-3 md:h-4 md:w-4" />
            <span>Web Integration</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2 text-xs md:text-sm">
            <Webhook className="h-3 w-3 md:h-4 md:w-4" />
            <span>Webhooks</span>
          </TabsTrigger>
          <TabsTrigger value="payment-methods" className="flex items-center gap-2 text-xs md:text-sm">
            <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
            <span>Payment Methods</span>
          </TabsTrigger>
        </TabsList>
        
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <TabsContent value="api-keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">API Keys</CardTitle>
                <CardDescription>
                  Secure keys to authenticate your integration with our payment API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Production API Key</Label>
                  <div className="flex items-center">
                    <Input 
                      type="password" 
                      value="••••••••••••••••••••••••••" 
                      readOnly 
                      className="flex-1 font-mono text-xs md:text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-2" 
                      onClick={() => handleCopy("rzp_live_XXXXXXXXXXXXX", "production")}
                    >
                      {copied === "production" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Use for live transactions in production environment.</p>
                </div>
                
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label className="text-sm font-medium">Test API Key</Label>
                  <div className="flex items-center">
                    <Input 
                      value="rzp_test_JXIkZl2p0iUbRw" 
                      readOnly 
                      className="flex-1 font-mono text-xs md:text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-2" 
                      onClick={() => handleCopy("rzp_test_JXIkZl2p0iUbRw", "test")}
                    >
                      {copied === "test" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Use for testing in development environment.</p>
                </motion.div>
                
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Security Notice</AlertTitle>
                  <AlertDescription>
                    Never expose your API keys in client-side code or public repositories.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="web-integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Web Integration</CardTitle>
                <CardDescription>
                  Integrate payment functionality directly into your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">Quick Start</Label>
                  <div className="bg-muted p-4 rounded-md overflow-x-auto text-xs md:text-sm">
                    <pre className="text-xs md:text-sm">
                      <code>{`
// 1. Include the Razorpay script
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

// 2. Configure payment options
const options = {
  key: "rzp_test_JXIkZl2p0iUbRw", // Your API Key
  amount: 50000, // Amount in paise (500 INR)
  currency: "INR",
  name: "Your Business Name",
  description: "Test Transaction",
  order_id: "order_id_from_backend", // Generated from your backend
  handler: function (response) {
    // Handle success
    alert("Payment ID: " + response.razorpay_payment_id);
  },
  prefill: {
    name: "Customer Name",
    email: "customer@example.com"
  },
  theme: {
    color: "#2563eb"
  }
};

// 3. Initialize Razorpay
const paymentObject = new Razorpay(options);
paymentObject.open();
                      `}</code>
                    </pre>
                  </div>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => handleCopy(`// 1. Include the Razorpay script
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

// 2. Configure payment options
const options = {
  key: "rzp_test_JXIkZl2p0iUbRw", // Your API Key
  amount: 50000, // Amount in paise (500 INR)
  currency: "INR",
  name: "Your Business Name",
  description: "Test Transaction",
  order_id: "order_id_from_backend", // Generated from your backend
  handler: function (response) {
    // Handle success
    alert("Payment ID: " + response.razorpay_payment_id);
  },
  prefill: {
    name: "Customer Name",
    email: "customer@example.com"
  },
  theme: {
    color: "#2563eb"
  }
};

// 3. Initialize Razorpay
const paymentObject = new Razorpay(options);
paymentObject.open();`, "code")}
                  >
                    {copied === "code" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy Code
                  </Button>
                </div>
                
                <motion.div 
                  className="space-y-4 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label className="text-base font-medium">Backend Integration</Label>
                  <p className="text-sm text-muted-foreground">
                    You need to create an order on your backend before initializing payment:
                  </p>
                  <div className="bg-muted p-4 rounded-md overflow-x-auto">
                    <pre className="text-xs md:text-sm">
                      <code>{`
// Example Node.js code to create an order
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.post('/create-order', async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount * 100, // amount in paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now()
    });
    
    res.json({
      orderId: order.id
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
                      `}</code>
                    </pre>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Webhooks</CardTitle>
                <CardDescription>
                  Receive real-time payment events on your server
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm">
                  Configure webhooks to get notified when payment events occur. Webhooks allow your application
                  to receive real-time updates about payment status changes.
                </p>
                
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://example.com/webhook/payment"
                    className="text-xs md:text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your server endpoint that will receive webhook events
                  </p>
                </motion.div>
                
                <motion.div 
                  className="space-y-4 mt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label className="text-base font-medium">Webhook Events</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="payment-authorized" className="rounded border-gray-300" defaultChecked />
                      <label htmlFor="payment-authorized" className="text-sm">Payment Authorized</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="payment-failed" className="rounded border-gray-300" defaultChecked />
                      <label htmlFor="payment-failed" className="text-sm">Payment Failed</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="payment-captured" className="rounded border-gray-300" defaultChecked />
                      <label htmlFor="payment-captured" className="text-sm">Payment Captured</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="refund-initiated" className="rounded border-gray-300" />
                      <label htmlFor="refund-initiated" className="text-sm">Refund Initiated</label>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="space-y-4 mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="webhook-secret">Webhook Secret</Label>
                  <div className="flex items-center">
                    <Input
                      id="webhook-secret"
                      type="password"
                      value="••••••••••••••••••••••••••"
                      readOnly
                      className="text-xs md:text-sm"
                    />
                    <Button variant="outline" size="sm" className="ml-2">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use this secret to verify webhook signatures
                  </p>
                </motion.div>
                
                <div className="mt-6">
                  <Button className="w-full md:w-auto">Save Webhook Configuration</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment-methods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Available Payment Methods</CardTitle>
                <CardDescription>
                  Configure which payment methods to accept in your integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <motion.div 
                    className="border rounded-lg p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                      <div>
                        <h3 className="font-medium">Credit/Debit Cards</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">All major cards accepted</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">Visa</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">Mastercard</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">RuPay</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">American Express</span>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="border rounded-lg p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6 md:h-8 md:w-8">
                        <path d="M8 9v6" />
                        <path d="M16 15V9" />
                        <path d="M12 12h4" />
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      </svg>
                      <div>
                        <h3 className="font-medium">UPI</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">Unified Payments Interface</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">Google Pay</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">PhonePe</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">Paytm</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">BHIM</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="border rounded-lg p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center space-x-3">
                      <Server className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                      <div>
                        <h3 className="font-medium">Net Banking</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">Bank transfers</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">HDFC Bank</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">ICICI Bank</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">SBI</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">Other Banks</span>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="border rounded-lg p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6 md:h-8 md:w-8">
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                      </svg>
                      <div>
                        <h3 className="font-medium">Wallets</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">Digital wallets</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">Paytm Wallet</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">Amazon Pay</span>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">MobiKwik</span>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm">Freecharge</span>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button className="w-full md:w-auto">Save Payment Methods</Button>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default DeveloperIntegration;
