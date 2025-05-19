
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const NotificationSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    email: {
      payments: true,
      withdrawals: true,
      security: true,
      marketing: false,
      news: true,
    },
    sms: {
      payments: true,
      withdrawals: true,
      security: true,
      marketing: false,
    },
    push: {
      payments: true,
      withdrawals: false,
      security: true,
    }
  });

  const toggleSetting = (category: 'email' | 'sms' | 'push', setting: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting as keyof typeof prev[typeof category]]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Notification settings updated successfully!");
      navigate('/settings');
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error("Failed to update notification settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Notifications</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-payments" className="flex-1">Payment notifications</Label>
                <Switch 
                  id="email-payments" 
                  checked={settings.email.payments} 
                  onCheckedChange={() => toggleSetting('email', 'payments')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-withdrawals" className="flex-1">Withdrawal notifications</Label>
                <Switch 
                  id="email-withdrawals" 
                  checked={settings.email.withdrawals} 
                  onCheckedChange={() => toggleSetting('email', 'withdrawals')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-security" className="flex-1">Security alerts</Label>
                <Switch 
                  id="email-security" 
                  checked={settings.email.security} 
                  onCheckedChange={() => toggleSetting('email', 'security')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-marketing" className="flex-1">Marketing emails</Label>
                <Switch 
                  id="email-marketing" 
                  checked={settings.email.marketing} 
                  onCheckedChange={() => toggleSetting('email', 'marketing')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-news" className="flex-1">Product updates & news</Label>
                <Switch 
                  id="email-news" 
                  checked={settings.email.news} 
                  onCheckedChange={() => toggleSetting('email', 'news')}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">SMS Notifications</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-payments" className="flex-1">Payment notifications</Label>
                <Switch 
                  id="sms-payments" 
                  checked={settings.sms.payments} 
                  onCheckedChange={() => toggleSetting('sms', 'payments')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-withdrawals" className="flex-1">Withdrawal notifications</Label>
                <Switch 
                  id="sms-withdrawals" 
                  checked={settings.sms.withdrawals} 
                  onCheckedChange={() => toggleSetting('sms', 'withdrawals')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-security" className="flex-1">Security alerts</Label>
                <Switch 
                  id="sms-security" 
                  checked={settings.sms.security} 
                  onCheckedChange={() => toggleSetting('sms', 'security')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-marketing" className="flex-1">Marketing messages</Label>
                <Switch 
                  id="sms-marketing" 
                  checked={settings.sms.marketing} 
                  onCheckedChange={() => toggleSetting('sms', 'marketing')}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Push Notifications</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-payments" className="flex-1">Payment notifications</Label>
                <Switch 
                  id="push-payments" 
                  checked={settings.push.payments} 
                  onCheckedChange={() => toggleSetting('push', 'payments')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="push-withdrawals" className="flex-1">Withdrawal notifications</Label>
                <Switch 
                  id="push-withdrawals" 
                  checked={settings.push.withdrawals} 
                  onCheckedChange={() => toggleSetting('push', 'withdrawals')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="push-security" className="flex-1">Security alerts</Label>
                <Switch 
                  id="push-security" 
                  checked={settings.push.security} 
                  onCheckedChange={() => toggleSetting('push', 'security')}
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/settings')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default NotificationSettings;
