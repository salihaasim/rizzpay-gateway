
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, Activity } from 'lucide-react';
import AdminMobileMenuTrigger from './AdminMobileMenuTrigger';

export interface AdminHeaderProps {
  onLogout?: () => void;
  setMobileMenuOpen?: (open: boolean) => void;
  hideNavigation?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onLogout, 
  setMobileMenuOpen,
  hideNavigation = false 
}) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="border-b border-border bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        {!hideNavigation && (
          <AdminMobileMenuTrigger setMobileMenuOpen={setMobileMenuOpen || (() => {})} />
        )}
        
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="ml-2"
          >
            <LogOut className="mr-1 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
