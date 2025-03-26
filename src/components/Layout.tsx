
import React, { memo, useEffect } from 'react';
import Navbar from './Navbar';
import { useAuth } from '@/stores/authStore';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = memo(({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // If still loading or not authenticated, we let App's ProtectedRoute handle the redirect
  if (loading || !isAuthenticated) {
    return null;
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
