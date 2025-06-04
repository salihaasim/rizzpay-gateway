import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  IndianRupee, 
  QrCode, 
  ArrowRight, 
  Check, 
  Link2, 
  Copy, 
  Send,
  Plus,
  History,
  Settings,
  CreditCard,
  Save,
  Smartphone,
  Globe,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useTransactionStore } from '@/stores/transactions';
import { Helmet } from 'react-helmet';
import { goBack } from '@/utils/navigationUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';

// Sidebar component for UPI Link management
const UpiLinkSidebar = ({ activeItem, onItemClick }: { 
  activeItem: string, 
  onItemClick: (item: string) => void 
}) => {
  const items = [
    { id: 'generate', label: 'Generate Link', icon: <Plus className="h-4 w-4 mr-2" /> },
    { id: 'collect', label: 'Collect Payment', icon: <CreditCard className="h-4 w-4 mr-2" /> },
    { id: 'history', label: 'Payment History', icon: <History className="h-4 w-4 mr-2" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4 mr-2" /> }
  ];
  
  return (
    <div className="w-full lg:w-64 bg-card border-r border-border/50">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium flex items-center">
          <Link2 className="h-5 w-5 mr-2" />
          UPI Payment
        </h3>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {items.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onItemClick(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors ${
                  activeItem === item.id ? 'bg-muted font-medium text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const UpiLinkPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addTransaction } = useTransactionStore();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [activeSection, setActiveSection] = useState('generate');
  
  // Domain configuration state - Default to custom domain
  const [domainSettings, setDomainSettings] = useState({
    useCustomDomain: true, // Default to true to use custom domain
    customDomain: 'https://rizz-pay.in',
    currentDomain: window.location.origin
  });
  
  // Settings state for UPI configuration
  const [settings, setSettings] = useState({
    collectionUpiId: 'merchant@paytm',
    merchantDisplayName: 'RizzPay Merchant',
    webhookUrl: '',
    autoRedirectUrl: '',
    paymentNotifications: true
  });
  
  // Link generation form state
  const [linkForm, setLinkForm] = useState({
    amount: '',
    merchantName: settings.merchantDisplayName,
    description: '',
    upiId: settings.collectionUpiId
  });
  
  const [generatedLink, setGeneratedLink] = useState('');
  const [recentLinks] = useState([
    { id: '1', amount: '₹500', description: 'Product Payment', createdAt: '2024-01-15', clicks: 3, status: 'active' },
    { id: '2', amount: '₹1,200', description: 'Service Fee', createdAt: '2024-01-14', clicks: 7, status: 'paid' },
    { id: '3', amount: '₹750', description: 'Consultation', createdAt: '2024-01-13', clicks: 1, status: 'expired' }
  ]);
  
  // Get payment details from URL parameters (for direct payment)
  const amount = searchParams.get('amount') || '';
  const merchantName = searchParams.get('name') || settings.merchantDisplayName;
  const description = searchParams.get('desc') || 'Payment via RizzPay';
  const upiId = searchParams.get('upi') || settings.collectionUpiId;
  const returnUrl = searchParams.get('return_url') || '';
  
  // Check if this is a direct payment link (has amount in URL)
  const isDirectPayment = Boolean(amount);
  
  const formattedAmount = isDirectPayment 
    ? parseFloat(amount).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    : '';

  // Get the domain to use for links
  const getActiveDomain = () => {
    return domainSettings.useCustomDomain ? domainSettings.customDomain : domainSettings.currentDomain;
  };

  const handlePayment = () => {
    const txnId = `txn_${Math.random().toString(36).substring(2, 10)}`;
    const utrId = `utr_${Math.random().toString(36).substring(2, 10)}`;
    
    setTransactionId(txnId);
    setPaymentSuccess(true);
    
    toast.success('Payment initiated successfully', {
      description: 'Redirecting to UPI app for payment confirmation'
    });
    
    // Generate UPI deep link for mobile payment
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(description)}&tr=${txnId}&cu=INR`;
    
    // Try to open UPI app
    if (window.navigator.userAgent.includes('Mobile')) {
      window.location.href = upiUrl;
    }
    
    addTransaction({
      id: txnId,
      amount: isDirectPayment ? amount : linkForm.amount,
      paymentMethod: 'upi',
      status: 'pending',
      customer: isDirectPayment ? merchantName : linkForm.merchantName,
      date: new Date().toISOString(),
      processingState: 'initiated',
      detailedStatus: 'Verification pending',
      paymentDetails: {
        upiId: isDirectPayment ? upiId : linkForm.upiId,
        upiTransactionId: utrId,
        description: isDirectPayment ? description : linkForm.description
      }
    });
    
    if (returnUrl) {
      const redirectUrl = new URL(returnUrl);
      redirectUrl.searchParams.append('txnId', txnId);
      redirectUrl.searchParams.append('utrId', utrId);
      redirectUrl.searchParams.append('status', 'pending');
      
      setTimeout(() => {
        window.location.href = redirectUrl.toString();
      }, 2000);
    }
  };
  
  const generatePaymentLink = () => {
    if (!linkForm.amount || !linkForm.merchantName) {
      toast.error('Please fill in required fields');
      return;
    }
    
    // Use the selected domain (custom or current)
    const activeDomain = getActiveDomain();
    
    // Generate clean payment link using standard parameters that PaymentPage.tsx expects
    const link = `${activeDomain}/pay?amount=${linkForm.amount}&name=${encodeURIComponent(linkForm.merchantName)}${linkForm.description ? `&desc=${encodeURIComponent(linkForm.description)}` : ''}&upi=${encodeURIComponent(settings.collectionUpiId)}`;
    
    setGeneratedLink(link);
    
    const domainName = new URL(activeDomain).hostname;
    toast.success('RizzPay payment link generated successfully!', {
      description: `Clean payment link ready to share with ${domainName} domain`
    });
  };
  
  const generateAlternativeLink = () => {
    if (!linkForm.amount || !linkForm.merchantName) {
      toast.error('Please fill in required fields');
      return;
    }
    
    // Use the selected domain
    const activeDomain = getActiveDomain();
    const paymentId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const cleanLink = `${activeDomain}/pay/${paymentId}?amount=${linkForm.amount}&name=${encodeURIComponent(linkForm.merchantName)}&desc=${encodeURIComponent(linkForm.description || 'Payment')}&upi=${encodeURIComponent(settings.collectionUpiId)}`;
    
    setGeneratedLink(cleanLink);
    
    const domainName = new URL(activeDomain).hostname;
    toast.success('Alternative payment link generated!', {
      description: `Using ${domainName} domain`
    });
  };
  
  const saveSettings = () => {
    // In production, this would save to database
    toast.success('Settings saved successfully!', {
      description: 'Your UPI collection settings have been updated'
    });
    
    // Update form defaults with new settings
    setLinkForm(prev => ({
      ...prev,
      merchantName: settings.merchantDisplayName,
      upiId: settings.collectionUpiId
    }));
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('RizzPay link copied to clipboard!');
  };
  
  const handleGoBack = () => {
    goBack(navigate);
  };

  // If this is a direct payment link, show the payment interface without layout
  if (isDirectPayment) {
    return (
      <>
        <Helmet>
          <title>RizzPay - Pay ₹{formattedAmount}</title>
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
          <div className="flex justify-center mb-6 w-full relative">
            <Button 
              variant="outline" 
              onClick={handleGoBack} 
              className="absolute top-4 left-4"
            >
              Back
            </Button>
            <div className="bg-primary rounded-full h-12 w-12 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="max-w-md w-full">
            <Card className="border shadow-md">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Payment Request</CardTitle>
                <CardDescription>Pay to {merchantName}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">Amount to Pay</p>
                  <p className="text-3xl font-bold">₹{formattedAmount}</p>
                </div>
                
                {description && (
                  <div className="bg-muted/50 p-3 rounded-md text-sm text-center">
                    {description}
                  </div>
                )}
                
                {paymentSuccess ? (
                  <div className="bg-green-50 border border-green-100 rounded-md p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div className="bg-green-100 rounded-full p-2">
                        <Check className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="font-medium text-green-800">Payment Initiated</h3>
                    <p className="text-sm text-green-700 mt-1">Please complete payment in your UPI app</p>
                    <p className="text-xs text-green-600 mt-3">Transaction ID: {transactionId}</p>
                  </div>
                ) : (
                  <Button className="w-full flex items-center justify-center gap-2" onClick={handlePayment}>
                    <Smartphone className="h-5 w-5" />
                    Pay with UPI
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-center">
                <p className="text-xs text-muted-foreground">Secure payments powered by RizzPay</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Show the full UPI management interface with layout
  return (
    <Layout>
      <Helmet>
        <title>RizzPay - UPI Payment Links</title>
      </Helmet>
      
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <UpiLinkSidebar activeItem={activeSection} onItemClick={setActiveSection} />
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Mobile navigation */}
          <div className="block lg:hidden mb-4">
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="generate">Generate</TabsTrigger>
                <TabsTrigger value="collect">Collect</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Generate Link Section */}
          {activeSection === 'generate' && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Generate RizzPay Payment Link</h1>
                <p className="text-muted-foreground">Create clean UPI payment links using rizz-pay.in domain</p>
              </div>

              {/* Domain Status Indicator */}
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium text-green-800">Active Domain</h4>
                </div>
                <p className="text-sm text-green-700">
                  Links will be generated using: <strong>rizz-pay.in</strong>
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Your custom branded domain is active
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Payment Link</CardTitle>
                    <CardDescription>Generate a payment link using your active domain</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₹) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={linkForm.amount}
                        onChange={(e) => setLinkForm(prev => ({...prev, amount: e.target.value}))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="merchantName">Merchant Name *</Label>
                      <Input
                        id="merchantName"
                        placeholder="Your business name"
                        value={linkForm.merchantName}
                        onChange={(e) => setLinkForm(prev => ({...prev, merchantName: e.target.value}))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Payment description"
                        value={linkForm.description}
                        onChange={(e) => setLinkForm(prev => ({...prev, description: e.target.value}))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="merchant@paytm"
                        value={linkForm.upiId}
                        onChange={(e) => setLinkForm(prev => ({...prev, upiId: e.target.value}))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={generatePaymentLink} className="w-full">
                        <Link2 className="mr-2 h-4 w-4" />
                        Generate Link
                      </Button>
                      <Button onClick={generateAlternativeLink} variant="outline" className="w-full">
                        Alternative Format
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {generatedLink && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Generated Payment Link</CardTitle>
                      <CardDescription>Your payment link using rizz-pay.in domain</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-2">Payment Link:</p>
                        <div className="p-3 bg-white rounded-md border text-sm font-mono break-all">
                          {generatedLink}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => copyToClipboard(generatedLink)}
                          className="flex-1 bg-primary"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </Button>
                        <Button 
                          onClick={() => {
                            const subject = `Payment Request - ₹${linkForm.amount}`;
                            const body = `Complete your payment using this link: ${generatedLink}`;
                            window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                          }}
                          variant="outline"
                          className="flex-1"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Email
                        </Button>
                      </div>
                      
                      <div className="text-center pt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.open(generatedLink, '_blank')}
                          className="text-primary hover:text-primary/80"
                        >
                          Test Payment Link →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
          
          {/* Collect Payment Section */}
          {activeSection === 'collect' && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Collect Payment</h1>
                <p className="text-muted-foreground">Quick payment collection interface</p>
              </div>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Quick Collection</h3>
                  <p className="text-muted-foreground mb-4">Feature coming soon - QR code generation and instant collection</p>
                  <Button disabled>Coming Soon</Button>
                </CardContent>
              </Card>
            </>
          )}
          
          {/* History Section */}
          {activeSection === 'history' && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Payment History</h1>
                <p className="text-muted-foreground">Track your payment links and collections</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Links</CardTitle>
                  <CardDescription>Your generated payment links</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentLinks.map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{link.amount}</p>
                          <p className="text-sm text-muted-foreground">{link.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Created: {link.createdAt} • {link.clicks} clicks
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            link.status === 'paid' ? 'bg-green-100 text-green-800' :
                            link.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {link.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          
          {/* Settings Section with Domain Configuration */}
          {activeSection === 'settings' && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">UPI Collection Settings</h1>
                <p className="text-muted-foreground">Configure your UPI payment collection preferences and domain settings</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Domain Configuration</CardTitle>
                    <CardDescription>Your payment links use the rizz-pay.in domain</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Use Custom Domain</Label>
                        <p className="text-sm text-muted-foreground">
                          Switch to development domain for testing (not recommended)
                        </p>
                      </div>
                      <Switch
                        checked={domainSettings.useCustomDomain}
                        onCheckedChange={(checked) => 
                          setDomainSettings(prev => ({...prev, useCustomDomain: checked}))
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customDomain">Custom Domain (Recommended)</Label>
                      <Input
                        id="customDomain"
                        placeholder="https://rizz-pay.in"
                        value={domainSettings.customDomain}
                        onChange={(e) => setDomainSettings(prev => ({...prev, customDomain: e.target.value}))}
                        disabled={!domainSettings.useCustomDomain}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Development Domain (Testing Only)</Label>
                      <Input
                        value={domainSettings.currentDomain}
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-muted-foreground">This is your development domain - only use for testing</p>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">Custom Domain Active</p>
                          <p className="mt-1">Your payment links will use the professional rizz-pay.in domain.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Collection Settings</CardTitle>
                    <CardDescription>Configure your UPI ID and merchant details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="collectionUpiId">Collection UPI ID *</Label>
                      <Input
                        id="collectionUpiId"
                        placeholder="merchant@paytm"
                        value={settings.collectionUpiId}
                        onChange={(e) => setSettings(prev => ({...prev, collectionUpiId: e.target.value}))}
                      />
                      <p className="text-xs text-muted-foreground">This UPI ID will receive all payments from your links</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="merchantDisplayName">Merchant Display Name *</Label>
                      <Input
                        id="merchantDisplayName"
                        placeholder="Your Business Name"
                        value={settings.merchantDisplayName}
                        onChange={(e) => setSettings(prev => ({...prev, merchantDisplayName: e.target.value}))}
                      />
                      <p className="text-xs text-muted-foreground">This name will appear on payment pages</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                      <Input
                        id="webhookUrl"
                        placeholder="https://your-site.com/webhook"
                        value={settings.webhookUrl}
                        onChange={(e) => setSettings(prev => ({...prev, webhookUrl: e.target.value}))}
                      />
                      <p className="text-xs text-muted-foreground">Get notified when payments are completed</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="autoRedirectUrl">Auto Redirect URL (Optional)</Label>
                      <Input
                        id="autoRedirectUrl"
                        placeholder="https://your-site.com/thank-you"
                        value={settings.autoRedirectUrl}
                        onChange={(e) => setSettings(prev => ({...prev, autoRedirectUrl: e.target.value}))}
                      />
                      <p className="text-xs text-muted-foreground">Redirect customers after successful payment</p>
                    </div>
                    
                    <Button onClick={saveSettings} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Domain Status Preview */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Payment Link Preview</CardTitle>
                  <CardDescription>How your payment links will look with current settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span><strong>Active Domain:</strong> rizz-pay.in</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span><strong>Domain Mode:</strong> Custom Branded Domain</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span><strong>Mobile Optimized:</strong> Opens UPI apps directly</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span><strong>No Registration:</strong> Customers pay without signing up</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Example Payment Link:</h4>
                    <code className="text-xs text-blue-700 break-all">
                      https://rizz-pay.in/pay?amount=500&name={encodeURIComponent(settings.merchantDisplayName)}&desc=Product%20Payment&upi={settings.collectionUpiId}
                    </code>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UpiLinkPaymentPage;
