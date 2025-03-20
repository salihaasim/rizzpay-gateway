
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  BarChart2,
  Settings,
  Home,
  Menu,
  X,
  LogOut,
  Wallet,
  LogIn,
  Shield
} from 'lucide-react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, userEmail, clearUserData } = useTransactionStore();
  const { toast } = useToast();

  // Build navItems based on user role
  const getNavItems = () => {
    const items = [
      { name: 'Home', path: '/', icon: Home },
    ];

    if (userRole) {
      items.push({ name: 'Dashboard', path: '/dashboard', icon: BarChart2 });
      items.push({ name: 'Transactions', path: '/transactions', icon: CreditCard });
      items.push({ name: 'Wallet', path: '/wallet', icon: Wallet });
      items.push({ name: 'Settings', path: '/settings', icon: Settings });

      // Admin-only items
      if (userRole === 'admin') {
        items.push({ 
          name: 'Webhook', 
          path: '/webhook', 
          icon: Shield,
          adminOnly: true
        });
        items.push({ 
          name: 'Payment', 
          path: '/payment', 
          icon: CreditCard,
          adminOnly: true
        });
      }
    }

    return items;
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    clearUserData();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 w-full bg-white/80 dark:bg-background/80 backdrop-blur-md z-50 border-b border-border px-8 py-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <Link to="/" className="flex items-center space-x-2">
            <span className="bg-primary text-primary-foreground p-2 rounded-md">
              <CreditCard size={20} />
            </span>
            <span className="font-bold text-xl">Rizzpay</span>
            {userRole === 'admin' && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Admin
              </span>
            )}
            {userRole === 'merchant' && userEmail && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {userEmail}
              </span>
            )}
          </Link>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              // Skip admin-only items for non-admin users
              if (item.adminOnly && userRole !== 'admin') return null;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-full transition-all duration-300",
                      isActive ? "bg-secondary text-foreground" : "hover:bg-secondary/50"
                    )}
                  >
                    <item.icon className="mr-2" size={18} />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
            
            {userRole ? (
              <Button 
                variant="ghost" 
                className="ml-2 rounded-full" 
                size="icon"
                onClick={handleLogout}
              >
                <LogOut size={18} />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="ml-2 rounded-full"
                onClick={handleLogin}
              >
                <LogIn size={18} className="mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 w-full bg-white/80 dark:bg-background/80 backdrop-blur-md z-50 border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <CreditCard size={18} />
            </span>
            <span className="font-bold text-lg">Rizzpay</span>
            {userRole === 'admin' && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
            {userRole === 'merchant' && userEmail && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full truncate max-w-[100px]">
                {userEmail}
              </span>
            )}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-16 bg-background/95 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col space-y-2 p-4 animate-slide-in">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              // Skip admin-only items for non-admin users
              if (item.adminOnly && userRole !== 'admin') return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center p-3 rounded-md",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "hover:bg-secondary/50"
                  )}
                >
                  <item.icon className="mr-3" size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-border">
              {userRole ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Logout</span>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => {
                    handleLogin();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogIn size={20} className="mr-3" />
                  <span>Login</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
