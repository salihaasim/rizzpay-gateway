
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { generateUpiPayment } from '@/slam_engine/upiIntegration';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

const UpiPaymentLinkGenerator: React.FC = () => {
  const { currentMerchant } = useMerchantAuth();
  const [linkCopied, setLinkCopied] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    customerName: '',
    description: '',
  });

  const merchantId = currentMerchant?.username || 'merchant';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateLink = () => {
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      // Generate a UPI payment using the SLAM Engine
      const upiPayment = generateUpiPayment({
        amount: parseFloat(formData.amount),
        description: formData.description || 'Payment via RizzPay',
        merchantId: merchantId,
        merchantName: currentMerchant?.fullName || 'Merchant',
        customerName: formData.customerName || 'Customer',
      });

      // Set the payment link and QR code URL
      setPaymentLink(upiPayment.paymentUrl);
      setQrCodeUrl(upiPayment.qrCodeUrl);

      toast.success('Payment link generated successfully');
    } catch (error) {
      console.error('Error generating payment link:', error);
      toast.error('Failed to generate payment link');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    setLinkCopied(true);
    toast.success('Payment link copied to clipboard');
    
    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };

  const getEmbedCode = () => {
    return `<!-- RizzPay Payment Link Button -->
<script src="https://cdn.rizzpay.com/payment-link.js" 
  data-merchant="${merchantId}" 
  data-amount="${formData.amount || ''}" 
  data-description="${formData.description || ''}">
</script>
<button class="rizzpay-payment-button">Pay with RizzPay</button>`;
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    toast.success('Embed code copied to clipboard');
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <LinkIcon className="mr-2 h-5 w-5" />
          UPI Payment Link Generator
        </CardTitle>
        <CardDescription>
          Create shareable payment links for your customers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="customerName">Customer Name (Optional)</Label>
            <Input
              id="customerName"
              name="customerName"
              placeholder="Enter customer name"
              value={formData.customerName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Payment description"
            value={formData.description}
            onChange={handleInputChange}
            className="h-20"
          />
        </div>

        <Button onClick={generateLink} className="w-full">Generate Payment Link</Button>

        {paymentLink && (
          <div className="space-y-4 mt-4">
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Payment Link</h3>
              <div className="flex items-center space-x-2 relative">
                <Input
                  value={paymentLink}
                  readOnly
                  className="pr-10"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0"
                  onClick={handleCopy}
                >
                  {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {qrCodeUrl && (
              <div className="border rounded-md p-4 flex flex-col items-center">
                <h3 className="text-sm font-medium mb-2">Payment QR Code</h3>
                <div className="bg-white p-4 rounded-md border">
                  <img
                    src={qrCodeUrl}
                    alt="UPI QR Code"
                    className="h-48 w-48 object-contain"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Scan with any UPI app to pay</p>
              </div>
            )}

            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Website Integration</h3>
              <p className="text-xs text-muted-foreground mb-2">
                Copy this code to integrate the payment link button on your website
              </p>
              <div className="bg-muted p-4 rounded-md">
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{getEmbedCode()}</pre>
              </div>
              <div className="flex justify-end mt-2">
                <Button variant="ghost" size="sm" onClick={copyEmbedCode}>
                  <Copy className="h-3 w-3 mr-1" /> Copy Code
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center" 
                onClick={() => window.open(paymentLink, '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" /> Test Payment Link
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpiPaymentLinkGenerator;
