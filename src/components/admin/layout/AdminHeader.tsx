
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, Menu, ChevronLeft, ChevronRight, EyeOff, Eye } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/use-media-query';
// Import admin logo using ES module!
import rizzpayAdminLogo from '@/assets/rizzpay-admin-logo.png';

export interface AdminHeaderProps {
  onLogout?: () => void;
  setMobileMenuOpen?: (open: boolean) => void;
  hideNavigation?: boolean;
  userEmail?: string;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  hiddenOnMobile?: boolean;
  setHiddenOnMobile?: (hidden: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onLogout,
  setMobileMenuOpen,
  hideNavigation = false,
  userEmail,
  collapsed,
  setCollapsed,
  hiddenOnMobile = false,
  setHiddenOnMobile
}) => {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/production-api')) return 'Production API Management';
    if (path.includes('/admin/api-management')) return 'API Management';
    if (path.includes('/admin/monitoring')) {
      if (path.includes('/admin/monitoring/')) {
        const dashboardType = path.split('/admin/monitoring/')[1];
        return `${dashboardType.charAt(0).toUpperCase() + dashboardType.slice(1)} Monitoring`;
      }
      return 'System Monitoring';
    }
    if (path.includes('/admin/escrow')) return 'Escrow Management';
    if (path.includes('/admin/settings')) return 'Admin Settings';
    if (path.includes('/admin/activity-log')) return 'Activity Log';
    if (path.includes('/admin/transactions-log')) return 'Transaction Log';
    if (path.includes('/admin/kyc')) return 'KYC Management';
    if (path.includes('/admin/merchants')) return 'Merchants Management';
    if (path.includes('/admin/transactions')) return 'Transactions';
    if (path.includes('/admin/upi-management')) return 'UPI Management';
    if (path.includes('/admin/whitelist')) return 'Access Control';
    if (path.includes('/admin/pricing')) return 'Pricing Management';
    if (path === '/admin' || path === '/admin/dashboard') return 'Admin Dashboard';
    return 'Admin Panel';
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const toggleMobileNavVisibility = () => {
    if (setHiddenOnMobile) {
      setHiddenOnMobile(!hiddenOnMobile);
    }
  };

  if (hideNavigation) {
    return null;
  }
  
  return (
    <header className="admin-header px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Admin Logo ES import */}
        <img
          src={rizzpayAdminLogo}
          alt="RizzPay Admin Logo"
          className="h-9 w-9 rounded bg-white shadow mr-3"
          style={{ objectFit: 'contain' }}
        />
        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex h-8 w-8 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          onClick={() => setCollapsed && setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        
        {/* Mobile controls */}
        <div className="lg:hidden flex items-center gap-2">
          {!hiddenOnMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => setMobileMenuOpen && setMobileMenuOpen(true)}
              title="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
            onClick={toggleMobileNavVisibility}
            title={hiddenOnMobile ? "Show navigation" : "Hide navigation"}
          >
            {hiddenOnMobile ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div>
          <h1 className="page-title text-xl font-semibold text-blue-600 truncate">{getPageTitle()}</h1>
          <p className="text-sm text-slate-600 hidden sm:block">Manage your platform from here</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative hidden sm:flex text-slate-500 hover:bg-blue-50 hover:text-blue-600">
          <Bell className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500"
          >
            3
          </Badge>
        </Button>
        
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-slate-800 truncate max-w-32">admin</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
              A
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className="text-slate-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
