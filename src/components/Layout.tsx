
import React, { memo, useEffect } from 'react';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Loader2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = memo(({ children }) => {
  const { isAuthenticated, loading, currentMerchant } = useMerchantAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Monitor authentication status for changes
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      // User logged out, redirect to home page
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

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

  // If not authenticated, redirect to auth page with current location for back navigation
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Display responsive layout for authenticated users
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="h-full">
          {children}
        </div>
      </main>
      <div className="py-4 text-center text-xs text-muted-foreground border-t">
        <p>© 2025 RizzPay Payment Technologies. All rights reserved.</p>
        <p className="mt-1">Version 1.0.0</p>
      </div>
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;
