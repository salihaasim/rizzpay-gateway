
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  ArrowLeft, 
  LayoutDashboard, 
  Settings,
  IdCard, 
  QrCode, 
  FileText,
  Wallet,
  ShieldCheck,
  Code,
  ActivitySquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import UserSwitcher from './UserSwitcher';
import logoSvg from '../assets/logo.svg';
import { motion } from "@/components/ui/motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Set mounted state to true after initial render for animations
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { name: 'Transactions', path: '/transactions', icon: <ActivitySquare className="h-4 w-4 mr-2" /> },
    { name: 'Wallet', path: '/wallet', icon: <Wallet className="h-4 w-4 mr-2" /> },
    { name: 'KYC Verification', path: '/kyc', icon: <IdCard className="h-4 w-4 mr-2" /> },
    { name: 'UPI Plugin', path: '/upi-plugin', icon: <QrCode className="h-4 w-4 mr-2" /> },
    { name: 'Developer Tools', path: '/developers', icon: <Code className="h-4 w-4 mr-2" /> },
    { name: 'Security', path: '/security', icon: <ShieldCheck className="h-4 w-4 mr-2" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-screen-2xl items-center px-3 sm:px-4 md:px-6 mx-auto">
        <div className="flex items-center gap-1 sm:gap-2">
          {location.pathname !== '/' && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack} 
              className="mr-1 sm:mr-2"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <Link 
            to="/" 
            className="font-semibold text-lg sm:text-xl text-[#0052FF] flex items-center gap-1"
          >
            <img src={logoSvg} alt="RizzPay Logo" className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-bold">RizzPay</span>
          </Link>
          
          <nav className="hidden md:flex gap-4 lg:gap-6 ml-4 lg:ml-6">
            {navItems.map((item, index) => 
              mounted ? (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      "text-sm font-medium transition-all duration-200 hover:text-[#0052FF] flex items-center",
                      isActive(item.path)
                        ? "text-[#0052FF]"
                        : "text-muted-foreground",
                      "relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 hover:after:scale-x-100 after:bg-[#0052FF] after:transition-transform"
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </motion.div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#0052FF] flex items-center",
                    isActive(item.path)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
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
              <Link to="/" className="flex items-center gap-1 mb-6 sm:mb-8">
                <img src={logoSvg} alt="RizzPay Logo" className="h-6 w-6" />
                <span className="font-bold text-xl">RizzPay</span>
              </Link>
              <div className="grid gap-1 py-4 sm:gap-2 sm:py-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        "flex w-full items-center py-2 text-base sm:text-lg font-semibold",
                        isActive(item.path)
                          ? "text-[#0052FF]"
                          : "text-muted-foreground"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {React.cloneElement(item.icon, { className: "mr-3 h-5 w-5" })}
                      {item.name}
                    </Link>
                  </motion.div>
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
