
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTransactionStore } from '@/stores/transactions';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import AdminMobileMenuTrigger from './AdminMobileMenuTrigger';

export interface AdminHeaderProps {
  onLogout?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  const { userEmail } = useTransactionStore();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="border-b border-border">
      <div className="flex h-16 items-center px-4 md:px-6">
        <AdminMobileMenuTrigger />
        
        <div className="ml-auto flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="text-muted-foreground"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
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
