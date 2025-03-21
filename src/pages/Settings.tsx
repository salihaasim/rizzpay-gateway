
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
import { CreditCard, Bell, Lock, User, ShieldCheck, Store, Smartphone, CheckCircle } from 'lucide-react';
import { useProfileStore } from '@/stores/profileStore';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  
  const { firstName, lastName, email, phone, company, updateProfile } = useProfileStore();
  
  const handleSaveProfile = () => {
    updateProfile({
      firstName: (document.getElementById('firstName') as HTMLInputElement).value,
      lastName: (document.getElementById('lastName') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value,
      phone: (document.getElementById('phone') as HTMLInputElement).value,
      company: (document.getElementById('company') as HTMLInputElement).value,
    });
    toast.success('Profile settings saved successfully');
  };
  
  const handleSavePayment = () => {
    toast.success('Payment settings saved successfully');
  };
  
  const handleSaveSecurity = () => {
    toast.success('Security settings saved successfully');
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
                <div className="flex items-center p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Account Details</p>
                    <p className="text-xs text-muted-foreground">Update your profile information</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Payment Methods</p>
                    <p className="text-xs text-muted-foreground">Manage your payment options</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-xs text-muted-foreground">Set your notification preferences</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Security</p>
                    <p className="text-xs text-muted-foreground">Manage passwords and security</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full max-w-md grid grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
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
                        <Input id="firstName" defaultValue="Saalih" />
                      </div>
                      <div className="w-full md:w-1/2 space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Aasim" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="salihaasimdevloper@gmail.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="7550248887" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" defaultValue="Aasim Enterprise" />
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end border-t pt-6">
                    <Button onClick={handleSaveProfile} className="rounded-full px-8">Save Changes</Button>
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
                        <Switch checked={true} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input id="upiId" defaultValue="salihaasimdevloper-4@okaxis" />
                      </div>
                      
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                        <span className="text-sm">Google Pay integration is active</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Merchant Details</h3>
                      
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="merchantId">Merchant ID</Label>
                          <Input id="merchantId" defaultValue="MERCH001" />
                        </div>
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="merchantName">Store Name</Label>
                          <Input id="merchantName" defaultValue="Aasim Kadai" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="merchantAddress">Store Address</Label>
                        <Input id="merchantAddress" defaultValue="123 Main St, Bangalore, Karnataka" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="merchantCategory">Business Category</Label>
                        <Input id="merchantCategory" defaultValue="Electronics & Appliances" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end border-t pt-6">
                    <Button onClick={handleSavePayment} className="rounded-full px-8">Save Changes</Button>
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
                    <div className="space-y-4">
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
                        <Input id="currentPassword" type="password" />
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div className="w-full md:w-1/2 space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
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
                    <Button onClick={handleSaveSecurity} className="rounded-full px-8">Save Changes</Button>
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
