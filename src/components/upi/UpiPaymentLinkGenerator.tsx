
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Copy, Check, ExternalLink, Link as LinkIcon, QrCode, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateUpiPayment } from '@/slam_engine/upiIntegration';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

const UpiPaymentLinkGenerator: React.FC = () => {
  const { currentMerchant } = useMerchantAuth();
  const [linkCopied, setLinkCopied] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isStaticQR, setIsStaticQR] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    customerName: '',
    customerEmail: '',
    description: '',
  });

  const merchantId = currentMerchant?.username || 'merchant';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateLink = () => {
    if (!isStaticQR && (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0)) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      // Generate a UPI payment using the SLAM Engine
      const upiPayment = generateUpiPayment({
        amount: isStaticQR ? 0 : parseFloat(formData.amount),
        description: formData.description || 'Payment via RizzPay',
        merchantId: merchantId,
        merchantName: currentMerchant?.fullName || 'Merchant',
        customerName: formData.customerName || 'Customer',
      });

      // Set the payment link and QR code URL
      setPaymentLink(upiPayment.paymentUrl);
      setQrCodeUrl(upiPayment.qrCodeUrl);
      
      // Create the payment collection link
      const baseUrl = window.location.origin;
      const collectionLink = `${baseUrl}/upi-payment?${!isStaticQR ? `amount=${formData.amount}&` : ''}mid=${merchantId}&name=${encodeURIComponent(currentMerchant?.fullName || 'Merchant')}&desc=${encodeURIComponent(formData.description || 'Payment via RizzPay')}&email=${encodeURIComponent(formData.customerEmail || '')}&customer=${encodeURIComponent(formData.customerName || '')}${isStaticQR ? '&static=true' : ''}`;
      
      // Update the payment link to our custom link
      setPaymentLink(collectionLink);

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

  const sharePaymentLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'RizzPay Payment Link',
        text: `Payment request from ${currentMerchant?.fullName || 'Merchant'}`,
        url: paymentLink,
      }).then(() => {
        toast.success('Payment link shared successfully');
      }).catch((error) => {
        console.error('Error sharing:', error);
        handleCopy();
      });
    } else {
      handleCopy();
    }
  };

  const getEmbedCode = () => {
    const staticParam = isStaticQR ? ' data-static="true"' : '';
    return `<!-- RizzPay Payment Link Button -->
<script src="https://cdn.rizzpay.com/payment-link.js" 
  data-merchant="${merchantId}"${!isStaticQR ? `\n  data-amount="${formData.amount || ''}"` : ''}${staticParam} 
  data-description="${formData.description || ''}">
</script>
<button class="rizzpay-payment-button">Pay with RizzPay</button>`;
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(getEmbedCode());
    toast.success('Embed code copied to clipboard');
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
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
          <div className="flex items-center space-x-2">
            <Switch 
              id="isStatic" 
              checked={isStaticQR} 
              onCheckedChange={setIsStaticQR}
            />
            <Label htmlFor="isStatic">Generate Static QR (Any amount payment)</Label>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {!isStaticQR && (
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
            )}
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                name="customerName"
                placeholder="Enter customer name"
                value={formData.customerName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                placeholder="customer@email.com"
                value={formData.customerEmail}
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

          <Button onClick={generateLink} className="w-full bg-[#0052FF]">
            <QrCode className="mr-2 h-4 w-4" />
            Generate Payment Link
          </Button>

          {paymentLink && (
            <div className="space-y-4 mt-4">
              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Payment Collection Link</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  Share this link with your customers to collect payment
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    value={paymentLink}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                  >
                    {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={sharePaymentLink}
                  >
                    <Share2 className="h-4 w-4" />
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

      {qrCodeUrl && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isStaticQR ? "Static Payment QR Code" : "Payment QR Code"}
            </CardTitle>
            <CardDescription>
              Scan with any UPI app to make payment
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-md border">
              <img
                src={qrCodeUrl}
                alt="UPI QR Code"
                className="h-48 w-48 object-contain"
              />
            </div>
            {!isStaticQR && (
              <div className="text-center">
                <p className="font-medium text-lg">₹{formData.amount}</p>
                <p className="text-sm text-muted-foreground">{formData.customerName}</p>
                <p className="text-xs text-muted-foreground">{formData.description}</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center">
              {isStaticQR ? "Scan to pay any amount" : "Scan to pay via UPI"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UpiPaymentLinkGenerator;
