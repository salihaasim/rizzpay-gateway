
import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Lock, LogIn, UserPlus, Shield, Store } from 'lucide-react';
import MerchantRegistration from '@/components/auth/MerchantRegistration';

// Admin credentials - in a real app, these would be stored securely
const ADMIN_EMAIL = "admin@rizzpay.com";
const ADMIN_PASSWORD = "admin123";

// Validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  company: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Auth: React.FC = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'merchant'>('login');
  const { setUserRole, initializeWallet } = useTransactionStore();
  const { addMerchant, merchants } = useProfileStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      company: "",
    },
  });

  const handleLoginSubmit = (data: LoginFormValues) => {
    if (isAdminLogin) {
      // Admin login check
      if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
        setUserRole('admin', data.email);
        toast({
          title: "Admin login successful",
          description: "Welcome back, admin!",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Admin login failed",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
      }
    } else {
      // Check if merchant with this email exists
      const merchant = merchants.find(m => m.email === data.email);
      
      if (merchant) {
        // This is a registered merchant - in a real app, you'd verify the password
        setUserRole('merchant', data.email);
        initializeWallet(data.email);
        toast({
          title: "Merchant login successful",
          description: `Welcome back, ${merchant.name}!`,
        });
        navigate('/dashboard');
      } else {
        // Regular user login - simplified for demo
        setUserRole('client', data.email);
        // Initialize wallet if it doesn't exist
        initializeWallet(data.email);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/dashboard');
      }
    }
  };

  const handleRegisterSubmit = (data: RegisterFormValues) => {
    // Add user to the system
    setUserRole('client', data.email);
    // Initialize wallet for new user
    initializeWallet(data.email);
    toast({
      title: "Registration successful",
      description: "Your account has been created",
    });
    navigate('/dashboard');
  };

  const toggleAdminLogin = () => {
    setIsAdminLogin(!isAdminLogin);
    setAuthMode('login');
    loginForm.reset();
  };

  const switchToMerchantRegistration = () => {
    setAuthMode('merchant');
    setIsAdminLogin(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isAdminLogin ? (
                <div className="flex items-center justify-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Admin Login
                </div>
              ) : authMode === 'merchant' ? (
                <div className="flex items-center justify-center gap-2">
                  <Store className="h-6 w-6 text-primary" />
                  Merchant Registration
                </div>
              ) : (
                "Welcome to Rizzpay"
              )}
            </CardTitle>
            <CardDescription>
              {isAdminLogin
                ? "Login to access the admin dashboard"
                : authMode === 'merchant'
                ? "Register your business to start accepting payments"
                : "Login or create a new account to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAdminLogin ? (
              // Admin login form
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Email</FormLabel>
                        <FormControl>
                          <Input placeholder="admin@rizzpay.com" {...field} />
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
                  <Button type="submit" className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login as Admin
                  </Button>
                </form>
              </Form>
            ) : authMode === 'merchant' ? (
              // Merchant registration form
              <MerchantRegistration />
            ) : (
              // Regular user login/register tabs
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
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
                      <Button type="submit" className="w-full">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
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
                        control={registerForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Company" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
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
                      <Button type="submit" className="w-full">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Account
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <Separator className="my-2" />
            {authMode !== 'merchant' && (
              <Button 
                variant="outline" 
                className="w-full mt-2" 
                onClick={toggleAdminLogin}
              >
                <Lock className="mr-2 h-4 w-4" />
                {isAdminLogin ? "Switch to User Login" : "Admin Login"}
              </Button>
            )}
            {!isAdminLogin && authMode !== 'merchant' && (
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
