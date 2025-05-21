
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import AdminSidebar from './layout/AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import { toast } from 'sonner';

export interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { currentMerchant, logout } = useMerchantAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Check if user is admin, if not redirect to login
  useEffect(() => {
    if (!currentMerchant || currentMerchant.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/auth', { replace: true });
    }
  }, [currentMerchant, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // If not admin, don't render anything
  if (!currentMerchant || currentMerchant.role !== 'admin') {
    return null;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        userEmail={currentMerchant?.email || ''}
        handleLogout={handleLogout}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader onLogout={handleLogout} />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
