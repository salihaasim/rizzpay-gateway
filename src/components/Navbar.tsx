import React, { useState, useCallback, memo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Home, LayoutDashboard, Receipt, Wallet, Webhook, Code, CreditCard, Shield, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinkClasses = ({ isActive }: { isActive: boolean }) => {
  return cn(
    "text-sm font-medium transition-all duration-200 hover:text-primary flex items-center gap-2",
    isActive ? "text-primary" : "text-muted-foreground"
  );
};

const Navbar = memo(() => {
  const { isAuthenticated, logout, currentMerchant } = useMerchantAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prevState => !prevState);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    logout();
    navigate('/auth');
  }, [logout, navigate]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-10 items-center">
          <Link to="/" className="flex items-center group">
            <div className="text-2xl font-bold tracking-tight transition-colors duration-200">
              <span className="text-primary group-hover:text-primary/90">Rizz</span>
              <span className="group-hover:text-foreground/90">Pay</span>
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            {!isAuthenticated ? (
              <NavLink to="/" className={navLinkClasses}>
                <Home className="h-4 w-4" />
                Home
              </NavLink>
            ) : null}
            
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navLinkClasses}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </NavLink>
                <NavLink to="/transactions" className={navLinkClasses}>
                  <Receipt className="h-4 w-4" />
                  Transactions
                </NavLink>
                <NavLink to="/wallet" className={navLinkClasses}>
                  <Wallet className="h-4 w-4" />
                  Wallet
                </NavLink>
                <NavLink to="/webhook" className={navLinkClasses}>
                  <Webhook className="h-4 w-4" />
                  Webhooks
                </NavLink>
                <NavLink to="/developers" className={navLinkClasses}>
                  <Code className="h-4 w-4" />
                  Developers
                </NavLink>
                <NavLink to="/security" className={navLinkClasses}>
                  <Shield className="h-4 w-4" />
                  Security
                </NavLink>
                <NavLink to="/settings" className={navLinkClasses}>
                  <Settings className="h-4 w-4" />
                  Settings
                </NavLink>
              </>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden hover:bg-primary/10" 
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/10">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-primary/10">
                      {currentMerchant?.fullName?.slice(0, 2).toUpperCase() || currentMerchant?.username?.slice(0, 2).toUpperCase() || "MP"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <DropdownMenuLabel className="font-semibold">
                  {currentMerchant?.fullName || currentMerchant?.username || "Merchant"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  Logout
                  <LogOut className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="hover:bg-primary/10">
                  Log In
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      <div className={cn(
        "md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ease-in-out",
        mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="container py-4 flex flex-col space-y-3">
          {!isAuthenticated ? (
            <NavLink to="/" className={navLinkClasses} onClick={closeMobileMenu}>
              <Home className="h-4 w-4" />
              Home
            </NavLink>
          ) : null}
          
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navLinkClasses} onClick={closeMobileMenu}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>
              <NavLink to="/transactions" className={navLinkClasses} onClick={closeMobileMenu}>
                <Receipt className="h-4 w-4" />
                Transactions
              </NavLink>
              <NavLink to="/wallet" className={navLinkClasses} onClick={closeMobileMenu}>
                <Wallet className="h-4 w-4" />
                Wallet
              </NavLink>
              <NavLink to="/webhook" className={navLinkClasses} onClick={closeMobileMenu}>
                <Webhook className="h-4 w-4" />
                Webhooks
              </NavLink>
              <NavLink to="/developers" className={navLinkClasses} onClick={closeMobileMenu}>
                <Code className="h-4 w-4" />
                Developers
              </NavLink>
              <NavLink to="/security" className={navLinkClasses} onClick={closeMobileMenu}>
                <Shield className="h-4 w-4" />
                Security
              </NavLink>
              <NavLink to="/settings" className={navLinkClasses} onClick={closeMobileMenu}>
                <Settings className="h-4 w-4" />
                Settings
              </NavLink>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
