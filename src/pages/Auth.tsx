
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { toast } from 'sonner';
import { useTransactionStore } from '@/stores/transactions';
import AuthHeader from '@/components/auth/AuthHeader';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import RoleSelector from '@/components/auth/RoleSelector';
import DemoCredentialsInfo from '@/components/auth/DemoCredentialsInfo';

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState('merchant');
  
  const { login, addMerchant, isAuthenticated, currentMerchant } = useMerchantAuth();
  const { setUserRole } = useTransactionStore();
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

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    console.log("Login attempt:", username);
    
    try {
      // Attempt login
      const success = login(username, password);
      
      if (success) {
        // Setup user role in transaction store
        const role = currentMerchant?.role || 'merchant';
        setUserRole(role as 'admin' | 'merchant', username);
      } else {
        setLoading(false);
        toast.error('Invalid credentials. Please check your username and password.');
      }
      // If successful, the useEffect will handle redirection
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  const handleRegister = (username: string, password: string, fullName: string) => {
    setLoading(true);
    
    // Handle registration
    addMerchant({
      username: username,
      password: password,
      fullName: fullName,
      email: `${username}@rizzpay.com`, // Add default email
      role: (activeRole === 'admin' ? 'admin' : 'merchant') as 'admin' | 'merchant'
    });
    
    setIsRegister(false);
    setLoading(false);
    toast.success('Registration successful! Please login with your credentials.');
  };

  const handleRoleChange = (role: string) => {
    setActiveRole(role);
  };

  const handleBack = () => {
    // Navigate back to where the user came from or to the home page
    navigate(-1);
  };

  // Auto-fill demo credentials based on selected role
  const fillDemoCredentials = () => {
    if (activeRole === 'admin') {
      return {
        username: 'rizzpay',
        password: 'rizzpay123',
      };
    } else {
      return {
        username: 'merchant',
        password: 'password',
      };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthHeader onBack={handleBack} />

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
                <RoleSelector 
                  activeRole={activeRole}
                  onRoleChange={handleRoleChange}
                />
              )}
              
              {isRegister ? (
                <RegisterForm 
                  loading={loading}
                  onSubmit={handleRegister}
                />
              ) : (
                <LoginForm 
                  activeRole={activeRole}
                  loading={loading}
                  onSubmit={handleLogin}
                  onFillDemoCredentials={() => handleLogin(
                    fillDemoCredentials().username,
                    fillDemoCredentials().password
                  )}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                variant="link"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister
                  ? 'Already have an account? Login'
                  : 'Need an account? Register'}
              </Button>
            </CardFooter>
          </Card>

          <DemoCredentialsInfo activeRole={activeRole} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
