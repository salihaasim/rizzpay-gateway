
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTransactionStore } from '@/stores/transactionStore';
import AdminSidebar from './layout/AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import AdminMobileMenu from './layout/AdminMobileMenu';

export interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { userRole, userEmail, resetUserRole } = useTransactionStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Check if user is admin, if not redirect to home page
  React.useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [userRole, navigate]);
  
  const handleLogout = () => {
    resetUserRole();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/', { replace: true });
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex flex-col flex-1">
        <AdminHeader 
          onLogout={handleLogout} 
          setMobileMenuOpen={setMobileMenuOpen}
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children || <Outlet />}
        </main>
      </div>
      
      <AdminMobileMenu 
        userEmail={userEmail}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleLogout={handleLogout}
        isActive={isActive}
      />
    </div>
  );
};

export default AdminLayout;
