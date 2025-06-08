
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { toast } from 'sonner';
import { 
  Shield, 
  Key, 
  Smartphone, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Download
} from 'lucide-react';

interface SecuritySettingsProps {
  merchant: any;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ merchant }) => {
  const { changePassword } = useMerchantAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailAlerts: true,
    smsAlerts: false,
    loginNotifications: true,
    apiAccessAlerts: true,
    suspiciousActivityAlerts: true
  });

  const [apiKeys] = useState([
    { id: 1, name: 'Production API Key', key: 'rizz_prod_***********', created: '2024-01-15', lastUsed: '2024-01-20', status: 'active' },
    { id: 2, name: 'Test API Key', key: 'rizz_test_***********', created: '2024-01-10', lastUsed: '2024-01-19', status: 'active' },
    { id: 3, name: 'Webhook API Key', key: 'rizz_hook_***********', created: '2024-01-08', lastUsed: 'Never', status: 'inactive' }
  ]);

  const [loginHistory] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'Mumbai, India', time: '2024-01-20 10:30:00', status: 'success' },
    { id: 2, device: 'Safari on iPhone', location: 'Mumbai, India', time: '2024-01-19 15:45:00', status: 'success' },
    { id: 3, device: 'Firefox on Linux', location: 'Delhi, India', time: '2024-01-18 09:15:00', status: 'failed' },
    { id: 4, device: 'Chrome on Windows', location: 'Mumbai, India', time: '2024-01-17 14:20:00', status: 'success' }
  ]);

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    const success = changePassword(
      merchant?.username || '',
      passwordData.currentPassword,
      passwordData.newPassword
    );

    if (success) {
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      toast.error('Current password is incorrect');
    }
  };

  const handleSecuritySettingChange = (setting: string, value: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
    toast.success('Security settings updated');
  };

  const generateNewApiKey = () => {
    toast.success('New API key generated successfully');
  };

  const revokeApiKey = (keyId: number) => {
    toast.success('API key revoked successfully');
  };

  const downloadLoginReport = () => {
    toast.success('Login activity report downloaded');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password Security
          </CardTitle>
          <CardDescription>Change your account password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <Button onClick={handlePasswordChange} className="bg-[#0052FF]">
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base">Enable 2FA</div>
              <div className="text-sm text-muted-foreground">
                Secure your account with SMS or authenticator app
              </div>
            </div>
            <Switch
              checked={securitySettings.twoFactorAuth}
              onCheckedChange={(checked) => handleSecuritySettingChange('twoFactorAuth', checked)}
            />
          </div>
          {!securitySettings.twoFactorAuth && (
            <Button variant="outline" className="w-full">
              Setup Two-Factor Authentication
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Alerts
          </CardTitle>
          <CardDescription>Configure how you want to receive security notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base">Email Alerts</div>
              <div className="text-sm text-muted-foreground">Get security alerts via email</div>
            </div>
            <Switch
              checked={securitySettings.emailAlerts}
              onCheckedChange={(checked) => handleSecuritySettingChange('emailAlerts', checked)}
            />
          </div>
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base">SMS Alerts</div>
              <div className="text-sm text-muted-foreground">Get security alerts via SMS</div>
            </div>
            <Switch
              checked={securitySettings.smsAlerts}
              onCheckedChange={(checked) => handleSecuritySettingChange('smsAlerts', checked)}
            />
          </div>
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base">Login Notifications</div>
              <div className="text-sm text-muted-foreground">Get notified of new login attempts</div>
            </div>
            <Switch
              checked={securitySettings.loginNotifications}
              onCheckedChange={(checked) => handleSecuritySettingChange('loginNotifications', checked)}
            />
          </div>
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base">API Access Alerts</div>
              <div className="text-sm text-muted-foreground">Get notified of API key usage</div>
            </div>
            <Switch
              checked={securitySettings.apiAccessAlerts}
              onCheckedChange={(checked) => handleSecuritySettingChange('apiAccessAlerts', checked)}
            />
          </div>
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base">Suspicious Activity Alerts</div>
              <div className="text-sm text-muted-foreground">Get alerts for unusual account activity</div>
            </div>
            <Switch
              checked={securitySettings.suspiciousActivityAlerts}
              onCheckedChange={(checked) => handleSecuritySettingChange('suspiciousActivityAlerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* API Key Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>API Key Management</CardTitle>
            <CardDescription>Manage your API keys for secure integration</CardDescription>
          </div>
          <Button onClick={generateNewApiKey} size="sm">
            Generate New Key
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{apiKey.name}</div>
                  <div className="text-sm text-muted-foreground font-mono">{apiKey.key}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(apiKey.status)}>
                    {apiKey.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => revokeApiKey(apiKey.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Login Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Login Activity</CardTitle>
            <CardDescription>Monitor recent access to your account</CardDescription>
          </div>
          <Button onClick={downloadLoginReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loginHistory.map((login) => (
              <div key={login.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(login.status)}
                  <div>
                    <div className="font-medium">{login.device}</div>
                    <div className="text-sm text-muted-foreground">{login.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{login.time}</div>
                  <Badge className={`text-xs ${login.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {login.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
