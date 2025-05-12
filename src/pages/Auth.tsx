
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, LogIn, Store, Loader2, Building2 } from 'lucide-react';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { roles, demoCredentials } from '@/components/role/roleConstants';

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState('merchant');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: ''
  });
  
  const { login, addMerchant, isAuthenticated, currentMerchant } = useMerchantAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the previous location from state or default to home
  const { from } = location.state || { from: { pathname: '/' } };

  // Check authentication status on mount and when it changes
  useEffect(() => {
    console.log("Auth effect running, authenticated:", isAuthenticated, "merchant:", currentMerchant);
    
    if (isAuthenticated && currentMerchant) {
      setLoading(false); // Ensure loading is turned off
      
      // Check if the user is an admin
      if (currentMerchant.role === 'admin') {
        console.log("Admin user authenticated, redirecting to admin dashboard");
        navigate('/admin', { replace: true });
      } else {
        console.log("Merchant user authenticated, redirecting to merchant dashboard");
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, currentMerchant, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Form submitted:", formData);
    console.log("Active role:", activeRole);

    if (isRegister) {
      // Handle registration
      addMerchant({
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: `${formData.username}@rizzpay.com`, // Add default email
        role: (activeRole === 'admin' ? 'admin' : 'merchant') as 'admin' | 'merchant'
      });
      
      setIsRegister(false);
      setFormData({ username: '', password: '', fullName: '' });
      setLoading(false);
      toast.success('Registration successful! Please login with your credentials.');
    } else {
      try {
        // Special case for admin login
        if (activeRole === 'admin') {
          console.log("Testing credentials:", formData.username, formData.password);
          console.log("Demo credentials:", demoCredentials.admin);
        }
        
        // Attempt login
        const success = login(formData.username, formData.password);
        
        if (!success) {
          setLoading(false);
          toast.error('Invalid credentials. Please check your username and password.');
        }
        // If successful, the useEffect will handle redirection
      } catch (error) {
        console.error("Login error:", error);
        setLoading(false);
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBack = () => {
    // Navigate back to where the user came from or to the home page
    navigate(-1);
  };

  // Auto-fill demo credentials based on selected role
  const fillDemoCredentials = () => {
    if (activeRole === 'admin') {
      setFormData({
        username: 'rizzpay',
        password: 'rizzpay123',
        fullName: ''
      });
    } else {
      setFormData({
        username: 'merchant',
        password: 'password',
        fullName: ''
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full py-6 border-b bg-background">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mr-2">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                RizzPay
              </span>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center bg-secondary/10 py-10">
        <div className="w-full max-w-md px-4">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isRegister ? 'Register Account' : `${activeRole === 'admin' ? 'Admin' : 'Merchant'} Login`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isRegister && (
                <Tabs
                  defaultValue="merchant"
                  value={activeRole}
                  onValueChange={(value) => {
                    setActiveRole(value);
                    // Clear form data when switching roles
                    setFormData({ username: '', password: '', fullName: '' });
                  }}
                  className="mb-6"
                >
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="merchant" className="flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      Merchant
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Admin
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder={`Enter your ${activeRole} username`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {isRegister && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isRegister ? 'Registering...' : 'Logging in...'}
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      {isRegister ? 'Register' : 'Login'}
                    </>
                  )}
                </Button>

                {!isRegister && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={fillDemoCredentials}
                  >
                    Use Demo Credentials
                  </Button>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                variant="link"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setFormData({ username: '', password: '', fullName: '' });
                }}
              >
                {isRegister
                  ? 'Already have an account? Login'
                  : 'Need an account? Register'}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Demo credentials:</p>
            {activeRole === 'admin' ? (
              <>
                <p>Username: rizzpay</p>
                <p>Password: rizzpay123</p>
              </>
            ) : (
              <>
                <p>Username: merchant</p>
                <p>Password: password</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
