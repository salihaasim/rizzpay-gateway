
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Key, Lock, Smartphone } from "lucide-react";

const SecuritySettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [settings, setSettings] = useState({
    twoFactorEnabled: true,
    loginNotifications: true,
    restrictedIpAccess: false,
    passwordExpiry: true
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const toggleSetting = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Password changed successfully!");
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Security settings updated successfully!");
      navigate('/settings');
    } catch (error) {
      console.error("Error updating security settings:", error);
      toast.error("Failed to update security settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" /> 
            Change Password
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input 
                  id="currentPassword" 
                  name="currentPassword" 
                  type={showCurrentPassword ? "text" : "password"} 
                  value={passwordForm.currentPassword} 
                  onChange={handlePasswordChange} 
                  required 
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input 
                  id="newPassword" 
                  name="newPassword" 
                  type={showNewPassword ? "text" : "password"} 
                  value={passwordForm.newPassword} 
                  onChange={handlePasswordChange} 
                  required 
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters and include a number and a special character.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                value={passwordForm.confirmPassword} 
                onChange={handlePasswordChange} 
                required 
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" /> 
            Security Settings
          </CardTitle>
          <CardDescription>Configure your account security options</CardDescription>
        </CardHeader>
        <form onSubmit={handleSecuritySettingsSubmit}>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="twoFactorEnabled" className="text-base">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require a verification code at login
                </p>
              </div>
              <Switch 
                id="twoFactorEnabled" 
                checked={settings.twoFactorEnabled} 
                onCheckedChange={() => toggleSetting('twoFactorEnabled')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="loginNotifications" className="text-base">Login Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new login attempts
                </p>
              </div>
              <Switch 
                id="loginNotifications" 
                checked={settings.loginNotifications} 
                onCheckedChange={() => toggleSetting('loginNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="restrictedIpAccess" className="text-base">IP Restrictions</Label>
                <p className="text-sm text-muted-foreground">
                  Restrict access to specific IP addresses
                </p>
              </div>
              <Switch 
                id="restrictedIpAccess" 
                checked={settings.restrictedIpAccess} 
                onCheckedChange={() => toggleSetting('restrictedIpAccess')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="passwordExpiry" className="text-base">Password Expiry</Label>
                <p className="text-sm text-muted-foreground">
                  Require password change every 90 days
                </p>
              </div>
              <Switch 
                id="passwordExpiry" 
                checked={settings.passwordExpiry} 
                onCheckedChange={() => toggleSetting('passwordExpiry')}
              />
            </div>
            
            <div className="pt-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Smartphone className="h-5 w-5" /> 
                Trusted Devices
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-2">
                Manage devices that are trusted to access your account.
              </p>
              <Button type="button" variant="outline" size="sm">
                Manage Trusted Devices
              </Button>
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
    </div>
  );
};

export default SecuritySettings;
