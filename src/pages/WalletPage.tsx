
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Wallet, TrendingUp, TrendingDown, Plus, Minus, QrCode, Download, Copy, Check, FileText, Link } from 'lucide-react';
import { toast } from 'sonner';
import { getUpiQrCodeUrl } from '@/utils/upiQrUtils';

const WalletPage = () => {
  const [balance] = useState(15247.50);
  const [transferAmount, setTransferAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  // QR Code generation states
  const [upiId, setUpiId] = useState('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websiteDescription, setWebsiteDescription] = useState('');
  const [includeDescription, setIncludeDescription] = useState(true);

  const transactions = [
    { id: 1, type: 'credit', amount: 5000, description: 'Payment received', date: '2024-01-15' },
    { id: 2, type: 'debit', amount: 150, description: 'Transfer to bank', date: '2024-01-14' },
    { id: 3, type: 'credit', amount: 2500, description: 'Payment received', date: '2024-01-13' },
  ];

  const handleTransfer = () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    toast.success(`₹${transferAmount} transfer initiated`);
    setTransferAmount('');
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (parseFloat(withdrawAmount) > balance) {
      toast.error('Insufficient balance');
      return;
    }
    toast.success(`₹${withdrawAmount} withdrawal initiated`);
    setWithdrawAmount('');
  };

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
    <Layout>
      <div className="container max-w-screen-xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-sm text-muted-foreground">Manage your wallet balance, transactions, and UPI QR codes</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{balance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Total Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹45,250</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-blue-500" />
                Total Withdrawn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹30,002</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Transfer or withdraw funds from your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="transfer">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="transfer">Transfer</TabsTrigger>
                  <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                </TabsList>
                
                <TabsContent value="transfer" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="transfer-amount">Transfer Amount</Label>
                    <Input
                      id="transfer-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleTransfer} className="w-full bg-[#0052FF]">
                    <Plus className="h-4 w-4 mr-2" />
                    Transfer to Bank
                  </Button>
                </TabsContent>
                
                <TabsContent value="withdraw" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdraw-amount">Withdraw Amount</Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleWithdraw} className="w-full bg-[#0052FF]">
                    <Minus className="h-4 w-4 mr-2" />
                    Withdraw Funds
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest wallet activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className={`font-medium ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* UPI QR Code Generator Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              UPI QR Code Generator
            </CardTitle>
            <CardDescription>Generate static QR codes for payments and website integration</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="basic">Basic QR</TabsTrigger>
                <TabsTrigger value="website">Website Integration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
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
                  className="w-full bg-[#0052FF]"
                  disabled={!upiId || !upiId.includes('@')}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Code
                </Button>
              </TabsContent>
              
              <TabsContent value="website" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upiId-website">Your UPI ID</Label>
                  <Input
                    id="upiId-website"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@upi"
                  />
                </div>
                
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
                  className="w-full bg-[#0052FF]"
                  disabled={!upiId || !upiId.includes('@')}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Code
                </Button>
              </TabsContent>
            </Tabs>
            
            {qrUrl && (
              <Card className="border-dashed mt-6">
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
                    {websiteDescription && includeDescription && (
                      <p className="text-sm mt-2 font-medium">{websiteDescription}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    <Button onClick={downloadQrCode} variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download QR
                    </Button>
                    {getWebsiteEmbedCode() && (
                      <Button onClick={copyEmbedCode} variant="outline" size="sm">
                        <Link className="mr-2 h-4 w-4" />
                        Copy Embed Code
                      </Button>
                    )}
                  </div>
                </CardContent>
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
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WalletPage;
