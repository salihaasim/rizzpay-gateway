
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Smartphone,
  Activity,
  Shield,
  Users,
  FileText,
  Send,
  RefreshCw,
  List,
  HelpCircle,
  Database,
  Monitor,
  Key
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminSidebarNavigationProps {
  collapsed: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export function AdminSidebarNavigation({ collapsed, setMobileMenuOpen }: AdminSidebarNavigationProps) {
  const location = useLocation();
  
  const navigationItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Merchants', href: '/admin/merchants', icon: Users },
    { name: 'Transactions', href: '/admin/transactions', icon: CreditCard },
    { name: 'Transaction Log', href: '/admin/transaction-log', icon: FileText },
    { name: 'Payout Management', href: '/admin/payout-management', icon: Send },
    { name: 'Payment Recon', href: '/admin/payment-recon', icon: RefreshCw },
    { name: 'KYC Management', href: '/admin/kyc', icon: Shield },
    { name: 'Whitelist', href: '/admin/whitelist', icon: List },
    { name: 'Support', href: '/admin/support', icon: HelpCircle },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Activity Log', href: '/admin/activity-log', icon: Activity },
    { name: 'Monitoring', href: '/admin/monitoring', icon: Monitor },
    { name: 'API Management', href: '/admin/api-management', icon: Key },
    { name: 'Escrow', href: '/admin/escrow', icon: Database },
    { name: 'UPI Management', href: '/admin/upi-management', icon: Smartphone },
  ];
  
  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };
  
  return (
    <div className="flex-1 py-4 overflow-y-auto">
      <nav className="px-2 space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActiveRoute(item.href)
                ? "bg-primary/10 text-primary"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? item.name : undefined}
          >
            <item.icon className="h-4 w-4" />
            {!collapsed && <span className="truncate">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
