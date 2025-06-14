
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QrCode, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface VpaPaymentLinkProps {
  merchantVpa: string;
  businessName: string;
}

const VpaPaymentLink = ({ merchantVpa, businessName }: VpaPaymentLinkProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const generatePaymentLink = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Generate UPI payment link
    const upiParams = new URLSearchParams({
      pa: merchantVpa,
      pn: businessName,
      am: amount,
      cu: 'INR',
      tn: description || 'Payment'
    });

    const upiLink = `upi://pay?${upiParams.toString()}`;
    setPaymentLink(upiLink);

    // Generate QR code for the UPI link
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`;
    setQrCodeUrl(qrUrl);

    toast.success('Payment link generated successfully!');
  };

  const copyPaymentLink = () => {
    navigator.clipboard.writeText(paymentLink);
    toast.success('Payment link copied to clipboard!');
  };

  const sharePaymentLink = () => {
    if (navigator.share) {
      navigator.share({
        title: `Payment Request - ${businessName}`,
        text: `Pay ₹${amount} to ${businessName}`,
        url: paymentLink
      });
    } else {
      copyPaymentLink();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Generate VPA Payment Link
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              step="0.01"
            />
          </div>
          <div>
            <Label htmlFor="customerName">Customer Name (Optional)</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Payment description (optional)"
            rows={3}
          />
        </div>

        <Button onClick={generatePaymentLink} className="w-full">
          Generate Payment Link
        </Button>

        {paymentLink && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label>Generated Payment Link</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  value={paymentLink}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button variant="outline" size="sm" onClick={copyPaymentLink}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={sharePaymentLink}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {qrCodeUrl && (
              <div className="text-center">
                <Label>Payment QR Code</Label>
                <div className="mt-2">
                  <img 
                    src={qrCodeUrl} 
                    alt="Payment QR Code"
                    className="mx-auto border rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Customer can scan this QR code to pay ₹{amount}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VpaPaymentLink;
