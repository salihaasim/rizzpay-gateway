
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  ShieldCheck, 
  Users, 
  Settings, 
  CreditCard, 
  BarChart3,
  LogOut, 
  ChevronLeft, 
  Menu,
  Globe,
  Monitor,
  HelpCircle
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { adminUI } from '@/styles/rizzpay-ui';

interface AdminSidebarProps {
  userEmail: string | null;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  handleLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  userEmail, 
  collapsed, 
  setCollapsed, 
  handleLogout 
}) => {
  const location = useLocation();
  
  // Navigation items for admin
  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Merchants',
      href: '/admin/merchants',
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'Transactions',
      href: '/admin/transactions',
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userEmail) return 'A';
    return userEmail.substring(0, 2).toUpperCase();
  };

  return (
    <aside 
      className={cn(
        "fixed h-full z-20 transition-all duration-300 hidden lg:block",
        collapsed ? "w-20" : "w-[280px]"
      )}
      style={{ 
        width: collapsed ? adminUI.sidebar.collapsedWidth : adminUI.sidebar.width, 
        background: adminUI.sidebar.background 
      }}
    >
      <div className="h-16 border-b border-white/10 flex items-center px-4">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")} style={{ width: '100%' }}>
          {!collapsed && (
            <Link to="/admin" className="font-bold text-xl flex items-center">
              <div className="h-8 w-8 rounded-lg bg-[#9970e2]/10 flex items-center justify-center mr-2">
                <ShieldCheck className="h-5 w-5 text-[#9970e2]" />
              </div>
              <span className="text-white">RizzAdmin</span>
            </Link>
          )}
          {collapsed && (
            <div className="h-8 w-8 rounded-lg bg-[#9970e2]/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-[#9970e2]" />
            </div>
          )}
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCollapsed(true)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-4rem)] py-4">
        <div className="space-y-2 px-3">
          {navItems.map((item) => (
            <TooltipProvider key={item.href} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center py-3 px-3 rounded-md transition-colors",
                      collapsed ? "justify-center" : "justify-start",
                      isActive(item.href)
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <div className="flex items-center">
                      <span className={cn("", collapsed ? "" : "mr-3")}>{item.icon}</span>
                      {!collapsed && <span>{item.name}</span>}
                    </div>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        
        {/* Quick links section for common tasks */}
        {!collapsed && (
          <div className="mt-6 px-3">
            <h3 className="text-white/50 text-xs uppercase font-semibold px-3 mb-2">Quick Actions</h3>
            <div className="space-y-1">
              <Link
                to="/dashboard"
                className="flex items-center py-2 px-3 rounded-md transition-colors text-white/70 hover:text-white hover:bg-white/10"
              >
                <Monitor className="h-4 w-4 mr-3" />
                <span className="text-sm">Merchant View</span>
              </Link>
              <Link
                to="/"
                className="flex items-center py-2 px-3 rounded-md transition-colors text-white/70 hover:text-white hover:bg-white/10"
              >
                <Globe className="h-4 w-4 mr-3" />
                <span className="text-sm">Main Website</span>
              </Link>
              <Link
                to="#"
                className="flex items-center py-2 px-3 rounded-md transition-colors text-white/70 hover:text-white hover:bg-white/10"
              >
                <HelpCircle className="h-4 w-4 mr-3" />
                <span className="text-sm">Admin Guide</span>
              </Link>
            </div>
          </div>
        )}
        
        {!collapsed && (
          <div className="mt-8 px-6">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/90 text-sm font-medium mb-3">Admin Control Panel</p>
              <p className="text-white/70 text-xs mb-4">You have full access to manage the platform and users.</p>
              <p className="text-white/90 text-xs flex items-center">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Admin privileges
              </p>
            </div>
          </div>
        )}
      </ScrollArea>
      
      {!collapsed && (
        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback className="bg-[#9970e2] text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{userEmail}</p>
              <p className="text-white/70 text-xs">Administrator</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {collapsed && (
        <div className="absolute bottom-4 left-0 w-full flex justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(false)}
            className="text-white/70 hover:text-white hover:bg-white/10 h-10 w-10 rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
