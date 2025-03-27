
import React, { memo } from 'react';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = memo(({ children }) => {
  const { isAuthenticated, loading } = useMerchantAuth();

  // Show loading indicator if authentication is still being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;
