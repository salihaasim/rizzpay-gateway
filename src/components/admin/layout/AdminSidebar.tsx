import React from "react";
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
import { useTransactionStore } from "@/stores/transactionStore";
import { useNavigate } from "react-router-dom";

interface Props {
  items?: MainNavItem[]
}

export function AdminSidebar({ items }: Props) {
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
      href: "/transactions",
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
      title: "Pricing",
      href: "/admin/pricing",
      icon: <CircleDollarSign className="h-5 w-5" />
    },
    {
      title: "Coupons",
      href: "/admin/coupons",
      icon: <Percent className="h-5 w-5" />
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];
  
  return (
    <div className="flex flex-col h-full gap-4 py-4 text-sm">
      <div className="px-3 py-2 text-center">
        <button
          onClick={() => navigate("/")}
          className="font-bold text-lg"
        >
          {siteConfig.name}
        </button>
      </div>
      <div className="flex-1">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                {item.icon}
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
