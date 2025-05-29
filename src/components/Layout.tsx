
import React, { memo, useEffect, useState } from 'react';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useMediaQuery, mediaQueries } from '@/hooks/use-media-query';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface LayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

const Layout: React.FC<LayoutProps> = memo(({ children, hideNavigation = false }) => {
  const { isAuthenticated, loading, currentMerchant } = useMerchantAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(mediaQueries.isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  
  // Show loading indicator if authentication is still being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
          <p className="text-gray-300">Loading your account...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to auth page instead of home
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Update sidebar state when mobile status changes
  useEffect(() => {
    setSidebarCollapsed(isMobile);
  }, [isMobile]);

  // Display responsive layout for authenticated merchants with dark theme styling
  return (
    <div className="min-h-screen flex bg-gray-900 transition-colors duration-200">
      {!hideNavigation && (
        <DashboardSidebar />
      )}
      
      <div className={`flex-1 min-h-screen transition-all duration-300 ${
        !hideNavigation ? (sidebarCollapsed ? "md:ml-20" : "md:ml-[280px]") : ""
      }`}>
        <main className="p-4 sm:p-6 bg-gray-100">
          <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          {children}
        </main>
        
        <footer className="py-3 text-center text-xs text-gray-400 border-t border-gray-700 bg-gray-900">
          <div className="max-w-screen-2xl mx-auto px-4">
            <p>© 2025 RizzPay Payment Technologies. All rights reserved.</p>
            <p className="mt-1">Version 1.0.0</p>
          </div>
        </footer>
      </div>
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;
