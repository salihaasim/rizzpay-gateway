
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminMobileMenuTrigger from './AdminMobileMenuTrigger';

export interface AdminHeaderProps {
  onLogout?: () => void;
  setMobileMenuOpen?: (open: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout, setMobileMenuOpen }) => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <AdminMobileMenuTrigger setMobileMenuOpen={setMobileMenuOpen || (() => {})} />
        
        <div className="flex-1 flex items-center">
          <span className="text-sm font-medium text-gray-500">Admin</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/merchants" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
            >
              <User className="h-4 w-4 mr-1" />
              Manage Merchants
            </Link>
            
            <Link 
              to="/admin/escrow" 
              className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
            >
              Escrow
            </Link>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </Button>
          
          <Button 
            variant="ghost"
            size="icon"
            className="rounded-full bg-blue-600 text-white hover:bg-blue-700"
          >
            <span className="text-sm font-bold">RI</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
