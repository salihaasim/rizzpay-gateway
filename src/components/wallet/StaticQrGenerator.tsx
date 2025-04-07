
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { QrCode, Download, Copy, Check } from 'lucide-react';
import { getUpiQrCodeUrl } from '@/utils/upiQrUtils';
import { toast } from 'sonner';

interface StaticQrGeneratorProps {
  userEmail?: string | null;
}

const StaticQrGenerator: React.FC<StaticQrGeneratorProps> = ({ userEmail }) => {
  const [upiId, setUpiId] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  
  const generateQrCode = () => {
    if (!upiId || !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID');
      return;
    }
    
    const qrCodeUrl = getUpiQrCodeUrl(upiId);
    setQrUrl(qrCodeUrl);
    toast.success('QR Code generated successfully');
  };
  
  const downloadQrCode = () => {
    if (!qrUrl) return;
    
    // Create a temporary anchor element to download the image
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `rizzpay-upi-qr-${upiId.replace('@', '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR Code downloaded!');
  };
  
  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success('UPI ID copied to clipboard!');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="upiId">Your UPI ID</Label>
        <div className="flex space-x-2">
          <Input
            id="upiId"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="username@upi"
            className="flex-1"
          />
          <Button 
            onClick={copyUpiId} 
            variant="outline" 
            size="icon"
            disabled={!upiId}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <Button 
        onClick={generateQrCode} 
        className="w-full"
        disabled={!upiId || !upiId.includes('@')}
      >
        <QrCode className="mr-2 h-4 w-4" />
        Generate Static QR Code
      </Button>
      
      {qrUrl && (
        <Card className="border-dashed mt-4">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="relative">
              <img 
                src={qrUrl} 
                alt="UPI QR Code" 
                className="h-64 w-64 object-contain"
              />
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-md shadow-sm">
                <span className="text-xs font-medium text-primary">RizzPay</span>
              </div>
            </div>
            <div className="text-center mt-2">
              <p className="font-medium">{upiId}</p>
              <p className="text-xs text-muted-foreground">Scan to pay via UPI</p>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-center">
            <Button onClick={downloadQrCode} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default StaticQrGenerator;
