import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTransactionStore } from '@/stores/transactions';

interface AdminSidebarProps {
  userEmail: string | null;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  handleLogout: () => void;
}

const AdminSidebar = ({
  userEmail,
  collapsed,
  setCollapsed,
  handleLogout
}: AdminSidebarProps) => {
  const location = useLocation();
  const { isAuthenticated } = useTransactionStore();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className={cn(
      "h-screen fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-20" : "w-[280px]"
    )}>
      <div className="flex h-16 items-center border-b px-4 justify-between">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-bold text-xl">RizzPay</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Admin</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/admin" className="flex items-center justify-center">
              <span className="font-bold text-xl">R</span>
            </Link>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex"
        >
          {collapsed ? (
            <span>→</span>
          ) : (
            <span>←</span>
          )}
        </Button>
      </div>

      <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
        <nav className="px-3 py-4">
          <ul className="space-y-1">
            <li>
              <Link
                to="/admin"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md",
                  isActive("/admin") && !isActive("/admin/transactions") && !isActive("/admin/merchants") && !isActive("/admin/kyc") && !isActive("/admin/whitelist") && !isActive("/admin/upi-management")
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-100"
                )}
              >
                <span className="mr-3">📊</span>
                {!collapsed && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/transactions"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md",
                  isActive("/admin/transactions")
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-100"
                )}
              >
                <span className="mr-3">💳</span>
                {!collapsed && <span>Transactions</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/merchants"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md",
                  isActive("/admin/merchants")
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-100"
                )}
              >
                <span className="mr-3">🏪</span>
                {!collapsed && <span>Merchants</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/kyc"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md",
                  isActive("/admin/kyc")
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-100"
                )}
              >
                <span className="mr-3">🔍</span>
                {!collapsed && <span>KYC Verification</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/whitelist"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md",
                  isActive("/admin/whitelist")
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-100"
                )}
              >
                <span className="mr-3">✅</span>
                {!collapsed && <span>Whitelist</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/admin/upi-management"
                className={cn(
                  "flex items-center px-3 py-2 rounded-md",
                  isActive("/admin/upi-management")
                    ? "bg-blue-50 text-blue-700"
                    : "hover:bg-gray-100"
                )}
              >
                <span className="mr-3">💸</span>
                {!collapsed && <span>UPI Management</span>}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-3 mt-auto border-t">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3">
              {userEmail ? userEmail.substring(0, 1).toUpperCase() : 'A'}
            </div>
            {!collapsed && (
              <div>
                <p className="font-medium text-sm">{userEmail || 'Admin'}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size={collapsed ? "icon" : "default"}
            className={cn("w-full justify-center", !collapsed && "justify-start")}
            onClick={handleLogout}
          >
            <span className="mr-2">🚪</span>
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
