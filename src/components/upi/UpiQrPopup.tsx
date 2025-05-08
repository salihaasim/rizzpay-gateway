
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Check, Copy, QrCode, Download, Share2 } from 'lucide-react';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { toast } from 'sonner';
import { useTransactionStore } from '@/stores/transactionStore';
import { v4 as uuidv4 } from 'uuid';

interface UpiQrPopupProps {
  amount: number;
  merchantName?: string;
  onSuccess?: (transactionId: string) => void;
  onClose?: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const UpiQrPopup: React.FC<UpiQrPopupProps> = ({
  amount,
  merchantName,
  onSuccess,
  onClose,
  isOpen,
  setIsOpen
}) => {
  const { currentMerchant } = useMerchantAuth();
  const { addTransaction } = useTransactionStore();
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Using the UPI settings from the merchant store
  const upiId = currentMerchant?.upiSettings?.upiId || 'default@rizzpay';
  
  // Generate UPI URL for payment
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName || 'RizzPay')}&am=${amount}&cu=INR`;
  
  // Generate QR code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;
  
  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success('UPI ID copied to clipboard');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  const handleDownloadQr = () => {
    setIsDownloading(true);
    
    // Create a temporary link element
    const downloadLink = document.createElement('a');
    downloadLink.href = qrCodeUrl;
    downloadLink.download = `rizzpay-upi-payment-${amount}.png`;
    
    // Append to the body, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast.success('QR code downloaded');
    setIsDownloading(false);
  };
  
  const handleShare = async () => {
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RizzPay UPI Payment',
          text: `Pay ₹${amount.toFixed(2)} to ${merchantName || 'RizzPay'} via UPI: ${upiId}`,
          url: window.location.href
        });
        toast.success('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying UPI ID
      handleCopyUpiId();
    }
  };
  
  const handleSubmitTransaction = () => {
    if (!transactionId.trim()) {
      toast.error('Please enter your UPI transaction ID');
      return;
    }
    
    // Generate a unique transaction reference
    const reference = `UPI-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    // Add to transaction store
    addTransaction({
      id: reference,
      amount: `₹ ${amount.toFixed(2)}`,
      rawAmount: amount,
      paymentMethod: 'upi_manual',
      status: 'pending',
      customer: 'Manual UPI Payment',
      date: new Date().toISOString(),
      processingState: 'initiated',
      detailedStatus: 'Awaiting manual verification',
      paymentDetails: {
        upiId: upiId,
        razorpay_order_id: transactionId
      }
    });
    
    toast.success('Transaction submitted for verification');
    
    if (onSuccess) {
      onSuccess(reference);
    }
    
    setIsOpen(false);
  };
  
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  // Generating code snippets for integration in different languages
  const codeSnippets = {
    javascript: `
// JavaScript/TypeScript integration
const upiPayment = {
  upiId: "${upiId}",
  amount: ${amount},
  name: "${merchantName || 'RizzPay'}",
  currency: "INR"
};

// Generate QR code
const qrCodeUrl = \`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=\${encodeURIComponent(
  \`upi://pay?pa=\${upiPayment.upiId}&pn=\${upiPayment.name}&am=\${upiPayment.amount}&cu=\${upiPayment.currency}\`
)}\`;

// Display the QR code
document.getElementById('upi-qr').src = qrCodeUrl;
`,
    php: `
<?php
// PHP integration
$upiPayment = [
  'upiId' => '${upiId}',
  'amount' => ${amount},
  'name' => '${merchantName || 'RizzPay'}',
  'currency' => 'INR'
];

// Generate UPI URI
$upiUri = 'upi://pay?pa=' . urlencode($upiPayment['upiId']) . 
          '&pn=' . urlencode($upiPayment['name']) . 
          '&am=' . $upiPayment['amount'] . 
          '&cu=' . $upiPayment['currency'];

// Generate QR code URL
$qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . urlencode($upiUri);

// Display the QR code
echo '<img src="' . $qrCodeUrl . '" alt="UPI QR Code" />';
?>
`,
    python: `
# Python integration
upi_payment = {
    "upiId": "${upiId}",
    "amount": ${amount},
    "name": "${merchantName || 'RizzPay'}",
    "currency": "INR"
}

# Generate UPI URI
import urllib.parse
upi_uri = f"upi://pay?pa={urllib.parse.quote(upi_payment['upiId'])}&pn={urllib.parse.quote(upi_payment['name'])}&am={upi_payment['amount']}&cu={upi_payment['currency']}"

# Generate QR code URL
qr_code_url = f"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={urllib.parse.quote(upi_uri)}"

# Use in your web framework (e.g., Django, Flask)
# return render_template('payment.html', qr_code_url=qr_code_url)
`
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pay ₹{amount.toFixed(2)} via UPI</DialogTitle>
          <DialogDescription>
            Scan the QR code or use the UPI ID below to make your payment
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center p-4">
          <div className="border rounded-md p-2 bg-white relative group">
            <img src={qrCodeUrl} alt="UPI QR Code" width="300" height="300" className="mx-auto" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8" 
                  onClick={handleDownloadQr}
                  disabled={isDownloading}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="h-8" 
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 w-full">
            <Label>UPI ID</Label>
            <div className="flex items-center mt-2">
              <div className="flex-1 bg-muted p-2 rounded-md text-center font-mono">
                {upiId}
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="ml-2" 
                onClick={handleCopyUpiId}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="space-y-3">
          <Label htmlFor="transactionId">UPI Transaction ID</Label>
          <Input
            id="transactionId"
            placeholder="Enter your UPI Transaction ID after payment"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Please enter the transaction ID you received after completing the UPI payment
          </p>
        </div>
        
        <Tabs defaultValue="javascript" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="php">PHP</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>
          <TabsContent value="javascript" className="mt-2">
            <div className="bg-muted rounded-md p-2 text-xs overflow-x-auto">
              <pre>{codeSnippets.javascript}</pre>
            </div>
          </TabsContent>
          <TabsContent value="php" className="mt-2">
            <div className="bg-muted rounded-md p-2 text-xs overflow-x-auto">
              <pre>{codeSnippets.php}</pre>
            </div>
          </TabsContent>
          <TabsContent value="python" className="mt-2">
            <div className="bg-muted rounded-md p-2 text-xs overflow-x-auto">
              <pre>{codeSnippets.python}</pre>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmitTransaction} className="bg-[#0052FF]">
            Submit & Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpiQrPopup;
