
import React from 'react';
import { Link } from 'react-router-dom';
import { SheetContent } from "@/components/ui/sheet";
import { 
  Users, 
  Wallet, 
  BarChart3, 
  Settings, 
  LogOut,
  FileText,
  Shield
} from 'lucide-react';
import logoSvg from '../../../assets/logo.svg';
import { Separator } from '@/components/ui/separator';

interface AdminMobileMenuProps {
  userEmail: string | null;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
  isActive: (path: string) => boolean;
}

const AdminMobileMenu: React.FC<AdminMobileMenuProps> = ({
  userEmail,
  mobileMenuOpen,
  setMobileMenuOpen,
  handleLogout,
  isActive
}) => {
  // Admin navigation links
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: BarChart3 },
    { name: 'Merchants', path: '/admin/merchants', icon: Users },
    { name: 'Escrow Account', path: '/admin/escrow', icon: Wallet },
    { name: 'Pricing', path: '/admin/pricing', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <SheetContent side="left" className="w-[280px] p-0">
      <div className="flex h-full flex-col">
        {/* Mobile menu header */}
        <div className="flex h-14 items-center border-b px-4">
          <Link 
            to="/admin" 
            className="flex items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src={logoSvg} alt="RizzPay Logo" className="h-6 w-6" />
            <span className="ml-2 font-bold text-xl">
              RizzPay <span className="text-coinbase">Admin</span>
            </span>
          </Link>
        </div>

        {/* Mobile menu content */}
        <div className="flex-1 overflow-auto py-4">
          <nav className="flex flex-col space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 rounded-md px-3 py-3 transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#9970e2]/10 text-[#9970e2]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${
                  isActive(item.path) ? 'text-[#9970e2]' : 'text-gray-500'
                }`} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu footer */}
        <div className="mt-auto border-t px-4 py-4">
          <div className="mb-2">
            <p className="text-xs font-medium text-gray-600">Logged in as</p>
            <p className="text-sm truncate">{userEmail || 'Admin'}</p>
          </div>
          <Separator className="my-2" />
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-rose-500 hover:bg-rose-50"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </SheetContent>
  );
};

export default AdminMobileMenu;
