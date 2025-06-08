
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Link, Share2, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const LinkPaymentPage = () => {
  const [linkForm, setLinkForm] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'INR',
    expiresAt: ''
  });

  const [generatedLinks] = useState([
    {
      id: 1,
      title: 'Product Purchase',
      amount: '₹1,500',
      url: 'https://rizzpay.com/pay/abc123',
      status: 'active',
      clicks: 5,
      payments: 2,
      created: '2024-01-15'
    },
    {
      id: 2,
      title: 'Service Payment',
      amount: '₹2,500',
      url: 'https://rizzpay.com/pay/def456',
      status: 'expired',
      clicks: 12,
      payments: 8,
      created: '2024-01-10'
    },
    {
      id: 3,
      title: 'Subscription Fee',
      amount: '₹499',
      url: 'https://rizzpay.com/pay/ghi789',
      status: 'active',
      clicks: 25,
      payments: 15,
      created: '2024-01-12'
    }
  ]);

  const generatePaymentLink = () => {
    if (!linkForm.title || !linkForm.amount) {
      toast.error('Please fill required fields');
      return;
    }

    const newLink = `https://rizzpay.com/pay/${Math.random().toString(36).substr(2, 9)}`;
    toast.success('Payment link generated successfully');
    
    // Reset form
    setLinkForm({
      title: '',
      description: '',
      amount: '',
      currency: 'INR',
      expiresAt: ''
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">UPI Payment Links</h1>
          <p className="text-sm text-muted-foreground">Create and manage payment links for easy collection</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create Payment Link</CardTitle>
              <CardDescription>Generate a shareable payment link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Payment for..."
                  value={linkForm.title}
                  onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about the payment"
                  rows={3}
                  value={linkForm.description}
                  onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={linkForm.amount}
                    onChange={(e) => setLinkForm({ ...linkForm, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    className="w-full p-2 border border-input rounded-md"
                    value={linkForm.currency}
                    onChange={(e) => setLinkForm({ ...linkForm, currency: e.target.value })}
                  >
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={linkForm.expiresAt}
                  onChange={(e) => setLinkForm({ ...linkForm, expiresAt: e.target.value })}
                />
              </div>

              <Button onClick={generatePaymentLink} className="w-full bg-[#0052FF]">
                <Link className="h-4 w-4 mr-2" />
                Generate Payment Link
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Pre-configured payment links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setLinkForm({ ...linkForm, title: 'Product Purchase', amount: '1000' })}
              >
                Product Purchase - ₹1,000
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setLinkForm({ ...linkForm, title: 'Service Payment', amount: '2500' })}
              >
                Service Payment - ₹2,500
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setLinkForm({ ...linkForm, title: 'Monthly Subscription', amount: '499' })}
              >
                Monthly Subscription - ₹499
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setLinkForm({ ...linkForm, title: 'Donation', amount: '100' })}
              >
                Donation - ₹100
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Payment Links</CardTitle>
            <CardDescription>Manage your created payment links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedLinks.map((link) => (
                <div key={link.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{link.title}</h4>
                      <p className="text-sm text-muted-foreground">Amount: {link.amount}</p>
                    </div>
                    <Badge className={getStatusColor(link.status)}>
                      {link.status}
                    </Badge>
                  </div>
                  
                  <div className="bg-muted p-2 rounded flex items-center justify-between text-sm">
                    <code className="flex-1 truncate">{link.url}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(link.url)}
                      className="h-6 w-6 ml-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{link.clicks} clicks</span>
                      <span>{link.payments} payments</span>
                      <span>Created {link.created}</span>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LinkPaymentPage;
