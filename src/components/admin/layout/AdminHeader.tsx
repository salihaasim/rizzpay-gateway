
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Bell } from 'lucide-react';
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
  
  // Return an empty header when hideNavigation is true
  if (hideNavigation) {
    return null;
  }
  
  return (
    <header className="border-b border-border bg-white">
      {/* Header content */}
    </header>
  );
};

export default AdminHeader;
