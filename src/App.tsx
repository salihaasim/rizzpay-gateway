
import React, { useEffect, memo, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import { Toaster } from 'sonner';
import { useMerchantAuth } from './stores/merchantAuthStore';
import Layout from './components/Layout';

// Directly import WalletPage to avoid lazy loading issue
import WalletPage from './pages/WalletPage';

// Lazy load other components to improve initial load time
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Transactions = React.lazy(() => import('./pages/Transactions'));
const WebhookPage = React.lazy(() => import('./pages/WebhookPage'));
const DeveloperIntegration = React.lazy(() => import('./pages/DeveloperIntegration'));
const PaymentPage = React.lazy(() => import('./pages/PaymentPage'));
const WebhookPayment = React.lazy(() => import('./pages/WebhookPayment'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
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

const App = () => {
  const { isAuthenticated, loading } = useMerchantAuth();
  const [appReady, setAppReady] = useState(false);
  
  useEffect(() => {
    setAppReady(true);
  }, []);

  if (!appReady && loading) {
    return <PageLoading />;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
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
          {/* Directly use WalletPage instead of lazy loading it */}
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
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

// Update ProtectedRoute to use merchant auth
const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useMerchantAuth();
  
  if (loading) {
    return <PageLoading />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default App;
