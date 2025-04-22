
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTransactionStore } from '@/stores/transactionStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Sheet } from '@/components/ui/sheet';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

// Import refactored components
import AdminSidebar from './layout/AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import AdminMobileMenu from './layout/AdminMobileMenu';
import AdminMobileMenuTrigger from './layout/AdminMobileMenuTrigger';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userRole, userEmail, resetUserRole } = useTransactionStore();
  const { logout: merchantLogout } = useMerchantAuth();
  
  // Redirect if not admin
  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/dashboard');
    }
  }, [userRole, navigate]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    resetUserRole();
    merchantLogout(); // Ensure we also log out from merchant auth
    toast.success('Logged out successfully');
    navigate('/', { replace: true }); // Redirect to home page
  };

  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Desktop sidebar with improved responsiveness */}
      <AdminSidebar 
        userEmail={userEmail} 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        handleLogout={handleLogout}
      />

      {/* Mobile-optimized main content */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <main className={cn(
          "flex-1 min-h-screen transition-all duration-300",
          collapsed ? "lg:ml-20" : "lg:ml-[280px]",
          "px-2 sm:px-4 md:px-6" // Improved responsive padding
        )}>
          <AdminHeader 
            userEmail={userEmail} 
            handleLogout={handleLogout} 
          />
          
          <div className="p-2 sm:p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
        
        <AdminMobileMenuTrigger setMobileMenuOpen={setMobileMenuOpen} />
        
        <AdminMobileMenu 
          userEmail={userEmail}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          handleLogout={handleLogout}
          isActive={isActive}
        />
      </Sheet>
    </div>
  );
};

export default AdminLayout;
