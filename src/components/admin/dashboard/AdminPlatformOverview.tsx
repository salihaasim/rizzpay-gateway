
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Wallet, ArrowRight, Link as LinkIcon, QrCode, Plus, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import AdminMerchantsList from '@/components/admin/AdminMerchantsList';
import EscrowAccount from '@/components/admin/EscrowAccount';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

const AdminPlatformOverview = () => {
  const [activeTab, setActiveTab] = useState('merchants');
  const navigate = useNavigate();
  const [showLinkGenerator, setShowLinkGenerator] = useState(false);
  const [newLink, setNewLink] = useState<{ id: string; url: string } | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [upiDialogOpen, setUpiDialogOpen] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: '',
    customerName: '',
    customerEmail: '',
    description: '',
    upiId: 'merchant@rizzpay'
  });
  
  // Sample payment links data for demonstration
  const [paymentLinks, setPaymentLinks] = useState([
    {
      id: 'pl_123456',
      amount: '₹1,500.00',
      created: 'Today at 14:32',
      status: 'active',
      customer: 'John Doe'
    },
    {
      id: 'pl_123457',
      amount: '₹750.00',
      created: 'Today at 10:15',
      status: 'active',
      customer: 'Sarah Brown'
    },
    {
      id: 'pl_123458',
      amount: '₹3,200.00',
      created: 'Yesterday at 16:45',
      status: 'expired',
      customer: 'Tech Solutions Ltd'
    },
    {
      id: 'pl_123459',
      amount: '₹980.00',
      created: '2 days ago',
      status: 'paid',
      customer: 'Alex Wilson'
    },
  ]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPaymentFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const generatePaymentLink = () => {
    // Validate form data
    if (!paymentFormData.amount || isNaN(parseFloat(paymentFormData.amount)) || parseFloat(paymentFormData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!paymentFormData.customerName) {
      toast.error('Please enter customer name');
      return;
    }
    
    // Generate a unique link ID
    const linkId = `pl_${Math.random().toString(36).substring(2, 8)}`;
    
    // Create UPI payment URL
    const baseUrl = window.location.origin;
    const paymentUrl = `${baseUrl}/payment/upi?amount=${paymentFormData.amount}&name=${encodeURIComponent(paymentFormData.customerName)}&email=${encodeURIComponent(paymentFormData.customerEmail || '')}&desc=${encodeURIComponent(paymentFormData.description || '')}&upi=${encodeURIComponent(paymentFormData.upiId)}&id=${linkId}`;
    
    // Set the newly generated link
    setNewLink({
      id: linkId,
      url: paymentUrl,
    });
    
    // Add to payment links
    const newPaymentLink = {
      id: linkId,
      amount: `₹${parseFloat(paymentFormData.amount).toFixed(2)}`,
      created: 'Just now',
      status: 'active',
      customer: paymentFormData.customerName
    };
    
    setPaymentLinks(prev => [newPaymentLink, ...prev]);
    
    // Show success toast
    toast.success('Payment link generated successfully!');
    
    // Close dialog
    setUpiDialogOpen(false);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setLinkCopied(true);
    toast.success('Link copied to clipboard!');
    
    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };
  
  const toggleLinkGenerator = () => {
    setShowLinkGenerator(prev => !prev);
  };
  
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>Platform Overview</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs flex items-center gap-1"
            onClick={() => navigate('/admin/whitelist')}
          >
            Merchant Whitelist <ArrowRight className="h-3 w-3" />
          </Button>
        </CardTitle>
        <CardDescription>
          Manage your platform's merchants and finances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="merchants" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="merchants" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Merchants
            </TabsTrigger>
            <TabsTrigger value="wallets" className="flex items-center">
              <Wallet className="h-4 w-4 mr-2" />
              Wallets
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center">
              <LinkIcon className="h-4 w-4 mr-2" />
              Payment Links
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="merchants" className="space-y-4">
            <AdminMerchantsList />
          </TabsContent>
          
          <TabsContent value="wallets" className="space-y-4">
            <EscrowAccount />
          </TabsContent>
          
          <TabsContent value="links" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Recent Payment Links</h3>
                
                <Dialog open={upiDialogOpen} onOpenChange={setUpiDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Generate New UPI Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Generate UPI Payment Link</DialogTitle>
                      <DialogDescription>
                        Create a shareable UPI payment link for your customer.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Amount (₹)
                        </Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          value={paymentFormData.amount}
                          onChange={handleInputChange}
                          placeholder="1000"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customerName" className="text-right">
                          Customer Name
                        </Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          value={paymentFormData.customerName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customerEmail" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="customerEmail"
                          name="customerEmail"
                          type="email"
                          value={paymentFormData.customerEmail}
                          onChange={handleInputChange}
                          placeholder="customer@example.com"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="upiId" className="text-right">
                          UPI ID
                        </Label>
                        <Input
                          id="upiId"
                          name="upiId"
                          value={paymentFormData.upiId}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={paymentFormData.description}
                          onChange={handleInputChange}
                          placeholder="Payment for services"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={generatePaymentLink}>Generate Link</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              {newLink && (
                <div className="bg-primary/5 border rounded-md p-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Payment Link Generated</h4>
                      <p className="text-xs text-muted-foreground mb-2">Share this link with your customer to collect payment</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      New
                    </Badge>
                  </div>
                  
                  <div className="flex mt-2">
                    <Input
                      value={newLink.url}
                      readOnly
                      className="text-xs font-mono"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2"
                      onClick={() => copyToClipboard(newLink.url)}
                    >
                      {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex justify-between mt-4 text-xs">
                    <div className="flex items-center">
                      <QrCode className="h-4 w-4 mr-1" />
                      <span>Link ID: {newLink.id}</span>
                    </div>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-xs p-0 h-auto"
                      onClick={() => window.open(newLink.url, '_blank')}
                    >
                      Preview Link <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Link ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentLinks.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell className="font-mono text-xs">{link.id}</TableCell>
                        <TableCell>{link.customer}</TableCell>
                        <TableCell>{link.amount}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{link.created}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              link.status === 'active'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : link.status === 'paid'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                            }
                          >
                            {link.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">View link details</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs" 
                  onClick={toggleLinkGenerator}
                >
                  {showLinkGenerator ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" /> Hide Link Generator
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" /> Show Link Generator Code
                    </>
                  )}
                </Button>
                
                {showLinkGenerator && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h4 className="text-sm font-medium mb-2">Integration Code</h4>
                    <p className="text-xs text-muted-foreground mb-4">
                      Use this code to integrate RizzPay payment links in your website
                    </p>
                    
                    <div className="bg-black text-white p-3 rounded-md text-xs font-mono overflow-x-auto">
                      <pre className="whitespace-pre-wrap">{`<button onclick="window.open('${window.location.origin}/payment/link/create', 'rizzpay', 'width=500,height=600')">
  Pay with RizzPay
</button>`}</pre>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-4">
                      This will open a RizzPay payment window where you can generate and share payment links.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-2">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => navigate('/admin/payment-links')}
                >
                  View all payment links
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminPlatformOverview;
