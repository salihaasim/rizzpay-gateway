import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { QrCode, Download, Copy, Check, FileDown, Link, FileText, Loader2 } from 'lucide-react';
import { getUpiQrCodeUrl } from '@/utils/upiQrUtils';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import html2pdf from 'html2pdf.js';

interface StaticQrGeneratorProps {
  userEmail?: string | null;
}

const StaticQrGenerator: React.FC<StaticQrGeneratorProps> = ({ userEmail }) => {
  const [upiId, setUpiId] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [websiteDescription, setWebsiteDescription] = useState<string>('');
  const [includeDescription, setIncludeDescription] = useState<boolean>(true);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  
  const generateQrCode = () => {
    if (!upiId || !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const qrCodeUrl = getUpiQrCodeUrl(upiId);
      setQrUrl(qrCodeUrl);
      toast.success('QR Code generated successfully');
      setIsLoading(false);
    }, 800);
  };
  
  const downloadQrCode = () => {
    if (!qrUrl) {
      toast.error('Please generate a QR code first');
      return;
    }
    
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `rizzpay-upi-qr-${upiId.replace('@', '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR Code downloaded!');
  };
  
  const exportToPdf = () => {
    if (!qrCodeRef.current || !qrUrl) {
      toast.error('QR code not available');
      return;
    }
    
    toast.info('Generating PDF...');
    
    const pdfContainer = document.createElement('div');
    pdfContainer.style.padding = '20px';
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '15px';
    header.innerHTML = '<h2 style="color: #333;">RizzPay UPI Payment</h2>';
    pdfContainer.appendChild(header);
    
    const qrImage = new Image();
    qrImage.src = qrUrl;
    qrImage.style.display = 'block';
    qrImage.style.margin = '0 auto';
    qrImage.style.width = '200px';
    qrImage.style.height = '200px';
    
    qrImage.onload = () => {
      pdfContainer.appendChild(qrImage);
      
      const details = document.createElement('div');
      details.style.textAlign = 'center';
      details.style.marginTop = '15px';
      
      details.innerHTML = `
        <p style="font-weight: bold; font-size: 16px;">UPI ID: ${upiId}</p>
        <p style="color: #555; margin-top: 10px;">Scan with any UPI app to pay</p>
        ${websiteDescription && includeDescription ? 
          `<p style="font-style: italic; margin-top: 10px;">${websiteDescription}</p>` : ''}
        <p style="color: #888; font-size: 12px; margin-top: 20px;">Powered by RizzPay Payment Gateway</p>
      `;
      
      pdfContainer.appendChild(details);
      
      const opt = {
        margin: 0.5,
        filename: `rizzpay-upi-qr-${upiId.replace('@', '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().from(pdfContainer).set(opt).save().then(() => {
        toast.success('PDF downloaded successfully!');
      }).catch((err) => {
        console.error('PDF generation error:', err);
        toast.error('Failed to generate PDF');
      });
    };
    
    qrImage.onerror = () => {
      toast.error('Failed to load QR code image for PDF');
    };
  };
  
  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success('UPI ID copied to clipboard!');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const getWebsiteEmbedCode = () => {
    if (!upiId) return '';
    
    return `<div class="rizzpay-upi-payment">
  <img src="${qrUrl}" alt="Pay with UPI" style="max-width: 200px; display: block; margin: 0 auto;">
  <p style="text-align: center; margin-top: 10px; font-family: sans-serif; font-size: 14px;">
    <strong>UPI ID:</strong> ${upiId}
  </p>
  <p style="text-align: center; margin-top: 5px; font-family: sans-serif; font-size: 12px; color: #666;">
    Powered by RizzPay
  </p>
</div>`;
  };
  
  const copyEmbedCode = () => {
    const code = getWebsiteEmbedCode();
    navigator.clipboard.writeText(code);
    toast.success('Embed code copied to clipboard!');
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
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="website">Website Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <Button 
            onClick={generateQrCode} 
            className="w-full"
            disabled={!upiId || !upiId.includes('@') || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-4 w-4" />
                Generate Static QR Code
              </>
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="website" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Your Website URL (Optional)</Label>
            <Input
              id="websiteUrl"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="description">Payment Description (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="include-desc" className="text-sm">Include in QR</Label>
                <Switch
                  id="include-desc"
                  checked={includeDescription}
                  onCheckedChange={setIncludeDescription}
                />
              </div>
            </div>
            <Textarea
              id="description"
              value={websiteDescription}
              onChange={(e) => setWebsiteDescription(e.target.value)}
              placeholder="Payment for products/services"
              rows={2}
            />
          </div>
          
          <Button 
            onClick={generateQrCode} 
            className="w-full"
            disabled={!upiId || !upiId.includes('@') || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-4 w-4" />
                Generate Static QR Code
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>
      
      {qrUrl && (
        <Card className="border-dashed mt-4">
          <CardContent className="p-4 flex flex-col items-center" ref={qrCodeRef}>
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
              {websiteDescription && includeDescription && (
                <p className="text-sm mt-2 font-medium">{websiteDescription}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 justify-center">
            <Button onClick={downloadQrCode} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download QR
            </Button>
            <Button onClick={exportToPdf} variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Export as PDF
            </Button>
            {getWebsiteEmbedCode() && (
              <Button onClick={copyEmbedCode} variant="outline" size="sm">
                <Link className="mr-2 h-4 w-4" />
                Copy Embed Code
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
      
      {qrUrl && websiteUrl && (
        <div className="mt-4 space-y-2">
          <Label>Embed Code for Your Website</Label>
          <div className="bg-muted p-3 rounded-md">
            <code className="text-xs whitespace-pre-wrap break-all">{getWebsiteEmbedCode()}</code>
          </div>
          <Button onClick={copyEmbedCode} variant="secondary" size="sm" className="w-full">
            <Copy className="mr-2 h-4 w-4" />
            Copy Embed Code
          </Button>
        </div>
      )}
    </div>
  );
};

export default StaticQrGenerator;
