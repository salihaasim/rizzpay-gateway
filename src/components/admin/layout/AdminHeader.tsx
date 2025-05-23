
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';

export interface AdminHeaderProps {
  onLogout?: () => void;
  setMobileMenuOpen?: (open: boolean) => void;
  hideNavigation?: boolean;
  userEmail?: string;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onLogout,
  setMobileMenuOpen,
  hideNavigation = false,
  userEmail,
  collapsed,
  setCollapsed
}) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/settings')) return 'Admin Settings';
    if (path.includes('/admin/activity-log')) return 'Activity Log';
    if (path.includes('/admin/transactions-log')) return 'Transaction Log';
    if (path.includes('/admin/kyc')) return 'KYC Management';
    if (path.includes('/admin/merchants')) return 'Merchants Management';
    if (path.includes('/admin/transactions')) return 'Transactions';
    if (path.includes('/admin/upi-management')) return 'UPI Management';
    if (path.includes('/admin/whitelist')) return 'Access Control';
    if (path === '/admin') return 'Admin Dashboard';
    return 'Admin Panel';
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };
  
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {!hideNavigation && (
          <>
            {/* Desktop sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8"
              onClick={() => setCollapsed && setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={() => setMobileMenuOpen && setMobileMenuOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </>
        )}
        
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
          <p className="text-sm text-gray-500">Manage your platform from here</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </Button>
        
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900">
              {userEmail?.split('@')[0] || 'Admin'}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-white text-sm">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
