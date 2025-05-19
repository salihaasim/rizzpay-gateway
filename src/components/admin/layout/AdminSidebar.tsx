
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Settings,
  User,
  UserPlus,
  ShoppingCart,
  CreditCard,
  CircleDollarSign,
  Percent,
  Smartphone
} from "lucide-react";

import { MainNavItem } from "@/types";
import { siteConfig } from "@/config/site";
import { useTransactionStore } from "@/stores/transactions";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  userEmail?: string;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  handleLogout?: () => void;
}

export function AdminSidebar({ userEmail, collapsed, setCollapsed, handleLogout }: AdminSidebarProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useTransactionStore();
  
  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      title: "Transactions",
      href: "/admin/transactions",
      icon: <ShoppingCart className="h-5 w-5" />
    },
    {
      title: "UPI Management",
      href: "/admin/upi-management",
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      title: "Merchants",
      href: "/admin/merchants",
      icon: <UserPlus className="h-5 w-5" />
    },
    {
      title: "KYC",
      href: "/admin/kyc",
      icon: <User className="h-5 w-5" />
    },
    {
      title: "Whitelist",
      href: "/admin/whitelist",
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];
  
  return (
    <div className={cn(
      "hidden lg:flex h-screen bg-white dark:bg-gray-950 border-r flex-col transition-all duration-300",
      collapsed ? "w-20" : "w-[280px]"
    )}>
      <div className="flex flex-col h-full gap-4 py-4 text-sm">
        <div className="px-3 py-2 text-center">
          <button
            onClick={() => navigate("/")}
            className="font-bold text-lg"
          >
            {collapsed ? "RP" : siteConfig.name}
          </button>
        </div>
        <div className="flex-1">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  {item.icon}
                  {!collapsed && item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {!collapsed && userEmail && (
          <div className="mt-auto px-3 py-2 border-t">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{userEmail}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            {handleLogout && (
              <button 
                onClick={handleLogout}
                className="mt-2 w-full text-sm text-left px-2 py-1 hover:bg-secondary rounded-md"
              >
                Logout
              </button>
            )}
          </div>
        )}
        
        <div className="px-3 pt-2 border-t">
          <button 
            onClick={() => setCollapsed && setCollapsed(!collapsed)}
            className="w-full flex justify-center items-center p-2 rounded-md hover:bg-secondary"
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
