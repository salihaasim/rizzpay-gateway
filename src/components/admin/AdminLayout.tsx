
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import AdminSidebar from './layout/AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import { toast } from 'sonner';
import { useMediaQuery } from '@/hooks/use-media-query';
import '@/styles/admin-theme.css';

export interface AdminLayoutProps {
  children?: React.ReactNode;
  hideNavigation?: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, hideNavigation = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentMerchant, logout, isAuthenticated } = useMerchantAuth();
  const isMobile = useMediaQuery('(max-width: 1024px)');
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hiddenOnMobile, setHiddenOnMobile] = useState(false);
  
  useEffect(() => {
    console.log('AdminLayout - Auth check:', { isAuthenticated, currentMerchant });
    
    if (!isAuthenticated || !currentMerchant) {
      console.log('Not authenticated, redirecting to auth');
      toast.error('Please login to access admin panel');
      navigate('/auth', { replace: true });
      return;
    }
    
    if (currentMerchant.role !== 'admin') {
      console.log('Not admin role, redirecting');
      toast.error('Access denied. Admin privileges required.');
      navigate('/auth', { replace: true });
      return;
    }
    
    console.log('Admin access granted');
  }, [isAuthenticated, currentMerchant, navigate]);

  useEffect(() => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname]);

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

  if (!isAuthenticated || !currentMerchant || currentMerchant.role !== 'admin') {
    return null;
  }
  
  return (
    <div className="admin-theme flex h-screen w-full overflow-hidden">
      {!hideNavigation && (
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
        {!hideNavigation && (
          <AdminHeader 
            onLogout={handleLogout} 
            setMobileMenuOpen={setMobileMenuOpen} 
            hideNavigation={hideNavigation}
            userEmail={currentMerchant?.email || ''}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            hiddenOnMobile={hiddenOnMobile}
            setHiddenOnMobile={setHiddenOnMobile}
          />
        )}
        
        <main className={`flex-1 overflow-auto admin-main-content ${hideNavigation ? '' : 'p-4 md:p-6'}`}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
