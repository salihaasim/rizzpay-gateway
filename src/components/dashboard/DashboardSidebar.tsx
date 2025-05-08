
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard,
  ArrowRightLeft,
  BarChart3,
  Wallet,
  FileText, 
  Menu,
  ChevronLeft,
  LogOut,
  User,
  Settings,
  Webhook,
  UserCheck,
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
import { useMerchantAuth } from '@/stores/merchantAuthStore';

interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  collapsed, 
  setCollapsed 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userEmail } = useTransactionStore();
  const { logout } = useMerchantAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Updated merchant-related pages with removed items
  const sidebarItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Banking', path: '/banking', icon: <CreditCard className="h-5 w-5" /> },
    { name: 'Transfers', path: '/transfers', icon: <ArrowRightLeft className="h-5 w-5" /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'Wallet', path: '/wallet', icon: <Wallet className="h-5 w-5" /> },
    { name: 'Services', path: '/services', icon: <FileText className="h-5 w-5" /> },
    { name: 'KYC Verification', path: '/kyc', icon: <UserCheck className="h-5 w-5" /> },
    { name: 'UPI Plugin', path: '/upi-plugin', icon: <CreditCard className="h-5 w-5" /> },
    { name: 'Developers', path: '/developers', icon: <Webhook className="h-5 w-5" /> },
  ];
  
  // Sidebar for desktop
  const DesktopSidebar = (
    <div className={cn(
      "fixed inset-y-0 left-0 z-20 hidden md:flex flex-col bg-white shadow-sm border-r border-border/40 transition-all duration-300",
      collapsed ? "w-20" : "w-[260px]"
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
      
      <div className="flex-1 overflow-auto py-4 px-2">
        <div className="space-y-1">
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
                    {!collapsed && <span className="ml-3 text-sm">{item.name}</span>}
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
      
      {/* Profile and logout section */}
      <div className="p-2 mt-auto">
        <Separator className="mb-2" />
        {!collapsed && userEmail && (
          <div className="px-2 mb-2">
            <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
          </div>
        )}
        
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link to="/settings">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center px-0"
                )}
              >
                <Settings className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Settings</span>}
              </Button>
            </Link>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Settings</TooltipContent>}
        </Tooltip>
        
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link to="/profile">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center px-0"
                )}
              >
                <User className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Profile</span>}
              </Button>
            </Link>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Profile</TooltipContent>}
        </Tooltip>
        
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50",
                collapsed && "justify-center px-0"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Logout</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
        </Tooltip>
      </div>
    </div>
  );

  // Mobile sidebar (sheet) - Making it more responsive
  const MobileSidebar = (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild className="md:hidden absolute left-4 top-4 z-20">
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[260px]">
        <div className="flex h-16 items-center px-4 border-b">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-primary">RizzPay</h1>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4 px-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  {item.icon}
                  <span className="ml-3 text-sm">{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Profile and logout section for mobile */}
        <div className="p-2 mt-auto">
          <Separator className="mb-2" />
          {userEmail && (
            <div className="px-2 mb-2">
              <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
            </div>
          )}
          
          <Link to="/settings" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-5 w-5" />
              <span className="ml-3">Settings</span>
            </Button>
          </Link>
          
          <Link to="/profile" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <User className="h-5 w-5" />
              <span className="ml-3">Profile</span>
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </Button>
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
