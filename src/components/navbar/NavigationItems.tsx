
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import { motion } from "@/components/ui/motion";

interface NavigationItemsProps {
  mounted: boolean;
  navHidden: boolean;
}

const NavigationItems: React.FC<NavigationItemsProps> = ({ mounted, navHidden }) => {
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
    <>
      {/* Desktop Navigation */}
      <nav className={cn(
        "hidden lg:flex items-center justify-center flex-1 px-4 transition-all duration-300",
        navHidden && "opacity-0 pointer-events-none"
      )}>
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
                  <span className="hidden xl:inline">{item.name}</span>
                  <span className="xl:hidden">{item.name.split(' ')[0]}</span>
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
                <span className="hidden xl:inline">{item.name}</span>
                <span className="xl:hidden">{item.name.split(' ')[0]}</span>
              </Link>
            )
          )}
        </div>
      </nav>
      
      {/* Tablet Navigation */}
      <nav className={cn(
        "hidden md:flex lg:hidden gap-1 mx-4 overflow-x-auto pb-2 flex-1 justify-center transition-all duration-300",
        navHidden && "opacity-0 pointer-events-none"
      )}>
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
    </>
  );
};

export default NavigationItems;
