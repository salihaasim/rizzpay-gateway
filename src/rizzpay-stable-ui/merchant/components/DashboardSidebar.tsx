
import React, { useState } from 'react';
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
  ChevronDown,
  ChevronUp,
  QrCode,
  Shield,
  Link as LinkIcon,
  BanknoteIcon,
  IndianRupee,
  LogOut,
  IdCard,
  ArrowUpRight,
  Code,
  Send
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
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  
  const showToggle = !isMobile;
  const isAdmin = currentMerchant?.role === 'admin';
  
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
      icon: <Wallet className="h-5 w-5" />,
      hasDropdown: true,
      dropdownItems: [
        {
          title: "Wallet Overview",
          href: "/wallet",
          icon: <Wallet className="h-4 w-4" />
        },
        {
          title: "Advanced Payout",
          href: "/advanced-payout",
          icon: <ArrowUpRight className="h-4 w-4" />
        }
      ]
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
      icon: <Code className="h-5 w-5" />
    },
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

  const handleWalletDropdownToggle = () => {
    if (!collapsed) {
      setWalletDropdownOpen(!walletDropdownOpen);
    }
  };

  const isWalletActive = pathname === '/wallet' || pathname === '/advanced-payout';

  return (
    <div
      className={cn(
        "merchant-sidebar flex flex-col fixed inset-y-0 z-50 h-full text-white transition-all duration-300",
        collapsed ? "w-20" : "w-[280px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-blue-400/20">
        <Link to="/dashboard" className="flex items-center space-x-3">
          {!collapsed && (
            <>
              <CircleDollarSign className="h-6 w-6 text-blue-400" />
              <span className="font-bold text-lg text-white">RizzPay</span>
            </>
          )}
          {collapsed && <CircleDollarSign className="h-6 w-6 mx-auto text-blue-400" />}
        </Link>
        {showToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8 text-blue-300 hover:bg-blue-800/50"
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
            <div key={index}>
              {item.hasDropdown ? (
                <div>
                  <div
                    onClick={handleWalletDropdownToggle}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-blue-200 transition-all hover:text-white hover:bg-blue-800/50 cursor-pointer",
                      isWalletActive && "bg-blue-700/50 text-white"
                    )}
                  >
                    {item.icon}
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {walletDropdownOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </div>
                  
                  {!collapsed && walletDropdownOpen && item.dropdownItems && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          to={dropdownItem.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-blue-300 transition-all hover:text-white hover:bg-blue-800/50",
                            pathname === dropdownItem.href && "bg-blue-700/50 text-white"
                          )}
                        >
                          {dropdownItem.icon}
                          <span>{dropdownItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-blue-200 transition-all hover:text-white hover:bg-blue-800/50",
                    pathname === item.href && "bg-blue-700/50 text-white"
                  )}
                >
                  {item.icon}
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto border-t border-blue-400/20 p-4">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "space-x-3")}>
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            {currentMerchant?.fullName ? (
              <span className="text-sm font-medium text-white">
                {currentMerchant.fullName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="text-sm font-medium text-white">M</span>
            )}
          </div>
          {!collapsed && (
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none truncate max-w-[180px] text-white">
                {currentMerchant?.fullName || "Merchant"}
              </p>
              <p className="text-xs leading-none text-blue-300 truncate max-w-[180px]">
                {currentMerchant?.email || "merchant@example.com"}
              </p>
            </div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          className={cn(
            "w-full mt-4 text-blue-200 hover:text-white hover:bg-blue-800/50",
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
