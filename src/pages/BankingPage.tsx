import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Banknote, Plus, Trash2, Check, CreditCard, IndianRupee } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { validateUpiId } from '@/utils/upiQrUtils';
import { Separator } from "@/components/ui/separator";

const BankingPage = () => {
  const { currentMerchant, updateMerchantDetails } = useMerchantAuth();
  const [activeTab, setActiveTab] = useState('upi');
  
  // UPI Settings
  const [upiId, setUpiId] = useState(currentMerchant?.upiSettings?.upiId || '');
  const [upiName, setUpiName] = useState(currentMerchant?.upiSettings?.name || '');
  
  // Bank Account Settings
  const [bankAccounts, setBankAccounts] = useState(
    currentMerchant?.bankAccounts || []
  );
  const [newBankAccount, setNewBankAccount] = useState({
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    isPrimary: false
  });

  // Handle UPI settings save
  const handleSaveUpiSettings = () => {
    if (!upiId) {
      toast.error("Please enter a valid UPI ID");
      return;
    }
    
    if (!validateUpiId(upiId)) {
      toast.error("Invalid UPI ID format. It should contain '@' symbol.");
      return;
    }
    
    // Update merchant UPI settings
    updateMerchantDetails({
      upiSettings: {
        upiId,
        name: upiName || 'RizzPay Merchant',
        enabled: true,  // Add required property
        allowManualVerification: true  // Add required property
      }
    });
    
    toast.success("UPI settings saved successfully!");
  };

  // Add new bank account
  const handleAddBankAccount = () => {
    const { accountName, accountNumber, ifscCode, bankName } = newBankAccount;
    
    if (!accountName || !accountNumber || !ifscCode || !bankName) {
      toast.error("Please fill all bank account fields");
      return;
    }
    
    if (accountNumber.length < 9 || accountNumber.length > 18) {
      toast.error("Please enter a valid account number");
      return;
    }
    
    if (ifscCode.length !== 11) {
      toast.error("Please enter a valid IFSC code (11 characters)");
      return;
    }
    
    // Check if this is the first account, make it primary if so
    const isPrimary = bankAccounts.length === 0 ? true : newBankAccount.isPrimary;
    
    // If this is set as primary, remove primary from other accounts
    let updatedAccounts = [...bankAccounts];
    if (isPrimary) {
      updatedAccounts = updatedAccounts.map(account => ({
        ...account,
        isPrimary: false
      }));
    }
    
    // Add the new account
    const newAccount = {
      id: `bank_${Date.now()}`,
      accountHolderName: accountName,
      accountNumber,
      ifscCode,
      bankName,
      isVerified: false,
      isPrimary
    };
    
    updatedAccounts.push(newAccount);
    setBankAccounts(updatedAccounts);
    
    // Update merchant bank accounts
    updateMerchantDetails({
      bankAccounts: updatedAccounts
    });
    
    // Reset form
    setNewBankAccount({
      accountName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      isPrimary: false
    });
    
    toast.success("Bank account added successfully!");
  };

  // Remove bank account
  const handleRemoveBankAccount = (id: string) => {
    const updatedAccounts = bankAccounts.filter(account => account.id !== id);
    setBankAccounts(updatedAccounts);
    
    // Update merchant bank accounts
    updateMerchantDetails({
      bankAccounts: updatedAccounts
    });
    
    toast.success("Bank account removed successfully");
  };

  // Set bank account as primary
  const handleSetPrimary = (id: string) => {
    const updatedAccounts = bankAccounts.map(account => ({
      ...account,
      isPrimary: account.id === id
    }));
    
    setBankAccounts(updatedAccounts);
    
    // Update merchant bank accounts
    updateMerchantDetails({
      bankAccounts: updatedAccounts
    });
    
    toast.success("Primary bank account updated");
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Banking Settings</h1>
            <p className="text-muted-foreground mt-2">
              Configure your UPI and bank accounts to receive payments
            </p>
          </div>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="upi" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              UPI Settings
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              Bank Accounts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upi">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-[#0052FF]" />
                  UPI Payment Settings
                </CardTitle>
                <CardDescription>
                  Configure your UPI ID to receive payments directly to your account
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="upiId">Your UPI ID</Label>
                    <Input 
                      id="upiId" 
                      placeholder="yourname@bank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      This UPI ID will be used for receiving payments
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="upiName">Display Name (Optional)</Label>
                    <Input 
                      id="upiName" 
                      placeholder="Your Name / Business Name"
                      value={upiName}
                      onChange={(e) => setUpiName(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Name displayed to customers during UPI payments
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={handleSaveUpiSettings}
                      className="bg-[#0052FF]"
                    >
                      Save UPI Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bank">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-[#0052FF]" />
                  Bank Accounts
                </CardTitle>
                <CardDescription>
                  Add and manage your bank accounts for receiving payments via NEFT/RTGS/IMPS
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* List existing bank accounts */}
                {bankAccounts.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Your Bank Accounts</h3>
                    <div className="space-y-3">
                      {bankAccounts.map((account) => (
                        <div 
                          key={account.id} 
                          className="border rounded-md p-4 flex justify-between items-start"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{account.accountHolderName}</span>
                              {account.isPrimary && (
                                <span className="bg-[#0052FF]/10 text-[#0052FF] text-xs px-2 py-0.5 rounded-full">
                                  Primary
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {account.bankName}
                            </p>
                            <p className="text-sm">
                              A/C: {account.accountNumber.substring(0, 4)}XXXX{account.accountNumber.substring(account.accountNumber.length - 4)}
                            </p>
                            <p className="text-sm">IFSC: {account.ifscCode}</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            {!account.isPrimary && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSetPrimary(account.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Set Primary
                              </Button>
                            )}
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRemoveBankAccount(account.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Separator />
                
                {/* Add new bank account form */}
                <div className="space-y-4">
                  <h3 className="font-medium">Add New Bank Account</h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountName">Account Display Name</Label>
                        <Input 
                          id="accountName" 
                          placeholder="e.g. Business Account"
                          value={newBankAccount.accountName}
                          onChange={(e) => setNewBankAccount({...newBankAccount, accountName: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input 
                          id="bankName" 
                          placeholder="e.g. HDFC Bank"
                          value={newBankAccount.bankName}
                          onChange={(e) => setNewBankAccount({...newBankAccount, bankName: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input 
                          id="accountNumber" 
                          placeholder="Your bank account number"
                          value={newBankAccount.accountNumber}
                          onChange={(e) => setNewBankAccount({...newBankAccount, accountNumber: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ifscCode">IFSC Code</Label>
                        <Input 
                          id="ifscCode" 
                          placeholder="e.g. HDFC0000123"
                          value={newBankAccount.ifscCode}
                          onChange={(e) => setNewBankAccount({...newBankAccount, ifscCode: e.target.value.toUpperCase()})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPrimary"
                        checked={newBankAccount.isPrimary}
                        onChange={(e) => setNewBankAccount({...newBankAccount, isPrimary: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="isPrimary">Set as primary account</Label>
                    </div>
                    
                    <Button 
                      onClick={handleAddBankAccount}
                      className="bg-[#0052FF] w-full sm:w-auto mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bank Account
                    </Button>
                  </div>
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
