
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, LogIn, Store, Loader2 } from 'lucide-react';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { useTransactionStore } from '@/stores/transactionStore';

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: ''
  });
  
  const { login, addMerchant, isAuthenticated, currentMerchant } = useMerchantAuth();
  const { userRole } = useTransactionStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the previous location from state or default to home
  const { from } = location.state || { from: { pathname: '/' } };

  useEffect(() => {
    if (isAuthenticated) {
      // Check if the user is an admin from transactionStore
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isRegister) {
      addMerchant({
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName
      });
      setIsRegister(false);
      setFormData({ username: '', password: '', fullName: '' });
    } else {
      const success = login(formData.username, formData.password);
      if (success) {
        // Redirect is handled by the useEffect
      }
    }

    setLoading(false);
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

  return (
    <div className="min-h-screen flex flex-col">
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
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center bg-secondary/10 py-10">
        <div className="w-full max-w-md px-4">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isRegister ? 'Register as Merchant' : 'Merchant Login'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
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
            <p>Username: merchant</p>
            <p>Password: password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
