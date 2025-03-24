
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  CreditCard, 
  Settings, 
  Menu, 
  X, 
  LayoutDashboard, 
  Wallet, 
  Webhook, 
  ShieldCheck, 
  LogOut,
  UserCircle,
  Bell
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTransactionStore } from '@/stores/transactionStore';
import { cn } from '@/lib/utils';
import SupabaseStatus from './SupabaseStatus';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userRole, userEmail, resetUserRole } = useTransactionStore();
  
  // Handle window scroll for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Define navigation links based on user role
  const getNavLinks = () => {
    const commonLinks = [
      {
        name: 'Home',
        href: '/',
        icon: <Home className="h-4 w-4" />,
      },
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
      {
        name: 'Transactions',
        href: '/transactions',
        icon: <CreditCard className="h-4 w-4" />,
      }
    ];
    
    // Merchant-specific links
    const merchantLinks = [
      {
        name: 'Wallet',
        href: '/wallet',
        icon: <Wallet className="h-4 w-4" />,
      },
      {
        name: 'Webhook',
        href: '/webhook',
        icon: <Webhook className="h-4 w-4" />,
      }
    ];
    
    // Admin-specific links
    const adminLinks = [
      {
        name: 'Admin',
        href: '/admin',
        icon: <ShieldCheck className="h-4 w-4" />,
      }
    ];
    
    const links = [...commonLinks];
    
    // Add role-specific links
    if (userRole === 'merchant') {
      links.push(...merchantLinks);
    } else if (userRole === 'admin') {
      links.push(...adminLinks);
    }
    
    // Settings is available to all authenticated users
    links.push({
      name: 'Settings',
      href: '/settings',
      icon: <Settings className="h-4 w-4" />,
    });
    
    return links;
  };
  
  const navLinks = getNavLinks();

  const handleLogout = () => {
    resetUserRole();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userEmail) return 'U';
    return userEmail.substring(0, 2).toUpperCase();
  };
  
  return (
    <header 
      className={cn(
        "fixed w-full border-b z-10 transition-all duration-200",
        scrolled 
          ? "bg-background/95 backdrop-blur-md shadow-sm" 
          : "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="px-4 h-16 flex items-center justify-between mx-auto max-w-screen-2xl">
        <div className="flex items-center">
          <Link to="/" className="font-bold text-xl flex items-center mr-8">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mr-2">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <span className="bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              RizzPay
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <TooltipProvider key={link.href} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={link.href}>
                      <Button 
                        variant={isActive(link.href) ? "secondary" : "ghost"} 
                        size="sm"
                        className={cn(
                          "flex items-center h-9", 
                          isActive(link.href) ? "bg-secondary text-secondary-foreground" : ""
                        )}
                      >
                        <span className="mr-2">{link.icon}</span>
                        {link.name}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {link.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          {userRole && (
            <div className="hidden sm:flex items-center">
              <span className="text-sm text-muted-foreground">
                {userRole === 'admin' ? (
                  <span className="flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1 text-primary" />
                    Admin
                  </span>
                ) : (
                  <span>Merchant</span>
                )}
              </span>
            </div>
          )}
          
          <div className="hidden sm:flex">
            <SupabaseStatus />
          </div>
          
          {userRole && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userEmail}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userRole === 'admin' ? 'Administrator' : 'Merchant Account'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-rose-500 focus:text-rose-500" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 flex items-center justify-center text-[10px] text-white">3</span>
              </Button>
            </>
          )}
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <Link to="/" className="font-bold text-xl flex items-center" onClick={() => setMobileMenuOpen(false)}>
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mr-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <span className="bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                      RizzPay
                    </span>
                  </Link>
                </div>
                
                <nav className="flex-1 overflow-y-auto py-4">
                  <div className="px-3 space-y-1">
                    {navLinks.map((link) => (
                      <Link 
                        to={link.href} 
                        key={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center h-10 px-3 rounded-md text-sm font-medium",
                          isActive(link.href) 
                            ? "bg-primary/10 text-primary" 
                            : "text-foreground hover:bg-secondary"
                        )}
                      >
                        <span className="mr-3">{link.icon}</span>
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </nav>
                
                <div className="border-t p-4">
                  {userRole && (
                    <div className="bg-secondary/50 rounded-md p-3 mb-4">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none mb-1">
                            {userRole === 'admin' ? (
                              <span className="flex items-center">
                                <ShieldCheck className="h-3 w-3 mr-1 text-primary" />
                                Admin Account
                              </span>
                            ) : (
                              <span>Merchant Account</span>
                            )}
                          </p>
                          {userEmail && (
                            <p className="text-xs text-muted-foreground">
                              {userEmail}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-muted-foreground">Server Status</span>
                    <SupabaseStatus />
                  </div>
                  
                  {userRole && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }} 
                      className="w-full justify-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  )}
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
