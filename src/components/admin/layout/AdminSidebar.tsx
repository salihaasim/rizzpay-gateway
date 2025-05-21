
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CircleDollarSign,
  CreditCard,
  Shield,
  Activity,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  userEmail?: string;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  handleLogout?: () => void;
}

export function AdminSidebar({ userEmail, collapsed, setCollapsed, handleLogout }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      title: "Merchants",
      href: "/admin/merchants",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Escrow",
      href: "/admin/escrow",
      icon: <CircleDollarSign className="h-5 w-5" />
    },
    {
      title: "Pricing",
      href: "/admin/pricing",
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      title: "Whitelist",
      href: "/admin/whitelist",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "Monitoring",
      href: "/admin/monitoring",
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: "Transactions",
      href: "/admin/transactions",
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];
  
  return (
    <div className={cn(
      "h-screen bg-[#111827] flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-[240px]"
    )}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            {!collapsed && (
              <Link to="/admin" className="text-white font-bold text-xl ml-1">
                RizzPay
              </Link>
            )}
            {collapsed && (
              <Link to="/admin" className="text-white font-bold text-xl mx-auto">
                RP
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="px-2 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/admin' && location.pathname.startsWith(item.href));
                
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <div className={cn("flex items-center", collapsed ? "justify-center" : "")}>
                    {item.icon}
                    {!collapsed && <span className="ml-3">{item.title}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-gray-300 text-xs">
            {!collapsed && <span>rizzpay</span>}
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-300 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
