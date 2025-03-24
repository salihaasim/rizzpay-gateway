
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { CreditCard, Bell, Lock, User, ShieldCheck, Store, Smartphone, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useProfileStore } from '@/stores/profileStore';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  // Profile state
  const { firstName, lastName, email, phone, company, updateProfile } = useProfileStore();
  const [currentFirstName, setCurrentFirstName] = useState(firstName || 'Saalih');
  const [currentLastName, setCurrentLastName] = useState(lastName || 'Aasim');
  const [currentEmail, setCurrentEmail] = useState(email || 'salihaasimdevloper@gmail.com');
  const [currentPhone, setCurrentPhone] = useState(phone || '7550248887');
  const [currentCompany, setCurrentCompany] = useState(company || 'Aasim Enterprise');
  
  // Payment settings state
  const [upiId, setUpiId] = useState('salihaasimdevloper-4@okaxis');
  const [merchantId, setMerchantId] = useState('MERCH001');
  const [merchantName, setMerchantName] = useState('Aasim Kadai');
  const [merchantAddress, setMerchantAddress] = useState('123 Main St, Bangalore, Karnataka');
  const [merchantCategory, setMerchantCategory] = useState('Electronics & Appliances');
  const [googlePayEnabled, setGooglePayEnabled] = useState(true);
  
  // Security settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle profile save
  const handleSaveProfile = () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      updateProfile({
        firstName: currentFirstName,
        lastName: currentLastName,
        email: currentEmail,
        phone: currentPhone,
        company: currentCompany,
      });
      
      toast.success('Profile settings saved successfully');
      setIsProcessing(false);
    }, 1000);
  };
  
  // Handle payment settings save
  const handleSavePayment = () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Payment settings saved successfully');
      setIsProcessing(false);
    }, 1000);
  };
  
  // Handle security settings save
  const handleSaveSecurity = () => {
    // Validate password fields
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword && !currentPassword) {
      toast.error('Current password is required');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      if (newPassword) {
        toast.success('Password updated successfully');
      } else {
        toast.success('Security settings saved successfully');
      }
      
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsProcessing(false);
    }, 1000);
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    toast.success('Account deletion request submitted');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container px-4 pt-20 pb-16 mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Settings</h1>
            <p className="text-muted-foreground">Manage your account and payment preferences</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 border-0 shadow-sm overflow-hidden order-2 lg:order-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <button 
                  className="w-full flex items-center p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                  onClick={() => document.getElementById('profile-tab')?.click()}
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Account Details</p>
                    <p className="text-xs text-muted-foreground">Update your profile information</p>
                  </div>
                </button>
                
                <button 
                  className="w-full flex items-center p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                  onClick={() => document.getElementById('payment-tab')?.click()}
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Payment Methods</p>
                    <p className="text-xs text-muted-foreground">Manage your payment options</p>
                  </div>
                </button>
                
                <button 
                  className="w-full flex items-center p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                  onClick={() => {
                    document.getElementById('security-tab')?.click();
                    // Focus on notifications section
                    setTimeout(() => {
                      document.getElementById('notifications-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-xs text-muted-foreground">Set your notification preferences</p>
                  </div>
                </button>
                
                <button 
                  className="w-full flex items-center p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                  onClick={() => {
                    document.getElementById('security-tab')?.click();
                    // Focus on security section
                    setTimeout(() => {
                      document.getElementById('security-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Security</p>
                    <p className="text-xs text-muted-foreground">Manage passwords and security</p>
                  </div>
                </button>
                
                <Separator className="my-4" />
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full flex items-center p-3 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors text-left">
                      <div className="h-9 w-9 rounded-full bg-rose-500/10 flex items-center justify-center mr-3">
                        <Lock className="h-5 w-5 text-rose-500" />
                      </div>
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-xs text-rose-500/70">Permanently delete your account</p>
                      </div>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-rose-500 hover:bg-rose-600">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full max-w-md grid grid-cols-3">
                <TabsTrigger id="profile-tab" value="profile">Profile</TabsTrigger>
                <TabsTrigger id="payment-tab" value="payment">Payment</TabsTrigger>
                <TabsTrigger id="security-tab" value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6 animate-fade-in">
                <Card className="border-0 shadow-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/2 space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={currentFirstName}
                          onChange={(e) => setCurrentFirstName(e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-1/2 space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={currentLastName}
                          onChange={(e) => setCurrentLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={currentPhone}
                        onChange={(e) => setCurrentPhone(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input 
                        id="company" 
                        value={currentCompany}
                        onChange={(e) => setCurrentCompany(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end border-t pt-6">
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={isProcessing}
                      className="rounded-full px-8"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="payment" className="mt-6 animate-fade-in">
                <Card className="border-0 shadow-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle>Payment Settings</CardTitle>
                    <CardDescription>Configure your payment details and methods</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Google Pay Integration</h3>
                      
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Smartphone className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Google Pay UPI</p>
                            <p className="text-xs text-muted-foreground">Enable Google Pay payments</p>
                          </div>
                        </div>
                        <Switch 
                          checked={googlePayEnabled} 
                          onCheckedChange={setGooglePayEnabled}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input 
                          id="upiId" 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          disabled={!googlePayEnabled}
                        />
                      </div>
                      
                      {googlePayEnabled && (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                          <span className="text-sm">Google Pay integration is active</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Merchant Details</h3>
                      
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="merchantId">Merchant ID</Label>
                          <Input 
                            id="merchantId" 
                            value={merchantId}
                            onChange={(e) => setMerchantId(e.target.value)}
                          />
                        </div>
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="merchantName">Store Name</Label>
                          <Input 
                            id="merchantName" 
                            value={merchantName}
                            onChange={(e) => setMerchantName(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="merchantAddress">Store Address</Label>
                        <Input 
                          id="merchantAddress" 
                          value={merchantAddress}
                          onChange={(e) => setMerchantAddress(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="merchantCategory">Business Category</Label>
                        <Input 
                          id="merchantCategory" 
                          value={merchantCategory}
                          onChange={(e) => setMerchantCategory(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end border-t pt-6">
                    <Button 
                      onClick={handleSavePayment} 
                      className="rounded-full px-8"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-6 animate-fade-in">
                <Card className="border-0 shadow-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Keep your account secure and manage notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div id="security-section" className="space-y-4">
                      <h3 className="text-md font-medium">Account Security</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Two-Factor Authentication</div>
                          <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                        </div>
                        <Switch 
                          checked={twoFactorEnabled} 
                          onCheckedChange={setTwoFactorEnabled} 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input 
                            id="currentPassword" 
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input 
                              id="newPassword" 
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input 
                            id="confirmPassword" 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div id="notifications-section" className="space-y-4">
                      <h3 className="text-md font-medium">Notifications</h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Transaction Notifications</div>
                          <div className="text-sm text-muted-foreground">Receive alerts for all transactions</div>
                        </div>
                        <Switch 
                          checked={notificationsEnabled} 
                          onCheckedChange={setNotificationsEnabled} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="font-medium">Marketing Updates</div>
                          <div className="text-sm text-muted-foreground">Receive promotions and updates</div>
                        </div>
                        <Switch 
                          checked={marketingEnabled} 
                          onCheckedChange={setMarketingEnabled} 
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end border-t pt-6">
                    <Button 
                      onClick={handleSaveSecurity} 
                      className="rounded-full px-8"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
