
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Settings, 
  Users, 
  Wallet,
  CreditCard,
  ChevronLeft,
  QrCode,
  Code,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTransactionStore } from '@/stores/transactionStore';
import { Separator } from '@/components/ui/separator';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  collapsed, 
  setCollapsed 
}) => {
  const location = useLocation();
  const { userEmail } = useTransactionStore();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const sidebarItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Transactions', path: '/transactions', icon: <FileText className="h-5 w-5" /> },
    { name: 'Wallet', path: '/wallet', icon: <Wallet className="h-5 w-5" /> },
    { name: 'UPI Plugin', path: '/upi-plugin', icon: <QrCode className="h-5 w-5" /> },
    { name: 'Developer Tools', path: '/developers', icon: <Code className="h-5 w-5" /> },
    { name: 'Security', path: '/security', icon: <ShieldCheck className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];
  
  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col bg-white shadow-sm border-r border-border/40 transition-all duration-300",
        collapsed ? "w-20" : "w-[280px]"
      )}>
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && (
            <Link to="/" className="flex items-center">
              <h1 className="text-xl font-bold text-primary">RizzPay</h1>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn("rounded-full", collapsed && "mx-auto")}
          >
            <ChevronLeft className={cn(
              "h-5 w-5 transition-transform",
              collapsed && "rotate-180"
            )} />
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
                        collapsed && "justify-center px-0"
                      )}
                    >
                      {item.icon}
                      {!collapsed && <span className="ml-3">{item.name}</span>}
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
          
          <Separator className="my-4" />
          
          {/* Pay-in and Pay-out Summary */}
          <div className={cn("px-3", collapsed && "hidden")}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Transaction Summary</h3>
            
            <div className="space-y-3">
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <ArrowRight className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Pay-in</p>
                      <p className="text-lg font-bold">₹32,450.00</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <ArrowLeft className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Pay-out</p>
                      <p className="text-lg font-bold">₹18,750.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Compact Pay-in/Pay-out for collapsed state */}
          {collapsed && (
            <div className="px-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <ArrowLeft className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="w-40">
                  <div className="space-y-2">
                    <p className="text-xs">Pay-in: ₹32,450.00</p>
                    <p className="text-xs">Pay-out: ₹18,750.00</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
        
        {!collapsed && userEmail && (
          <div className="p-4 mt-auto">
            <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default DashboardSidebar;
