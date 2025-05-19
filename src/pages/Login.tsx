
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole } = useTransactionStore();
  const { login: merchantLogin } = useMerchantAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    
    try {
      // First try merchant auth
      const success = merchantLogin(email, password);
      
      if (success) {
        toast.success('Login successful');
        setIsLoading(false);
        return; // Navigation is handled by useEffect in merchantAuthStore
      }
      
      // If merchant auth fails, try admin login
      if (email.toLowerCase().includes('admin')) {
        // Set as admin
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');
        setUserRole('admin', email);
        toast.success('Logged in as Admin');
        navigate('/admin', { replace: true });
      } else {
        // Set as merchant
        localStorage.setItem('userRole', 'merchant');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');
        setUserRole('merchant', email);
        toast.success('Logged in as Merchant');
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Invalid email or password. Please try again.');
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="w-full py-4 border-b bg-background">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-primary">RizzPay</Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </header>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {errorMessage}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
              
              {/* Removed demo credentials */}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button variant="link" onClick={() => navigate('/register')}>
              Don't have an account? Register
            </Button>
            <Button variant="link" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
