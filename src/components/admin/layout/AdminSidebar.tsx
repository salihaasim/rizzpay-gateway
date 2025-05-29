import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  User,
  UserPlus,
  ShoppingCart,
  CreditCard,
  Smartphone,
  FileText,
  Activity,
  LogOut,
  Shield,
  X,
  Monitor,
  Wallet
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface AdminSidebarProps {
  userEmail?: string;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  handleLogout?: () => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  hiddenOnMobile?: boolean;
  setHiddenOnMobile?: (hidden: boolean) => void;
}

export function AdminSidebar({ 
  userEmail, 
  collapsed, 
  setCollapsed, 
  handleLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
  hiddenOnMobile = false,
  setHiddenOnMobile
}: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      title: "Monitoring",
      href: "/admin/monitoring",
      icon: <Monitor className="h-5 w-5" />
    },
    {
      title: "Escrow Management",
      href: "/admin/escrow",
      icon: <Wallet className="h-5 w-5" />
    },
    {
      title: "Transactions",
      href: "/admin/transactions",
      icon: <ShoppingCart className="h-5 w-5" />
    },
    {
      title: "Transaction Log",
      href: "/admin/transactions-log",
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
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      title: "Merchants",
      href: "/admin/merchants",
      icon: <UserPlus className="h-5 w-5" />
    },
    {
      title: "KYC",
      href: "/admin/kyc",
      icon: <User className="h-5 w-5" />
    },
    {
      title: "Whitelist",
      href: "/admin/whitelist",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];
  
  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };
  
  // Mobile overlay for closing sidebar when clicking outside
  const handleOverlayClick = () => {
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && !hiddenOnMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "flex h-screen bg-white border-r border-gray-200 flex-col transition-all duration-300 shadow-sm z-50",
        "fixed lg:static inset-y-0 left-0",
        collapsed ? "w-16" : "w-64",
        // Mobile responsiveness
        "lg:translate-x-0",
        // Mobile menu state - only show when not hidden on mobile
        hiddenOnMobile 
          ? "-translate-x-full lg:translate-x-0" 
          : mobileMenuOpen 
            ? "translate-x-0" 
            : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => navigate("/")}
            className={cn(
              "flex items-center gap-2 font-bold text-lg text-primary",
              collapsed && "justify-center"
            )}
          >
            {collapsed ? (
              <span className="text-xl">RP</span>
            ) : (
              <>
                <CreditCard className="h-6 w-6" />
                <span className="hidden sm:inline">{siteConfig.name}</span>
                <span className="sm:hidden">RP</span>
              </>
            )}
          </button>
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="px-2 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActiveRoute(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.title : undefined}
              >
                {item.icon}
                {!collapsed && <span className="truncate">{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* User Section */}
        <div className="border-t border-gray-200 p-4">
          {!collapsed && userEmail && (
            <>
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white text-sm">
                    {userEmail.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userEmail.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              <Separator className="mb-3" />
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className={cn(
              "w-full text-gray-600 hover:text-red-600 hover:bg-red-50 justify-start",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
