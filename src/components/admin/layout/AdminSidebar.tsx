
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  LogOut,
  Settings,
  Users,
  Shield,
  MonitorSmartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarProps {
  userEmail: string;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  handleLogout: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({
  userEmail,
  collapsed,
  setCollapsed,
  handleLogout,
}) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const sidebarItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Merchants',
      path: '/admin/merchants',
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'Escrow',
      path: '/admin/escrow',
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: 'Pricing',
      path: '/admin/pricing',
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: 'Whitelist',
      path: '/admin/whitelist',
      icon: <Shield className="h-5 w-5" />,
    },
    {
      name: 'Monitoring',
      path: '/admin/monitoring',
      icon: <MonitorSmartphone className="h-5 w-5" />,
    },
    {
      name: 'Transactions',
      path: '/admin/transactions',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-10 flex flex-col bg-white shadow-sm border-r border-border/40 transition-all duration-300",
          collapsed ? "w-20" : "w-[280px]"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && (
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-primary">RizzPay</h1>
              <Badge variant="outline" className="ml-2 text-xs">
                Admin
              </Badge>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("rounded-full", collapsed && "mx-auto")}
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <div className="space-y-1 px-3">
            {sidebarItems.map((item) => (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link to={item.path}>
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        collapsed && "h-10 w-10 p-0 justify-center"
                      )}
                    >
                      {item.icon}
                      {!collapsed && (
                        <span className="ml-3">{item.name}</span>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </div>
        
        <div className="p-3 mt-auto">
          <Separator className="my-2" />
          {!collapsed && (
            <div className="mb-2 px-4">
              <p className="text-sm text-muted-foreground truncate">
                {userEmail}
              </p>
            </div>
          )}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50",
                  collapsed && "h-10 w-10 p-0 justify-center"
                )}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Logout</TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';

export default AdminSidebar;
