
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
  IndianRupee,
  RefreshCw
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
  
  const showToggle = !isMobile;
  
  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: "Monitoring",
      href: "/admin/monitoring",
      icon: <Monitor className="h-5 w-5" />
    },
    {
      title: "API Management",
      href: "/admin/api-management",
      icon: <Code className="h-5 w-5" />
    },
    {
      title: "Production APIs",
      href: "/admin/production-api",
      icon: <Database className="h-5 w-5" />
    },
    {
      title: "Escrow Management",
      href: "/admin/escrow",
      icon: <Coins className="h-5 w-5" />
    },
    {
      title: "Payout Management",
      href: "/admin/payout-management",
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      title: "Payment Reconciliation",
      href: "/admin/payment-reconciliation",
      icon: <RefreshCw className="h-5 w-5" />
    },
    {
      title: "Transactions",
      href: "/admin/transactions",
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      title: "Transaction Log",
      href: "/admin/transaction-log",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Activity Log",
      href: "/admin/activity-log",
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: "UPI Management",
      href: "/admin/upi-management",
      icon: <IndianRupee className="h-5 w-5" />
    },
    {
      title: "Merchants",
      href: "/admin/merchants",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "KYC",
      href: "/admin/kyc",
      icon: <UserCheck className="h-5 w-5" />
    },
    {
      title: "Support",
      href: "/admin/support",
      icon: <HeadphonesIcon className="h-5 w-5" />
    }
  ];

  const sidebarClasses = cn(
    "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            {(!collapsed || isMobile) && (
              <>
                <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <CircleDollarSign className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg text-blue-500">RizzPay</span>
              </>
            )}
            {collapsed && !isMobile && (
              <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto">
                <CircleDollarSign className="h-5 w-5 text-white" />
              </div>
            )}
          </Link>
          {showToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-8 w-8 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-4">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-lg",
                  pathname === item.href 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-black"
                )}
                onClick={() => isMobile && setMobileMenuOpen(false)}
              >
                {item.icon}
                {(!collapsed || isMobile) && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="mt-auto border-t border-gray-200 p-4">
          <div className={cn("flex items-center", (collapsed && !isMobile) ? "justify-center" : "space-x-3 mb-4")}>
            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">A</span>
            </div>
            {(!collapsed || isMobile) && (
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none truncate max-w-[180px] text-gray-900">admin</p>
                <p className="text-xs leading-none text-gray-500 truncate max-w-[180px]">Administrator</p>
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            className={cn(
              "w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all",
              (collapsed && !isMobile) ? "justify-center px-0" : "justify-start"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {(!collapsed || isMobile) && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
