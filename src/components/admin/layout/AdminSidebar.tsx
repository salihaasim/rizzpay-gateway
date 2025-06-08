
import React from "react";
import { cn } from "@/lib/utils";
import { AdminSidebarHeader } from "./AdminSidebarHeader";
import { AdminSidebarNavigation } from "./AdminSidebarNavigation";
import { AdminSidebarUserSection } from "./AdminSidebarUserSection";

interface AdminSidebarProps {
  userEmail?: string;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  handleLogout?: () => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  hiddenOnMobile?: boolean;
  setHiddenOnMobile?: (hidden: boolean) => void;
}

export function AdminSidebar({ 
  userEmail, 
  collapsed, 
  setCollapsed, 
  handleLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
  hiddenOnMobile = false,
  setHiddenOnMobile
}: AdminSidebarProps) {
  
  const handleOverlayClick = () => {
    if (setMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };
  
  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && !hiddenOnMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "flex h-screen bg-white border-r border-gray-200 flex-col transition-all duration-300 shadow-sm z-50",
        "fixed lg:static inset-y-0 left-0",
        collapsed ? "w-16" : "w-64",
        // Mobile responsiveness
        "lg:translate-x-0",
        // Mobile menu state - only show when not hidden on mobile
        hiddenOnMobile 
          ? "-translate-x-full lg:translate-x-0" 
          : mobileMenuOpen 
            ? "translate-x-0" 
            : "-translate-x-full lg:translate-x-0"
      )}>
        <AdminSidebarHeader 
          collapsed={collapsed || false} 
          setMobileMenuOpen={setMobileMenuOpen} 
        />
        
        <AdminSidebarNavigation 
          collapsed={collapsed || false} 
          setMobileMenuOpen={setMobileMenuOpen} 
        />
        
        <AdminSidebarUserSection 
          userEmail={userEmail} 
          collapsed={collapsed || false} 
          handleLogout={handleLogout} 
        />
      </div>
    </>
  );
}

export default AdminSidebar;
