
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  User,
  UserPlus,
  ShoppingCart,
  CreditCard,
  Smartphone,
  FileText,
  Activity
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  userEmail?: string;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  handleLogout?: () => void;
}

export function AdminSidebar({ userEmail, collapsed, setCollapsed, handleLogout }: AdminSidebarProps) {
  const navigate = useNavigate();
  
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
      title: "Transaction Log",
      href: "/admin/transactions-log",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Activity Log",
      href: "/admin/activity-log",
      icon: <Activity className="h-5 w-5" />
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
      "flex h-screen bg-white border-r flex-col transition-all duration-300",
      collapsed ? "w-20" : "w-[280px]"
    )}>
      <div className="flex flex-col h-full gap-4 py-4 text-sm">
        <div className="px-3 py-2">
          <button
            onClick={() => navigate("/")}
            className="font-bold text-lg"
          >
            {collapsed ? "RP" : siteConfig.name}
          </button>
        </div>
        <div className="flex-1">
          <nav className="px-2">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
                  >
                    {item.icon}
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
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
                className="mt-2 w-full text-sm text-left px-2 py-1 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            )}
          </div>
        )}
        
        <div className="px-3 pt-2 border-t">
          <button 
            onClick={() => setCollapsed && setCollapsed(!collapsed)}
            className="w-full flex justify-center items-center p-2 rounded-md hover:bg-gray-100"
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
