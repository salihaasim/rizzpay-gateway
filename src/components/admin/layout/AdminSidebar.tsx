
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart3,
  CreditCard,
  CircleDollarSign,
  Users,
  Shield,
  Settings,
  ChevronRight,
  ChevronLeft,
  Monitor,
  Database,
  TrendingUp,
  FileText,
  DollarSign,
  LogOut,
  UserCheck,
  HeadphonesIcon,
  Activity,
  Coins,
  Code,
  Lock,
  IndianRupee
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  userEmail: string;
  handleLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  hiddenOnMobile: boolean;
  setHiddenOnMobile: (hidden: boolean) => void;
}

const AdminSidebar = ({ 
  collapsed, 
  setCollapsed, 
  userEmail, 
  handleLogout,
  mobileMenuOpen, 
  setMobileMenuOpen, 
  hiddenOnMobile, 
  setHiddenOnMobile 
}: AdminSidebarProps) => {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  
  // Only show sidebar toggle on desktop
  const showToggle = !isMobile;
  
  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: "Merchants",
      href: "/admin/merchants",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Transactions",
      href: "/admin/transactions",
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      title: "Payout Management",
      href: "/admin/payout-management",
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      title: "KYC Management",
      href: "/admin/kyc",
      icon: <UserCheck className="h-5 w-5" />
    },
    {
      title: "Pricing Management",
      href: "/admin/pricing",
      icon: <IndianRupee className="h-5 w-5" />
    },
    {
      title: "Escrow Management",
      href: "/admin/escrow",
      icon: <Coins className="h-5 w-5" />
    },
    {
      title: "Payment Recon",
      href: "/admin/payment-recon",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Whitelist Management",
      href: "/admin/whitelist",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "Support Center",
      href: "/admin/support",
      icon: <HeadphonesIcon className="h-5 w-5" />
    },
    {
      title: "System Monitoring",
      href: "/admin/monitoring",
      icon: <Monitor className="h-5 w-5" />
    },
    {
      title: "API Management",
      href: "/admin/api-management",
      icon: <Code className="h-5 w-5" />
    },
    {
      title: "Activity Logs",
      href: "/admin/activity-log",
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  const sidebarClasses = cn(
    "flex flex-col h-full bg-[#111827] dark:bg-gray-900 text-white transition-all duration-300",
    isMobile ? (mobileMenuOpen ? "fixed inset-y-0 left-0 z-50 w-[280px]" : "hidden") : (collapsed ? "w-20" : "w-[280px]"),
    hiddenOnMobile && isMobile && "hidden"
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <div className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800 dark:border-gray-700">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            {(!collapsed || isMobile) && (
              <>
                <CircleDollarSign className="h-6 w-6 text-[#0052FF]" />
                <span className="font-bold text-lg text-white">RizzPay Admin</span>
              </>
            )}
            {collapsed && !isMobile && <CircleDollarSign className="h-6 w-6 mx-auto text-[#0052FF]" />}
          </Link>
          {showToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-8 w-8 text-muted-foreground hover:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-300 transition-all hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700",
                  pathname === item.href && "bg-gray-800 dark:bg-gray-700 text-white"
                )}
                onClick={() => isMobile && setMobileMenuOpen(false)}
              >
                {item.icon}
                {(!collapsed || isMobile) && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="mt-auto border-t border-gray-800 dark:border-gray-700 p-4">
          <div className={cn("flex items-center", (collapsed && !isMobile) ? "justify-center" : "space-x-3")}>
            <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-medium">A</span>
            </div>
            {(!collapsed || isMobile) && (
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none truncate max-w-[180px]">Admin</p>
                <p className="text-xs leading-none text-gray-400 truncate max-w-[180px]">{userEmail}</p>
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            className={cn(
              "w-full mt-4 text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700",
              (collapsed && !isMobile) ? "justify-center px-0" : "justify-start"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {(!collapsed || isMobile) && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
