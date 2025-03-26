
import React, { useEffect, memo, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import { Toaster } from 'sonner';
import { useAuth } from './stores/authStore';

// Lazy load components to improve initial load time
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Transactions = React.lazy(() => import('./pages/Transactions'));
const WalletPage = React.lazy(() => import('./pages/WalletPage'));
const WebhookPage = React.lazy(() => import('./pages/WebhookPage'));
const DeveloperIntegration = React.lazy(() => import('./pages/DeveloperIntegration'));
const PaymentPage = React.lazy(() => import('./pages/PaymentPage'));
const WebhookPayment = React.lazy(() => import('./pages/WebhookPayment'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Layout = React.lazy(() => import('./components/Layout'));
const Auth = React.lazy(() => import('./pages/Auth'));

// Loading component
const PageLoading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Optimized Protected route component
const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <PageLoading />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

function App() {
  const { checkAuth, loading } = useAuth();
  const [appReady, setAppReady] = useState(false);
  
  // Check authentication status on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setAppReady(true);
      }
    };
    
    initAuth();
  }, [checkAuth]);

  if (!appReady && loading) {
    return <PageLoading />;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Index page without Layout to avoid duplicate navbar */}
          <Route path="/" element={<Index />} />
          
          {/* Protected routes with Layout */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute>
              <Layout><Transactions /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/wallet" element={
            <ProtectedRoute>
              <Layout><WalletPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/webhook" element={
            <ProtectedRoute>
              <Layout><WebhookPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/developers" element={
            <ProtectedRoute>
              <Layout><DeveloperIntegration /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/payment" element={
            <ProtectedRoute>
              <Layout><PaymentPage /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Special pages */}
          <Route path="/webhook-payment" element={<WebhookPayment />} />
          
          {/* Auth page */}
          <Route path="/auth" element={<Auth />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
