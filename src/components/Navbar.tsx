
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
import { useMediaQuery } from "@/hooks/use-media-query";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

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
      <div className="flex h-16 max-w-screen-2xl items-center px-4 lg:px-6 mx-auto">
        <div className="flex items-center gap-2 lg:gap-3">
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
            className="font-semibold text-xl lg:text-2xl text-[#0052FF] flex items-center gap-2"
          >
            <img src={logoSvg} alt="RizzPay Logo" className="h-6 w-6 lg:h-7 lg:w-7" />
            <span className="font-bold">RizzPay</span>
          </Link>
        </div>
        
        <nav className="hidden lg:flex items-center justify-center flex-1 px-4">
          <div className="flex gap-1 bg-secondary/30 p-1 rounded-lg">
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
                      "px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:text-[#0052FF] flex items-center rounded-md",
                      isActive(item.path)
                        ? "text-[#0052FF] bg-background shadow-sm"
                        : "text-muted-foreground hover:bg-background/50"
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
                    "px-3 py-1.5 text-sm font-medium transition-colors hover:text-[#0052FF] flex items-center rounded-md",
                    isActive(item.path)
                      ? "text-[#0052FF] bg-background shadow-sm"
                      : "text-muted-foreground hover:bg-background/50"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )
            )}
          </div>
        </nav>
        
        {/* Tablet view: simplified navigation */}
        <nav className="hidden md:flex lg:hidden gap-1 mx-4 overflow-x-auto pb-2 flex-1 justify-center">
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
                    "p-2 text-sm font-medium transition-all duration-200 hover:text-[#0052FF] flex items-center",
                    isActive(item.path)
                      ? "text-[#0052FF]"
                      : "text-muted-foreground"
                  )}
                  title={item.name}
                >
                  {React.cloneElement(item.icon, { className: "h-5 w-5 mr-0" })}
                  <span className="sr-only">{item.name}</span>
                </Link>
              </motion.div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "p-2 text-sm font-medium transition-colors hover:text-[#0052FF] flex items-center",
                  isActive(item.path)
                    ? "text-[#0052FF]"
                    : "text-muted-foreground"
                )}
                title={item.name}
              >
                {React.cloneElement(item.icon, { className: "h-5 w-5 mr-0" })}
                <span className="sr-only">{item.name}</span>
              </Link>
            )
          )}
        </nav>
        
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
              <Link to="/" className="flex items-center gap-2 mb-6 sm:mb-8">
                <img src={logoSvg} alt="RizzPay Logo" className="h-7 w-7" />
                <span className="font-bold text-xl">RizzPay</span>
              </Link>
              <div className="grid gap-1 py-4">
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
                        "flex w-full items-center py-2 px-3 text-base font-medium rounded-md",
                        isActive(item.path)
                          ? "text-[#0052FF] bg-secondary/50"
                          : "text-muted-foreground hover:bg-secondary/30"
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
