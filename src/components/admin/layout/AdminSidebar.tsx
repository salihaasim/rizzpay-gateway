
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Wallet, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  ShieldCheck
} from 'lucide-react';
import logoSvg from '../../../assets/logo.svg';

interface SidebarProps {
  userEmail: string | null;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  handleLogout: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ 
  userEmail, 
  collapsed, 
  setCollapsed,
  handleLogout
}) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: BarChart3 },
    { name: 'Merchants', path: '/admin/merchants', icon: Users },
    { name: 'Escrow Account', path: '/admin/escrow', icon: Wallet },
    { name: 'Pricing', path: '/admin/pricing', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 flex-shrink-0 overflow-hidden border-r border-gray-100 bg-white ${
        collapsed ? 'w-20' : 'w-[280px]'
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar header */}
        <div className={`flex h-14 items-center border-b px-4`}>
          <Link to="/admin" className="flex items-center">
            <img src={logoSvg} alt="RizzPay Logo" className="h-6 w-6" />
            {!collapsed && (
              <span className="ml-2 font-bold text-xl">
                RizzPay <span className="text-coinbase">Admin</span>
              </span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto h-8 w-8 rounded-md hover:bg-gray-100 flex items-center justify-center"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-auto py-2">
          <nav className="flex flex-col space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 rounded-md px-3 py-2 transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#9970e2]/10 text-[#9970e2]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${
                  isActive(item.path) ? 'text-[#9970e2]' : 'text-gray-500'
                }`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="mt-auto border-t px-3 py-3">
          <div className={`flex items-center px-2 ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-600">Logged in as</span>
                <span className="text-sm truncate">{userEmail || 'Admin'}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`flex items-center space-x-2 rounded-md p-2 text-rose-500 hover:bg-rose-50 ${
                collapsed ? 'w-10 h-10 justify-center' : ''
              }`}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
