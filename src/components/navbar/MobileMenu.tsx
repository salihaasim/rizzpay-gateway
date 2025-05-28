
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import logoSvg from '../../assets/logo.svg';
import { motion } from "@/components/ui/motion";
import { 
  LayoutDashboard, 
  Settings,
  IdCard, 
  QrCode, 
  Wallet,
  ShieldCheck,
  Code,
  ActivitySquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open, setOpen }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
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
  );
};

export default MobileMenu;
