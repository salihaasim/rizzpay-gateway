import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Building2, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useTransactionStore } from '@/stores/transactionStore';
import { supabase } from '@/utils/supabaseClient';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

const roles = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to all settings, merchants, and transactions. Monitor and manage the entire system.',
    icon: <Building2 className="h-8 w-8 text-primary" />,
    permissions: ['View all transactions', 'Manage merchants', 'System settings', 'Analytics access']
  },
  {
    id: 'merchant',
    name: 'Merchant',
    description: 'Accept payments, manage your store, and view transaction history for your business.',
    icon: <Store className="h-8 w-8 text-primary" />,
    permissions: ['Process payments', 'View your transactions', 'Business settings', 'Financial reports']
  }
];

const demoCredentials = {
  admin: { username: 'rizzpay', password: 'rizzpay123' },
  merchant: { username: 'merchant', password: 'password' },
};

const RoleSelector = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const { setUserRole, userRole, userEmail } = useTransactionStore();
  const { login: merchantLogin } = useMerchantAuth();

  useEffect(() => {
    if (userRole) {
      navigate('/dashboard');
    }
  }, [userRole, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = async () => {
    if (!showLogin) {
      setShowLogin(true);
      setCredentials({
        email: demoCredentials[selectedRole as keyof typeof demoCredentials].username,
        password: demoCredentials[selectedRole as keyof typeof demoCredentials].password,
      });
      return;
    }

    if (!credentials.email || !credentials.password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      console.log("Testing credentials:", credentials.email, credentials.password);
      
      const loginSuccess = merchantLogin(credentials.email, credentials.password);
      
      if (loginSuccess) {
        console.log("Merchant auth login successful");
        return;
      }
      
      console.log("Merchant auth login failed, trying Supabase auth");
      
      const { data, error } = await supabase().auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        const demoUser = demoCredentials[selectedRole as keyof typeof demoCredentials];
        
        console.log("Checking demo credentials:", demoUser);
        
        if ((credentials.email === demoUser.username || 
            credentials.email.toLowerCase() === selectedRole.toLowerCase()) && 
            (credentials.password === demoUser.password)) {
          
          console.log("Demo credentials match, logging in as:", selectedRole);
          
          setUserRole(selectedRole as 'admin' | 'merchant', credentials.email);
          
          toast.success(`Logged in as ${selectedRole}`);
          
          if (selectedRole === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
          return;
        }
        
        toast.error(error.message || "Invalid credentials. Try the demo credentials shown below.");
        return;
      }

      if (data.user) {
        if (data.user.email === 'admin@rizzpay.com' && selectedRole === 'admin') {
          setUserRole('admin', data.user.email);
          navigate('/admin');
        } else {
          setUserRole('merchant', data.user.email);
          navigate('/dashboard');
        }
        
        toast.success(`Logged in as ${selectedRole}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An error occurred during login");
    }
  };

  const handleRegisterAsMerchant = () => {
    navigate('/auth');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
      <Card className="shadow-lg border-0 overflow-hidden glass">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold">
            {showLogin ? `Login as ${roles.find(r => r.id === selectedRole)?.name}` : "Select Your Role"}
          </CardTitle>
          <CardDescription>
            {showLogin 
              ? "Enter your credentials to continue" 
              : "Choose how you want to use Rizzpay today"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {!showLogin ? (
            <Tabs
              defaultValue="admin"
              value={selectedRole}
              onValueChange={setSelectedRole}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-8">
                {roles.map((role) => (
                  <TabsTrigger
                    key={role.id}
                    value={role.id}
                    className="py-3 data-[state=active]:shadow-md transition-all"
                  >
                    {role.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {roles.map((role) => (
                <TabsContent
                  key={role.id}
                  value={role.id}
                  className="mt-0 animate-fade-in"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-center mt-4">
                    <div className="min-w-[80px] flex justify-center">
                      <div className="p-4 rounded-full bg-primary/10">
                        {role.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-semibold mb-2">{role.name}</h3>
                      <p className="text-muted-foreground">{role.description}</p>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {role.permissions.map((permission, idx) => (
                          <div key={idx} className="flex items-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                            <span className="text-sm">{permission}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="space-y-4 py-4 animate-fade-in">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <Input
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  onKeyDown={handleKeyDown}
                />
                <p className="text-xs text-muted-foreground">
                  Demo: {demoCredentials[selectedRole as keyof typeof demoCredentials].username}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  type="password"
                  onKeyDown={handleKeyDown}
                />
                <p className="text-xs text-muted-foreground">
                  Demo: {demoCredentials[selectedRole as keyof typeof demoCredentials].password}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowLogin(false);
                    setCredentials({ email: '', password: '' });
                  }}
                >
                  Back to Role Selection
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="text-primary"
                >
                  Forgot Password?
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-6 pb-6 flex flex-col justify-end gap-2">
          <Button 
            onClick={handleContinue}
            className="rounded-full px-8 shadow-md transition-all w-full"
          >
            {showLogin ? "Login" : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          {!showLogin && selectedRole === 'merchant' && (
            <Button 
              variant="outline"
              onClick={handleRegisterAsMerchant}
              className="rounded-full px-8 shadow-sm transition-all w-full mt-2"
            >
              Register as a New Merchant
              <Store className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default RoleSelector;
