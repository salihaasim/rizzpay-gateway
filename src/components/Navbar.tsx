
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ArrowLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import UserSwitcher from './UserSwitcher';
import logoSvg from '../assets/logo.svg';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Wallet', path: '/wallet' },
    { name: 'Developer', path: '/developer' },
    { name: 'Security', path: '/security' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 max-w-screen-2xl items-center px-4 md:px-6 mx-auto">
        <div className="flex items-center gap-2">
          {location.pathname !== '/' && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack} 
              className="mr-2"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <Link 
            to="/" 
            className="font-semibold text-xl text-[#0052FF] flex items-center gap-2"
          >
            <img src={logoSvg} alt="RizzPay Logo" className="h-8 w-8" />
            <span className="font-bold">RizzPay</span>
          </Link>
          
          <nav className="hidden md:flex gap-6 ml-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#0052FF] flex items-center gap-1",
                  isActive(item.path)
                    ? "text-[#0052FF] font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {item.path === '/' && <Home className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <UserSwitcher />
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link to="/" className="flex items-center gap-2 mb-8">
                <img src={logoSvg} alt="RizzPay Logo" className="h-7 w-7" />
                <span className="font-bold text-xl">RizzPay</span>
              </Link>
              <div className="grid gap-2 py-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex w-full items-center py-2 text-lg font-semibold",
                      isActive(item.path)
                        ? "text-[#0052FF]"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.path === '/' && <Home className="h-4 w-4 mr-2" />}
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
