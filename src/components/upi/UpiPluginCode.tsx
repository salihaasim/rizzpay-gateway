
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Code, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';

const UpiPluginCode: React.FC = () => {
  const { currentMerchant } = useMerchantAuth();
  const [copied, setCopied] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [customMerchantId, setCustomMerchantId] = useState('');
  
  const merchantId = customMerchantId || currentMerchant?.username || 'merchant';
  
  // Generate script that the merchant can embed on their website
  const generatePluginCode = (amount?: string) => {
    const amountParam = amount ? `data-amount="${amount}"` : 'data-amount="auto"';
    return `<script src="https://cdn.rizzpay.com/upi-plugin.js" ${amountParam} data-merchant="${merchantId}"></script>
<button class="rizzpay-upi-button">Pay with RizzPay UPI</button>`;
  };
  
  // Generate different integration methods code snippets
  const generateHtmlSnippet = (amount?: string) => {
    return generatePluginCode(amount);
  };
  
  const generateReactSnippet = (amount?: string) => {
    const amountStr = amount ? ` data-amount="${amount}"` : '';
    return `// React Component
import React, { useEffect } from 'react';

const RizzPayButton = ({ onSuccess }) => {
  useEffect(() => {
    // Load RizzPay script
    const script = document.createElement('script');
    script.src = 'https://cdn.rizzpay.com/upi-plugin.js';
    script.setAttribute('data-merchant', '${merchantId}');
    script.setAttribute('data-amount', '${amount || 'auto'}');
    script.async = true;
    
    // Setup callback
    window.RizzPayCallback = (response) => {
      if (response.status === 'success') {
        onSuccess && onSuccess(response.transactionId);
      }
    };
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [onSuccess]);
  
  return (
    <button className="rizzpay-upi-button">
      Pay with RizzPay UPI
    </button>
  );
};

export default RizzPayButton;`;
  };
  
  const generateJavaScriptSnippet = (amount?: string) => {
    return `// Vanilla JavaScript Integration
document.addEventListener('DOMContentLoaded', () => {
  // Create script element
  const script = document.createElement('script');
  script.src = 'https://cdn.rizzpay.com/upi-plugin.js';
  script.setAttribute('data-merchant', '${merchantId}');
  script.setAttribute('data-amount', '${amount || 'auto'}');
  
  // Add success callback
  window.RizzPayCallback = function(response) {
    if (response.status === 'success') {
      console.log('Payment successful!', response.transactionId);
      // Handle success - update UI, redirect, etc.
    }
  };
  
  // Add to document
  document.body.appendChild(script);
  
  // Find buttons and initialize
  const buttons = document.querySelectorAll('.rizzpay-upi-button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // You can optionally set dynamic amount here
      window.RizzPay.openPayment({
        amount: ${amount ? amount : 'document.getElementById("price").value'},
        description: 'Purchase from My Store'
      });
    });
  });
});`;
  };
  
  const generatePHPSnippet = (amount?: string) => {
    return `<?php
// PHP Integration

// 1. Add this to your HTML head or before closing body
echo '<script src="https://cdn.rizzpay.com/upi-plugin.js" data-merchant="${merchantId}" data-amount="${amount || 'auto'}"></script>';

// 2. Create a payment button
function rizzpay_payment_button($label = 'Pay Now', $amount = null, $description = 'Payment') {
  $button_id = 'rizzpay_' . uniqid();
  $amount_attr = $amount ? 'data-amount="' . htmlspecialchars($amount) . '"' : '';
  $desc_attr = 'data-description="' . htmlspecialchars($description) . '"';
  
  return '<button id="' . $button_id . '" class="rizzpay-upi-button" ' 
    . $amount_attr . ' ' . $desc_attr . '>' 
    . htmlspecialchars($label) . '</button>';
}

// 3. Use the function in your template
echo rizzpay_payment_button('Pay with UPI', '${amount || '99.00'}', 'Product purchase');

// 4. Server-side verification (webhook handling)
function verify_rizzpay_payment($transaction_id) {
  $api_key = 'YOUR_API_KEY'; // Get from RizzPay dashboard
  $verify_url = 'https://api.rizzpay.com/v1/transactions/verify';
  
  $ch = curl_init($verify_url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'transaction_id' => $transaction_id
  ]));
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $api_key,
    'Content-Type: application/json'
  ]);
  
  $response = curl_exec($ch);
  curl_close($ch);
  
  return json_decode($response, true);
}
?>`;
  };

  const pluginCode = generatePluginCode(customAmount || undefined);
  
  const handleCopy = (value: string, type: string) => {
    navigator.clipboard.writeText(value);
    setCopied(type);
    toast.success(`${type} code copied to clipboard`);
    
    setTimeout(() => {
      setCopied(null);
    }, 3000);
  };

  return (
    <Card className="max-w-3xl shadow-md border border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-[#0052FF]" />
          UPI Plugin Integration Code
        </CardTitle>
        <CardDescription>
          Copy these code snippets to add the RizzPay UPI payment popup to your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Pre-set Amount (Optional)</Label>
              <Input
                id="amount" 
                type="number" 
                placeholder="Enter amount or leave blank for dynamic pricing"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Leave blank if the amount will be determined by your website at runtime
              </p>
            </div>
            
            <div>
              <Label htmlFor="merchantId">Custom Merchant ID (Optional)</Label>
              <Input
                id="merchantId" 
                placeholder={currentMerchant?.username || "Enter merchant ID"}
                value={customMerchantId}
                onChange={(e) => setCustomMerchantId(e.target.value)}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Leave blank to use your account's merchant ID
              </p>
            </div>
          </div>
          
          <Tabs defaultValue="html" className="mt-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="js">JavaScript</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="php">PHP</TabsTrigger>
            </TabsList>
            
            <TabsContent value="html" className="mt-4">
              <div className="relative">
                <Label className="text-sm font-medium mb-2 block">HTML Integration</Label>
                <div className="bg-muted p-4 rounded-md overflow-x-auto relative">
                  <pre className="text-sm whitespace-pre-wrap">
                    <code>{generateHtmlSnippet(customAmount)}</code>
                  </pre>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(generateHtmlSnippet(customAmount), 'HTML')}
                  >
                    {copied === 'HTML' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="js" className="mt-4">
              <div className="relative">
                <Label className="text-sm font-medium mb-2 block">JavaScript Integration</Label>
                <div className="bg-muted p-4 rounded-md overflow-x-auto relative">
                  <pre className="text-sm whitespace-pre-wrap">
                    <code>{generateJavaScriptSnippet(customAmount)}</code>
                  </pre>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(generateJavaScriptSnippet(customAmount), 'JavaScript')}
                  >
                    {copied === 'JavaScript' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="react" className="mt-4">
              <div className="relative">
                <Label className="text-sm font-medium mb-2 block">React Integration</Label>
                <div className="bg-muted p-4 rounded-md overflow-x-auto relative">
                  <pre className="text-sm whitespace-pre-wrap">
                    <code>{generateReactSnippet(customAmount)}</code>
                  </pre>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(generateReactSnippet(customAmount), 'React')}
                  >
                    {copied === 'React' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="php" className="mt-4">
              <div className="relative">
                <Label className="text-sm font-medium mb-2 block">PHP Integration</Label>
                <div className="bg-muted p-4 rounded-md overflow-x-auto relative">
                  <pre className="text-sm whitespace-pre-wrap">
                    <code>{generatePHPSnippet(customAmount)}</code>
                  </pre>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(generatePHPSnippet(customAmount), 'PHP')}
                  >
                    {copied === 'PHP' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <h4 className="font-medium text-amber-800 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Integration Instructions
            </h4>
            <ol className="text-sm text-amber-700 mt-2 space-y-2 list-decimal list-inside">
              <li>Add the code to your website based on your tech stack</li>
              <li>Customize the button appearance with CSS using the <code className="bg-amber-100 px-1 rounded">.rizzpay-upi-button</code> selector</li>
              <li>When clicked, the UPI popup will open with your merchant details</li>
              <li>You can verify transactions using our API or receive webhooks</li>
              <li>Login to your RizzPay merchant dashboard to view and verify submitted transactions</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpiPluginCode;
