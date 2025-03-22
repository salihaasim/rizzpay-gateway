
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransactionStore } from '@/stores/transactionStore';
import { useProfileStore } from '@/stores/profileStore';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { LogIn, Store, Loader2 } from 'lucide-react';
import MerchantRegistration from '@/components/auth/MerchantRegistration';
import { supabase } from '@/utils/supabaseClient';

// Validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Auth: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'merchant'>('login');
  const [loading, setLoading] = useState(false);
  const { setUserRole, initializeWallet } = useTransactionStore();
  const { merchants } = useProfileStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase().auth.getSession();
      if (data.session) {
        const { data: userData } = await supabase().auth.getUser();
        if (userData.user) {
          // Check if admin
          if (userData.user.email === 'admin@rizzpay.com') {
            setUserRole('admin', userData.user.email);
          } else {
            setUserRole('merchant', userData.user.email);
            initializeWallet(userData.user.email);
          }
          navigate('/dashboard');
        }
      }
    };
    
    checkSession();
  }, [navigate, setUserRole, initializeWallet]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const { data: authData, error } = await supabase().auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Check if admin
        if (authData.user.email === 'admin@rizzpay.com') {
          setUserRole('admin', authData.user.email);
          toast({
            title: "Admin login successful",
            description: "Welcome back, admin!",
          });
        } else {
          setUserRole('merchant', authData.user.email);
          initializeWallet(authData.user.email);
          toast({
            title: "Merchant login successful",
            description: `Welcome back!`,
          });
        }
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const switchToMerchantRegistration = () => {
    setAuthMode('merchant');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {authMode === 'merchant' ? (
                <div className="flex items-center justify-center gap-2">
                  <Store className="h-6 w-6 text-primary" />
                  Merchant Registration
                </div>
              ) : (
                "Welcome to Rizzpay"
              )}
            </CardTitle>
            <CardDescription>
              {authMode === 'merchant'
                ? "Register your business to start accepting payments"
                : "Login to access your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authMode === 'merchant' ? (
              // Merchant registration form
              <MerchantRegistration />
            ) : (
              // Login form
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <Separator className="my-2" />
            {authMode !== 'merchant' && (
              <Button 
                variant="outline" 
                className="w-full mt-2" 
                onClick={switchToMerchantRegistration}
              >
                <Store className="mr-2 h-4 w-4" />
                Register as Merchant
              </Button>
            )}
            {authMode === 'merchant' && (
              <Button 
                variant="outline" 
                className="w-full mt-2" 
                onClick={() => setAuthMode('login')}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
