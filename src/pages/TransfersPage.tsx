
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Send, Download, Filter, Search, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';

const TransfersPage = () => {
  const [transferForm, setTransferForm] = useState({
    amount: '',
    accountNumber: '',
    ifsc: '',
    beneficiaryName: '',
    purpose: 'business'
  });

  const [searchTerm, setSearchTerm] = useState('');

  const transfers = [
    {
      id: 'TXN001',
      amount: '₹25,000',
      beneficiary: 'John Doe',
      account: '****1234',
      bank: 'HDFC Bank',
      status: 'completed',
      date: '2024-01-15',
      reference: 'REF123456'
    },
    {
      id: 'TXN002',
      amount: '₹15,500',
      beneficiary: 'Jane Smith',
      account: '****5678',
      bank: 'ICICI Bank',
      status: 'processing',
      date: '2024-01-15',
      reference: 'REF123457'
    },
    {
      id: 'TXN003',
      amount: '₹8,750',
      beneficiary: 'ABC Corporation',
      account: '****9012',
      bank: 'SBI',
      status: 'failed',
      date: '2024-01-14',
      reference: 'REF123458'
    }
  ];

  const filteredTransfers = transfers.filter(transfer =>
    transfer.beneficiary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTransfer = () => {
    if (!transferForm.amount || !transferForm.accountNumber || !transferForm.ifsc || !transferForm.beneficiaryName) {
      toast.error('Please fill all required fields');
      return;
    }

    if (parseFloat(transferForm.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    toast.success('Transfer initiated successfully');
    setTransferForm({
      amount: '',
      accountNumber: '',
      ifsc: '',
      beneficiaryName: '',
      purpose: 'business'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Money Transfers</h1>
          <p className="text-sm text-muted-foreground">Send money to bank accounts instantly</p>
        </div>

        <Tabs defaultValue="transfer" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transfer" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              New Transfer
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Transfer History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transfer">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Money</CardTitle>
                  <CardDescription>Transfer funds to any bank account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={transferForm.amount}
                      onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="beneficiaryName">Beneficiary Name *</Label>
                    <Input
                      id="beneficiaryName"
                      placeholder="Full name as per bank account"
                      value={transferForm.beneficiaryName}
                      onChange={(e) => setTransferForm({ ...transferForm, beneficiaryName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Bank account number"
                      value={transferForm.accountNumber}
                      onChange={(e) => setTransferForm({ ...transferForm, accountNumber: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ifsc">IFSC Code *</Label>
                    <Input
                      id="ifsc"
                      placeholder="BANK0123456"
                      value={transferForm.ifsc}
                      onChange={(e) => setTransferForm({ ...transferForm, ifsc: e.target.value.toUpperCase() })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Transfer Purpose</Label>
                    <select
                      className="w-full p-2 border border-input rounded-md"
                      value={transferForm.purpose}
                      onChange={(e) => setTransferForm({ ...transferForm, purpose: e.target.value })}
                    >
                      <option value="business">Business Payment</option>
                      <option value="salary">Salary Payment</option>
                      <option value="vendor">Vendor Payment</option>
                      <option value="refund">Refund</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <Button onClick={handleTransfer} className="w-full bg-[#0052FF]">
                    <Send className="h-4 w-4 mr-2" />
                    Send Money
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transfer Summary</CardTitle>
                  <CardDescription>Review your transfer details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transfer Amount</span>
                      <span className="font-medium">₹{transferForm.amount || '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transfer Fee</span>
                      <span className="font-medium">₹5.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span className="font-medium">₹0.90</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-medium">
                      <span>Total Deduction</span>
                      <span>₹{transferForm.amount ? (parseFloat(transferForm.amount) + 5.90).toFixed(2) : '5.90'}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 text-sm">Transfer Information</h4>
                    <ul className="text-xs text-blue-700 mt-1 space-y-1">
                      <li>• Transfers are processed instantly</li>
                      <li>• Maximum transfer limit: ₹2,00,000 per day</li>
                      <li>• Beneficiary name verification required</li>
                      <li>• 24/7 customer support available</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div>
                    <CardTitle>Transfer History</CardTitle>
                    <CardDescription>Track your money transfers</CardDescription>
                  </div>
                  
                  <div className="flex items-center mt-4 sm:mt-0 w-full sm:w-auto gap-2">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search transfers..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransfers.map((transfer) => (
                    <div key={transfer.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{transfer.beneficiary}</h4>
                          <p className="text-sm text-muted-foreground">
                            {transfer.bank} • {transfer.account}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{transfer.amount}</p>
                          <Badge className={getStatusColor(transfer.status)}>
                            {transfer.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>ID: {transfer.id}</span>
                        <span>Ref: {transfer.reference}</span>
                        <span>{transfer.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TransfersPage;
