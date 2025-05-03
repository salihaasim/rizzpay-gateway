
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

const UpiPluginCode: React.FC = () => {
  const { currentMerchant } = useMerchantAuth();
  const [copied, setCopied] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  
  const merchantId = currentMerchant?.username || 'merchant';
  
  // Generate script that the merchant can embed on their website
  const generatePluginCode = (amount?: string) => {
    const amountParam = amount ? `data-amount="${amount}"` : 'data-amount="auto"';
    return `<script src="https://cdn.rizzpay.com/upi-plugin.js" ${amountParam} data-merchant="${merchantId}"></script>
<button class="rizzpay-upi-button">Pay with RizzPay UPI</button>`;
  };
  
  const pluginCode = generatePluginCode(customAmount || undefined);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(pluginCode);
    setCopied(true);
    toast.success('Plugin code copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>UPI Plugin Integration Code</CardTitle>
        <CardDescription>
          Copy this code snippet to add the RizzPay UPI payment popup to your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
            <Label htmlFor="code">Plugin Code</Label>
            <div className="relative mt-1">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                <code>{pluginCode}</code>
              </pre>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <h4 className="font-medium text-amber-800">Integration Instructions</h4>
            <ol className="text-sm text-amber-700 mt-2 space-y-2 list-decimal list-inside">
              <li>Add the above script to your website's HTML before the closing &lt;/body&gt; tag</li>
              <li>Add a button with the class "rizzpay-upi-button" where you want the payment button to appear</li>
              <li>When clicked, the UPI popup will open with your merchant details</li>
              <li>You can customize the button appearance with CSS using the .rizzpay-upi-button selector</li>
              <li>Login to your RizzPay merchant dashboard to view and verify submitted transactions</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpiPluginCode;
