
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/stores/authStore';
import { useProfileStore } from '@/stores/profileStore';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LogOut, Menu } from 'lucide-react';

const navLinkClasses = ({ isActive }: { isActive: boolean }) => {
  return `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`;
};

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { profile } = useProfileStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-10 items-center">
          <Link to="/" className="flex items-center">
            <div className="text-xl font-semibold tracking-tight">
              <span className="text-primary">Rizz</span>
              <span>Pay</span>
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={navLinkClasses}>
                  Dashboard
                </NavLink>
                <NavLink to="/transactions" className={navLinkClasses}>
                  Transactions
                </NavLink>
                <NavLink to="/wallet" className={navLinkClasses}>
                  Wallet
                </NavLink>
                <NavLink to="/webhook" className={navLinkClasses}>
                  Webhooks
                </NavLink>
                <NavLink to="/developers" className={navLinkClasses}>
                  Developers
                </NavLink>
                <NavLink to="/payment" className={navLinkClasses}>
                  Make Payment
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/payment" className={navLinkClasses}>
                  Make Payment
                </NavLink>
                <NavLink to="/developers" className={navLinkClasses}>
                  Developers
                </NavLink>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "Avatar"} />
                    <AvatarFallback>{profile?.full_name?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{profile?.full_name || "User"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                  Logout
                  <LogOut className="ml-auto h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 border-t">
          <div className="container">
            <NavLink to="/" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
              Home
            </NavLink>
            
            {isAuthenticated ? (
              <div className="flex flex-col space-y-3">
                <NavLink to="/dashboard" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </NavLink>
                <NavLink to="/transactions" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
                  Transactions
                </NavLink>
                <NavLink to="/wallet" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
                  Wallet
                </NavLink>
                <NavLink to="/webhook" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
                  Webhooks
                </NavLink>
                <NavLink to="/developers" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
                  Developers
                </NavLink>
                <NavLink to="/payment" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
                  Make Payment
                </NavLink>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <NavLink to="/payment" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
                  Make Payment
                </NavLink>
                <NavLink to="/developers" className={navLinkClasses} onClick={() => setMobileMenuOpen(false)}>
                  Developers
                </NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
