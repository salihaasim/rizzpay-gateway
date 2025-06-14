
import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AdminSidebarHeader } from './AdminSidebarHeader';
import { AdminSidebarNavigation } from './AdminSidebarNavigation';
import { AdminSidebarUserSection } from './AdminSidebarUserSection';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  userEmail: string;
  handleLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  hiddenOnMobile: boolean;
  setHiddenOnMobile: (hidden: boolean) => void;
}

const AdminSidebar = ({
  collapsed,
  setCollapsed,
  userEmail,
  handleLogout,
  mobileMenuOpen,
  setMobileMenuOpen,
  hiddenOnMobile
}: AdminSidebarProps) => {
  // sidebarClasses reflect the old logic, adapt for mobile/desktop
  const sidebarClasses = cn(
    "admin-sidebar flex flex-col h-full transition-all duration-300",
    mobileMenuOpen ? "fixed inset-y-0 left-0 z-50 w-[280px]" : (collapsed ? "w-20" : "w-[280px]"),
    hiddenOnMobile && "hidden"
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={sidebarClasses}>
        <AdminSidebarHeader collapsed={collapsed} setMobileMenuOpen={setMobileMenuOpen} />
        <ScrollArea className="flex-1">
          <AdminSidebarNavigation collapsed={collapsed} setMobileMenuOpen={setMobileMenuOpen} />
        </ScrollArea>
        <AdminSidebarUserSection userEmail={userEmail} collapsed={collapsed} handleLogout={handleLogout} />
      </div>
    </>
  );
};

export default AdminSidebar;
