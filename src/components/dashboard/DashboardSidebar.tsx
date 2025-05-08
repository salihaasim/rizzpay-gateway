
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard,
  FileText, 
  Settings, 
  Users, 
  Wallet,
  ChevronLeft,
  ArrowRightLeft,
  Upload,
  Download,
  BarChart3,
  Layers,
  Repeat,
  Menu,
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const sidebarItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Banking', path: '/banking', icon: <CreditCard className="h-5 w-5" /> },
    { name: 'Deposit', path: '/deposit', icon: <Upload className="h-5 w-5" /> },
    { name: 'Payout', path: '/payout', icon: <Download className="h-5 w-5" /> },
    { name: 'IMPS / UPI / NEFT', path: '/transfers', icon: <ArrowRightLeft className="h-5 w-5" /> },
    { name: 'Users', path: '/users', icon: <Users className="h-5 w-5" /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'Payment Retry', path: '/payment-retry', icon: <Repeat className="h-5 w-5" /> },
    { name: 'Wallet', path: '/wallet', icon: <Wallet className="h-5 w-5" /> },
    { name: 'Payment Tools', path: '/tools', icon: <Layers className="h-5 w-5" /> },
    { name: 'Services', path: '/services', icon: <FileText className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];
  
  // Sidebar for desktop
  const DesktopSidebar = (
    <div className={cn(
      "fixed inset-y-0 left-0 z-20 hidden md:flex flex-col bg-white shadow-sm border-r border-border/40 transition-all duration-300",
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
      </div>
    </div>
  );

  // Mobile sidebar (sheet)
  const MobileSidebar = (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild className="md:hidden absolute left-4 top-4 z-20">
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px]">
        <div className="flex h-16 items-center px-4 border-b">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-primary">RizzPay</h1>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <div className="space-y-1 px-3">
            {sidebarItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
  
  return (
    <TooltipProvider delayDuration={0}>
      {DesktopSidebar}
      {MobileSidebar}
    </TooltipProvider>
  );
};

export default DashboardSidebar;
