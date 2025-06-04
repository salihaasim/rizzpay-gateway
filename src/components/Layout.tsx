
import React, { memo, useEffect, useState } from 'react';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Menu } from 'lucide-react';
import DashboardSidebar from '@/rizzpay-stable-ui/merchant/components/DashboardSidebar';
import { useMediaQuery, mediaQueries } from '@/hooks/use-media-query';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Show loading indicator if authentication is still being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your account...</p>
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
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Display responsive layout for authenticated users with sidebar
  return (
    <div className="min-h-screen flex bg-[#f5f5f7] transition-colors duration-200">
      {!hideNavigation && (
        <>
          {/* Mobile Menu Button - Fixed positioned for easy access */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-[60] bg-white/90 backdrop-blur-sm border border-border/40 shadow-sm md:hidden"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          {/* Sidebar with mobile overlay */}
          <div className={`${isMobile ? 'fixed inset-0 z-50' : ''} ${isMobile && !mobileMenuOpen ? 'hidden' : ''}`}>
            {/* Mobile overlay */}
            {isMobile && mobileMenuOpen && (
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}
            
            <DashboardSidebar 
              collapsed={isMobile ? false : sidebarCollapsed} 
              setCollapsed={setSidebarCollapsed} 
            />
          </div>
        </>
      )}
      
      <div className={`flex-1 min-h-screen transition-all duration-300 ${
        !hideNavigation ? (
          isMobile ? "ml-0" : (sidebarCollapsed ? "md:ml-20" : "md:ml-[280px]")
        ) : ""
      }`}>
        <main className={`p-4 sm:p-6 ${isMobile ? 'pt-16' : ''}`}>
          <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          {children}
        </main>
        
        <footer className="py-3 text-center text-xs text-muted-foreground border-t">
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
