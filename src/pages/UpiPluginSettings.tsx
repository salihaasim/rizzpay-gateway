
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UpiPluginCode from '@/components/upi/UpiPluginCode';
import UpiQrPopup from '@/components/upi/UpiQrPopup';
import { QrCode, Wallet } from 'lucide-react';
import { toast } from 'sonner';

const UpiPluginSettings: React.FC = () => {
  const { currentMerchant, updateMerchantUpiSettings } = useMerchantAuth();
  const [isTestPopupOpen, setIsTestPopupOpen] = useState(false);
  const [testAmount, setTestAmount] = useState('100');
  
  const [formState, setFormState] = useState({
    upiId: currentMerchant?.upiSettings?.upiId || '',
    enabled: currentMerchant?.upiSettings?.enabled || false,
    allowManualVerification: currentMerchant?.upiSettings?.allowManualVerification || true,
    customWebhookUrl: currentMerchant?.upiSettings?.customWebhookUrl || ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormState(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSaveSettings = () => {
    if (!currentMerchant) return;
    
    if (!formState.upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID with @ symbol');
      return;
    }
    
    updateMerchantUpiSettings(currentMerchant.username, {
      upiId: formState.upiId,
      enabled: formState.enabled,
      allowManualVerification: formState.allowManualVerification,
      customWebhookUrl: formState.customWebhookUrl || undefined
    });
  };
  
  const handleTestPopup = () => {
    const amount = parseFloat(testAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsTestPopupOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>UPI QR Plugin Settings | RizzPay</title>
      </Helmet>
      
      <Navbar />
      
      <div className="container max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">UPI QR Popup Plugin</h1>
            <p className="text-muted-foreground">Configure and integrate UPI payments on your website</p>
          </div>
          
          <Button onClick={handleTestPopup} className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">Test QR Popup</span>
          </Button>
        </div>
        
        <Tabs defaultValue="settings">
          <TabsList className="mb-6">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>UPI Payment Settings</CardTitle>
                <CardDescription>Configure your UPI payment options for the popup plugin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input 
                    id="upiId" 
                    name="upiId" 
                    placeholder="yourname@ybl" 
                    value={formState.upiId} 
                    onChange={handleInputChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter your UPI ID where customers will send payments
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enabled" 
                    checked={formState.enabled} 
                    onCheckedChange={(checked) => handleSwitchChange('enabled', checked)}
                  />
                  <Label htmlFor="enabled">Enable UPI Plugin</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="allowManualVerification" 
                    checked={formState.allowManualVerification} 
                    onCheckedChange={(checked) => handleSwitchChange('allowManualVerification', checked)}
                  />
                  <Label htmlFor="allowManualVerification">Allow Manual UPI ID Verification</Label>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="customWebhookUrl">Custom Webhook URL (Optional)</Label>
                  <Input 
                    id="customWebhookUrl" 
                    name="customWebhookUrl" 
                    placeholder="https://yoursite.com/webhook" 
                    value={formState.customWebhookUrl} 
                    onChange={handleInputChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Receive payment status updates to your custom endpoint
                  </p>
                </div>
                
                <Button onClick={handleSaveSettings} className="w-full sm:w-auto">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integration">
            <UpiPluginCode />
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Test Your UPI Popup</h3>
              <div className="flex items-end gap-4">
                <div className="w-full sm:w-1/3">
                  <Label htmlFor="testAmount">Test Amount (₹)</Label>
                  <Input 
                    id="testAmount" 
                    type="number" 
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleTestPopup}>Launch Test Popup</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {isTestPopupOpen && (
        <UpiQrPopup 
          amount={parseFloat(testAmount)} 
          merchantName={currentMerchant?.fullName}
          isOpen={isTestPopupOpen}
          setIsOpen={setIsTestPopupOpen}
          onSuccess={(txnId) => toast.success(`Test transaction created: ${txnId}`)}
        />
      )}
    </>
  );
};

export default UpiPluginSettings;
