
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransactionStore } from '@/stores/transactionStore';
import { useProfileStore } from '@/stores/profileStore';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { LogIn, Store, Loader2, CreditCard, ArrowLeft } from 'lucide-react';
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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-6 border-b bg-background">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mr-2">
                <CreditCard className="h-5 w-5 text-primary" />
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
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">
                {authMode === 'merchant' ? (
                  <div className="flex items-center justify-center gap-2">
                    <Store className="h-6 w-6 text-primary" />
                    Merchant Registration
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <LogIn className="h-6 w-6 text-primary" />
                    </div>
                    Welcome Back
                  </div>
                )}
              </CardTitle>
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
                            <Input 
                              placeholder="your@email.com" 
                              {...field} 
                              className="bg-secondary/30 border-secondary"
                            />
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
                            <Input 
                              type="password" 
                              placeholder="••••••" 
                              {...field} 
                              className="bg-secondary/30 border-secondary"
                            />
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
            <CardFooter className="flex flex-col pt-0">
              <Separator className="my-4" />
              {authMode === 'merchant' ? (
                <Button 
                  variant="outline" 
                  onClick={() => setAuthMode('login')}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              ) : (
                <div className="w-full">
                  <p className="text-center text-sm text-muted-foreground mb-3">
                    Don't have an account yet?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setAuthMode('merchant')}
                    className="w-full"
                  >
                    <Store className="mr-2 h-4 w-4" />
                    Register as Merchant
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              By continuing, you agree to RizzPay's{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
