
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  BarChart3,
  CreditCard,
  CircleDollarSign,
  Wallet,
  Globe,
  Settings,
  ChevronRight,
  ChevronLeft,
  QrCode,
  Shield,
  Link as LinkIcon,
  BanknoteIcon,
  IndianRupee,
  LogOut,
  IdCard
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { toast } from 'sonner';

interface DashboardSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const DashboardSidebar = ({ collapsed, setCollapsed }: DashboardSidebarProps) => {
  const { pathname } = useLocation();
  const { currentMerchant, logout } = useMerchantAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  
  // Only show sidebar toggle on desktop
  const showToggle = !isMobile;
  
  // Check if the user is an admin
  const isAdmin = currentMerchant?.role === 'admin';
  
  // Filter navigation items based on role
  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      title: "Wallet",
      href: "/wallet",
      icon: <Wallet className="h-5 w-5" />
    },
    {
      title: "Transfers",
      href: "/transfers",
      icon: <CircleDollarSign className="h-5 w-5" />
    },
    {
      title: "Banking",
      href: "/banking",
      icon: <BanknoteIcon className="h-5 w-5" />
    },
    {
      title: "KYC Verification",
      href: "/kyc",
      icon: <IdCard className="h-5 w-5" />
    },
    {
      title: "UPI Payment Link",
      href: "/link-payment",
      icon: <LinkIcon className="h-5 w-5" />
    },
    {
      title: "UPI Plugin",
      href: "/plugin",
      icon: <QrCode className="h-5 w-5" />
    },
    {
      title: "Developer",
      href: "/developer",
      icon: <Globe className="h-5 w-5" />
    },
    // Only show Whitelist for admin users
    ...(isAdmin ? [{
      title: "Whitelist",
      href: "/whitelist",
      icon: <Shield className="h-5 w-5" />
    }] : []),
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/', { replace: true });
  };

  return (
    <div
      className={cn(
        "flex flex-col fixed inset-y-0 z-50 h-full bg-[#111827] dark:bg-gray-900 text-white transition-all duration-300",
        collapsed ? "w-20" : "w-[280px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-800 dark:border-gray-700">
        <Link to="/dashboard" className="flex items-center space-x-3">
          {!collapsed && (
            <>
              <CircleDollarSign className="h-6 w-6 text-[#0052FF]" />
              <span className="font-bold text-lg text-white">RizzPay</span>
            </>
          )}
          {collapsed && <CircleDollarSign className="h-6 w-6 mx-auto text-[#0052FF]" />}
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
            >
              {item.icon}
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto border-t border-gray-800 dark:border-gray-700 p-4">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-3")}>
          <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
            {currentMerchant?.fullName ? (
              <span className="text-sm font-medium">
                {currentMerchant.fullName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="text-sm font-medium">M</span>
            )}
          </div>
          {!collapsed && (
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none truncate max-w-[180px]">
                {currentMerchant?.fullName || "Merchant"}
              </p>
              <p className="text-xs leading-none text-gray-400 truncate max-w-[180px]">
                {currentMerchant?.email || "merchant@example.com"}
              </p>
            </div>
          )}
        </div>
        
        {/* Logout Button */}
        <Button 
          variant="ghost" 
          className={cn(
            "w-full mt-4 text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700",
            collapsed ? "justify-center px-0" : "justify-start"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
