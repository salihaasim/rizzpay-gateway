
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTransactionStore } from '@/stores/transactionStore';
import { LogOut } from 'lucide-react';
import AdminMobileMenuTrigger from './AdminMobileMenuTrigger';

export interface AdminHeaderProps {
  onLogout?: () => void;
  setMobileMenuOpen?: (open: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout, setMobileMenuOpen }) => {
  const { userEmail } = useTransactionStore();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="border-b border-border">
      <div className="flex h-16 items-center px-4 md:px-6">
        <AdminMobileMenuTrigger setMobileMenuOpen={setMobileMenuOpen || (() => {})} />
        
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1">
            <span className="text-sm text-muted-foreground">Logged in as:</span>
            <span className="text-sm font-medium">{userEmail}</span>
          </div>
          
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
