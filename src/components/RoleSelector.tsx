
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTransactionStore } from '@/stores/transactionStore';
import { supabase } from '@/utils/supabaseClient';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import RoleTabs from './role/RoleTabs';
import LoginForm from './role/LoginForm';
import { roles, demoCredentials } from './role/roleConstants';

const RoleSelector = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const { setUserRole, userRole } = useTransactionStore();
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
  
  const handleBack = () => {
    setShowLogin(false);
    setCredentials({ email: '', password: '' });
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
            <RoleTabs 
              roles={roles} 
              selectedRole={selectedRole} 
              onRoleChange={setSelectedRole} 
            />
          ) : (
            <LoginForm 
              credentials={credentials}
              selectedRole={selectedRole}
              demoCredentials={demoCredentials}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBack={handleBack}
            />
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
