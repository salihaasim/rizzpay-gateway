
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { toast } from 'sonner';
import { useMediaQuery } from '@/hooks/use-media-query';

export interface AdminLayoutProps {
  children?: React.ReactNode;
  hideNavigation?: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, hideNavigation = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentMerchant, logout } = useMerchantAuth();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hiddenOnMobile, setHiddenOnMobile] = useState(false);
  
  // Check if current page is a monitoring dashboard page
  const isMonitoringDashboard = location.pathname.startsWith('/admin/monitoring/') && 
                               location.pathname !== '/admin/monitoring';
  
  // Check if user is admin, if not redirect to login
  useEffect(() => {
    if (!currentMerchant || currentMerchant.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/auth', { replace: true });
    }
  }, [currentMerchant, navigate]);

  // Auto-hide mobile menu when route changes
  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname]);

  // Close mobile menu when clicking outside (handled by overlay in AdminSidebar)
  useEffect(() => {
    const handleResize = () => {
      if (!isMobile && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, mobileMenuOpen]);
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/', { replace: true });
  };

  // If not admin, don't render anything
  if (!currentMerchant || currentMerchant.role !== 'admin') {
    return null;
  }
  
  // For monitoring dashboard pages, hide navigation by default to prevent double headers
  const shouldHideNavigation = hideNavigation || isMonitoringDashboard;
  
  return (
    <div className="flex h-screen bg-gray-50 w-full overflow-hidden">
      {!shouldHideNavigation && (
        <AdminSidebar 
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          userEmail={currentMerchant?.email || ''}
          handleLogout={handleLogout}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          hiddenOnMobile={hiddenOnMobile}
          setHiddenOnMobile={setHiddenOnMobile}
        />
      )}
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {!shouldHideNavigation && (
          <AdminHeader 
            onLogout={handleLogout} 
            setMobileMenuOpen={setMobileMenuOpen} 
            hideNavigation={shouldHideNavigation}
            userEmail={currentMerchant?.email || ''}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            hiddenOnMobile={hiddenOnMobile}
            setHiddenOnMobile={setHiddenOnMobile}
          />
        )}
        
        <main className={`flex-1 overflow-auto bg-gray-50 ${shouldHideNavigation ? '' : 'p-4 md:p-6'}`}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
