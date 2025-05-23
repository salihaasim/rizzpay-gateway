
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
  
  // Don't render header when we have sidebar navigation to avoid duplicates
  return null;
};

export default AdminHeader;
