
import React, { useState } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  Banknote,
  Building,
  ArrowLeftRight,
  Smartphone,
  Webhook,
  FileCheck,
  Code,
  User,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from '@/hooks/use-media-query';

const DashboardSidebar = () => {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: CreditCard },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Payout', path: '/payout', icon: Banknote },
    { name: 'Banking', path: '/banking', icon: Building },
    { name: 'Transfers', path: '/transfers', icon: ArrowLeftRight },
    { name: 'UPI Plugin', path: '/upi-plugin', icon: Smartphone },
    { name: 'Webhooks', path: '/webhooks', icon: Webhook },
    { name: 'KYC', path: '/kyc', icon: FileCheck },
    { name: 'Developer', path: '/developer', icon: Code },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const renderSidebarItems = () => (
    <div className="flex flex-col space-y-2">
      {sidebarItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors
            ${isActive ? 'bg-purple-600 text-white' : ''}
          `}
        >
          <item.icon className="h-5 w-5 mr-2" />
          <span>{item.name}</span>
        </NavLink>
      ))}
    </div>
  );

  return (
    <aside className="bg-gray-800 w-64 flex-shrink-0 border-r border-gray-700 hidden md:block shadow-sm">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800">
        <div className="text-purple-400 text-sm font-semibold mb-4">
          Merchant Dashboard
        </div>
        {renderSidebarItems()}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
