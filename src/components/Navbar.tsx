
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RoleSelector } from '@/components/RoleSelector';
import { Home, CreditCard, Settings, Menu, X, LayoutDashboard, Wallet, Webhook, ShieldCheck } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTransactionStore } from '@/stores/transactionStore';
import { cn } from '@/lib/utils';
import { SupabaseStatus } from './SupabaseStatus';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userRole, userEmail } = useTransactionStore();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navLinks = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: <CreditCard className="h-4 w-4 mr-2" />,
    },
    {
      name: 'Wallet',
      href: '/wallet',
      icon: <Wallet className="h-4 w-4 mr-2" />,
    },
    {
      name: 'Webhook',
      href: '/webhook',
      icon: <Webhook className="h-4 w-4 mr-2" />,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings className="h-4 w-4 mr-2" />,
    },
  ];

  // Add admin link if user is admin
  if (userRole === 'admin') {
    navLinks.push({
      name: 'Admin',
      href: '/admin',
      icon: <ShieldCheck className="h-4 w-4 mr-2" />,
    });
  }
  
  return (
    <header className="fixed w-full border-b bg-background z-10">
      <div className="px-4 h-14 flex items-center justify-between mx-auto max-w-screen-2xl">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-xl flex items-center mr-8">
            <img src="/placeholder.svg" alt="Logo" className="h-6 w-6 mr-2" />
            RizzPay
          </Link>
          
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link to={link.href} key={link.href}>
                <Button 
                  variant={isActive(link.href) ? "secondary" : "ghost"} 
                  size="sm"
                  className={cn(
                    "flex items-center h-9", 
                    isActive(link.href) ? "bg-secondary text-secondary-foreground" : ""
                  )}
                >
                  {link.icon}
                  {link.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex">
            <SupabaseStatus />
          </div>
          
          <RoleSelector />
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:w-72">
              <div className="px-2 py-6">
                <Link to="/" className="font-bold text-xl flex items-center mb-8">
                  <img src="/placeholder.svg" alt="Logo" className="h-6 w-6 mr-2" />
                  RizzPay
                </Link>
                
                <nav className="flex flex-col space-y-1">
                  {navLinks.map((link) => (
                    <Link to={link.href} key={link.href}>
                      <Button 
                        variant={isActive(link.href) ? "secondary" : "ghost"} 
                        className={cn(
                          "w-full justify-start", 
                          isActive(link.href) ? "bg-secondary text-secondary-foreground" : ""
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.icon}
                        {link.name}
                      </Button>
                    </Link>
                  ))}
                </nav>
                
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {userEmail ? `Logged in as: ${userEmail}` : 'Not logged in'}
                  </p>
                  
                  <div className="mt-4">
                    <SupabaseStatus />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
