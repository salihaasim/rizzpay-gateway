
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, CreditCard, Landmark, Save, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

const BankingPage = () => {
  const { currentMerchant } = useMerchantAuth();
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountHolderName: ''
  });
  const [upiId, setUpiId] = useState('');
  const [savedUpiId, setSavedUpiId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load saved data on component mount
  useEffect(() => {
    const savedBankDetails = localStorage.getItem('merchantBankDetails');
    const savedUpi = localStorage.getItem('merchantUpiId');
    
    if (savedBankDetails) {
      setBankDetails(JSON.parse(savedBankDetails));
    }
    if (savedUpi) {
      setUpiId(savedUpi);
      setSavedUpiId(savedUpi);
    }
  }, []);

  const handleBankDetailsSave = async () => {
    if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName) {
      toast.error('Please fill in all required bank details');
      return;
    }

    setIsSaving(true);
    
    try {
      // Save to localStorage (in real app, this would be API call)
      localStorage.setItem('merchantBankDetails', JSON.stringify(bankDetails));
      toast.success('Bank details saved successfully');
    } catch (error) {
      toast.error('Failed to save bank details');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpiSave = async () => {
    if (!upiId || !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID');
      return;
    }

    setIsSaving(true);
    
    try {
      // Save to localStorage (in real app, this would be API call)
      localStorage.setItem('merchantUpiId', upiId);
      setSavedUpiId(upiId);
      toast.success('UPI ID saved successfully');
    } catch (error) {
      toast.error('Failed to save UPI ID');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Banking & UPI Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your bank account details and UPI ID for payments</p>
        </div>

        <Tabs defaultValue="bank-details" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="bank-details">Bank Details</TabsTrigger>
            <TabsTrigger value="upi-settings">UPI Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bank-details">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="h-5 w-5" />
                  Bank Account Details
                </CardTitle>
                <CardDescription>
                  Add your bank account details for receiving settlements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                      placeholder="Enter account number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code *</Label>
                    <Input
                      id="ifscCode"
                      value={bankDetails.ifscCode}
                      onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value.toUpperCase()})}
                      placeholder="Enter IFSC code"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                    <Input
                      id="accountHolderName"
                      value={bankDetails.accountHolderName}
                      onChange={(e) => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
                      placeholder="Enter account holder name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                      placeholder="Enter bank name"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="branchName">Branch Name</Label>
                    <Input
                      id="branchName"
                      value={bankDetails.branchName}
                      onChange={(e) => setBankDetails({...bankDetails, branchName: e.target.value})}
                      placeholder="Enter branch name"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleBankDetailsSave} 
                  disabled={isSaving}
                  className="w-full md:w-auto bg-[#0052FF]"
                >
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Bank Details
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upi-settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  UPI Settings
                </CardTitle>
                <CardDescription>
                  Configure your UPI ID for quick payments and QR code generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID *</Label>
                  <Input
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="max-w-md"
                  />
                  <p className="text-sm text-muted-foreground">
                    This UPI ID will be used for generating QR codes in quick payments
                  </p>
                </div>
                
                {savedUpiId && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      Currently saved UPI ID: <strong>{savedUpiId}</strong>
                    </span>
                  </div>
                )}
                
                <Button 
                  onClick={handleUpiSave} 
                  disabled={isSaving || !upiId}
                  className="bg-[#0052FF]"
                >
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save UPI ID
                    </>
                  )}
                </Button>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your saved UPI ID will be used for generating QR codes</li>
                    <li>• Customers can scan the QR code to pay directly to your UPI ID</li>
                    <li>• You can generate QR codes from the Quick Payment section</li>
                    <li>• QR codes can be downloaded and used on your website or store</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BankingPage;
