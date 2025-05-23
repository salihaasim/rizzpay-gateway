
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import AdminSidebar from './layout/AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import { toast } from 'sonner';

export interface AdminLayoutProps {
  children?: React.ReactNode;
  hideNavigation?: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, hideNavigation }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentMerchant, logout } = useMerchantAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if user is admin, if not redirect to login
  useEffect(() => {
    if (!currentMerchant || currentMerchant.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/auth', { replace: true });
    }
  }, [currentMerchant, navigate]);
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/', { replace: true });
  };

  // If not admin, don't render anything
  if (!currentMerchant || currentMerchant.role !== 'admin') {
    return null;
  }
  
  // Use the hideNavigation prop passed from parent or default to false
  const shouldHideNavigation = hideNavigation || false;
  
  return (
    <div className="flex h-screen bg-gray-50">
      {!shouldHideNavigation && (
        <AdminSidebar 
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          userEmail={currentMerchant?.email || ''}
          handleLogout={handleLogout}
        />
      )}
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader 
          onLogout={handleLogout} 
          setMobileMenuOpen={setMobileMenuOpen} 
          hideNavigation={shouldHideNavigation}
          userEmail={currentMerchant?.email || ''}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
