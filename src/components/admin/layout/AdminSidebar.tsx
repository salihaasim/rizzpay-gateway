
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  FileCheck, 
  Banknote, 
  Smartphone, 
  Shield, 
  Activity, 
  FileText, 
  Database, 
  Settings,
  LogOut
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface NavItemProps {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  exactMatch: boolean;
}

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  userEmail: string;
  handleLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hiddenOnMobile: boolean;
  setHiddenOnMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  collapsed,
  setCollapsed,
  userEmail,
  handleLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
  hiddenOnMobile,
  setHiddenOnMobile
}) => {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    // Determine active item based on current path
    const currentPath = location.pathname;
    const matchingItem = sidebarItems.find(item => 
      item.exactMatch ? currentPath === item.path : currentPath.startsWith(item.path)
    );
    setActiveItem(matchingItem ? matchingItem.name : null);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const sidebarItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: LayoutDashboard,
      exactMatch: true
    },
    { 
      name: 'Merchants', 
      path: '/admin/merchants', 
      icon: Users,
      exactMatch: false
    },
    { 
      name: 'Transactions', 
      path: '/admin/transactions', 
      icon: CreditCard,
      exactMatch: false
    },
    { 
      name: 'KYC Management', 
      path: '/admin/kyc', 
      icon: FileCheck,
      exactMatch: false
    },
    { 
      name: 'Escrow Account', 
      path: '/admin/escrow', 
      icon: Banknote,
      exactMatch: false
    },
    { 
      name: 'UPI Management', 
      path: '/admin/upi-management', 
      icon: Smartphone,
      exactMatch: false
    },
    { 
      name: 'Whitelist', 
      path: '/admin/whitelist', 
      icon: Shield,
      exactMatch: false
    },
    { 
      name: 'Monitoring', 
      path: '/admin/monitoring', 
      icon: Activity,
      exactMatch: false
    },
    { 
      name: 'Activity Log', 
      path: '/admin/activity-log', 
      icon: FileText,
      exactMatch: false
    },
    { 
      name: 'Transaction Log', 
      path: '/admin/transactions-log', 
      icon: Database,
      exactMatch: false
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: Settings,
      exactMatch: false
    }
  ];

  return (
    <>
      {isMobile ? (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent 
            side="left" 
            className="w-64 bg-gray-800 border-r border-gray-700"
            onClick={closeMobileMenu}
          >
            <SheetHeader className="text-left">
              <SheetTitle className="text-white">Admin Menu</SheetTitle>
              <SheetDescription className="text-gray-300">
                Manage your Rizzpay platform
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <div className="flex items-center justify-center mb-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="Admin Avatar" />
                  <AvatarFallback className="bg-purple-600 text-white">AD</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <div className="font-medium text-white">{userEmail}</div>
                  <div className="text-sm text-gray-400">Administrator</div>
                </div>
              </div>
              <Separator className="mb-4 bg-gray-700" />
              <nav className="flex flex-col space-y-1">
                {sidebarItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-md
                      ${isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                    `}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </NavLink>
                ))}
                <Button 
                  variant="ghost" 
                  className="justify-start text-sm font-medium text-red-400 hover:bg-red-900 hover:text-red-300"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <aside className={`
          ${collapsed ? 'w-16' : 'w-64'}
          ${hiddenOnMobile ? 'hidden' : ''}
          flex flex-col h-full bg-gray-800 border-r border-gray-700 transition-width duration-300 ease-in-out`
        }>
          <div className="flex items-center justify-between py-3 px-4">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="Admin Avatar" />
                <AvatarFallback className="bg-purple-600 text-white">AD</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="ml-3">
                  <div className="font-medium text-white">{userEmail}</div>
                  <div className="text-sm text-gray-400">Administrator</div>
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-300 hover:text-white">
              {collapsed ? <Menu className="h-5 w-5" /> : <Menu className="h-5 w-5 rotate-180 transition-transform duration-300" />}
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto py-2 text-sm">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium rounded-md
                      ${isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                      ${collapsed ? 'justify-center' : ''}
                    `}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {!collapsed && <span>{item.name}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm font-medium text-red-400 hover:bg-red-900 hover:text-red-300"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>
      )}
    </>
  );
};

export default AdminSidebar;
