
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Download, Zap, AlertCircle } from 'lucide-react';
import { getUpiQrCodeUrl } from '@/utils/upiQrUtils';
import { toast } from 'sonner';

const QuickPaymentSection = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [savedUpiId, setSavedUpiId] = useState<string | null>(null);

  // Load saved UPI ID on component mount
  useEffect(() => {
    const upiId = localStorage.getItem('merchantUpiId');
    setSavedUpiId(upiId);
  }, []);

  const generateQuickPaymentQR = () => {
    if (!savedUpiId) {
      toast.error('Please save your UPI ID in Banking settings first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Generate UPI URL with amount
    const upiUri = `upi://pay?pa=${encodeURIComponent(savedUpiId)}&am=${amount}&cu=INR${description ? `&tn=${encodeURIComponent(description)}` : ''}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUri)}`;
    
    setQrUrl(qrCodeUrl);
    toast.success('Quick payment QR code generated successfully');
  };

  const downloadQrCode = () => {
    if (!qrUrl) {
      toast.error('Please generate a QR code first');
      return;
    }
    
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `rizzpay-quick-payment-${amount}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR Code downloaded!');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Quick Payment QR Generator</h2>
          <p className="text-lg text-muted-foreground">
            Generate instant payment QR codes for your customers
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#0052FF]" />
                Quick Payment QR
              </CardTitle>
              <CardDescription>
                Generate QR codes for specific amounts using your saved UPI ID
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!savedUpiId && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Please save your UPI ID in <strong>Banking settings</strong> to generate QR codes
                  </span>
                </div>
              )}

              {savedUpiId && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-sm text-green-800">
                    Using UPI ID: <strong>{savedUpiId}</strong>
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quick-amount">Amount (₹) *</Label>
                  <Input
                    id="quick-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    step="0.01"
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quick-description">Description (Optional)</Label>
                  <Input
                    id="quick-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Payment for..."
                  />
                </div>
              </div>

              <Button 
                onClick={generateQuickPaymentQR} 
                className="w-full bg-[#0052FF]"
                disabled={!savedUpiId || !amount}
              >
                <QrCode className="mr-2 h-4 w-4" />
                Generate Quick Payment QR
              </Button>

              {qrUrl && (
                <Card className="border-dashed mt-6">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="relative">
                      <img 
                        src={qrUrl} 
                        alt="Quick Payment QR Code" 
                        className="h-64 w-64 object-contain"
                      />
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-md shadow-sm">
                        <span className="text-xs font-medium text-primary">RizzPay</span>
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <p className="font-medium">₹{amount}</p>
                      <p className="text-sm text-muted-foreground">{savedUpiId}</p>
                      {description && (
                        <p className="text-sm font-medium mt-1">{description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Scan to pay via UPI</p>
                    </div>
                    
                    <Button onClick={downloadQrCode} variant="outline" size="sm" className="mt-4">
                      <Download className="mr-2 h-4 w-4" />
                      Download QR Code
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default QuickPaymentSection;
