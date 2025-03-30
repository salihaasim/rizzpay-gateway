import React, { useEffect, memo, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import { Toaster } from 'sonner';
import { useMerchantAuth } from './stores/merchantAuthStore';
import Layout from './components/Layout';
import PaymentPageLoading from './components/payment/PaymentPageLoading';

// Directly import WalletPage to avoid lazy loading issue
import WalletPage from './pages/WalletPage';
import TermsAndConditions from './pages/TermsAndConditions';

// Lazy load other components to improve initial load time
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Transactions = React.lazy(() => import('./pages/Transactions'));
const WebhookPage = React.lazy(() => import('./pages/WebhookPage'));
const WebhookSetup = React.lazy(() => import('./pages/WebhookSetup'));
const DeveloperIntegration = React.lazy(() => import('./pages/DeveloperIntegration'));
const Security = React.lazy(() => import('./pages/Security'));
const Settings = React.lazy(() => import('./pages/Settings'));
const WebhookPayment = React.lazy(() => import('./pages/WebhookPayment'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Auth = React.lazy(() => import('./pages/Auth'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

// Loading component - now using our enhanced payment loading animation
const PageLoading = () => <PaymentPageLoading />;

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
          <Route path="/terms" element={<TermsAndConditions />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/merchants" element={<AdminDashboard />} />
          <Route path="/admin/escrow" element={<AdminDashboard />} />
          <Route path="/admin/pricing" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
          <Route path="/admin/transactions" element={<AdminDashboard />} />
          
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
          
          {/* Webhook routes - ensuring Layout component is used */}
          <Route path="/webhook" element={
            <ProtectedRoute>
              <Layout><WebhookSetup /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/webhooks" element={
            <ProtectedRoute>
              <Layout><WebhookSetup /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/developers" element={
            <ProtectedRoute>
              <Layout><DeveloperIntegration /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/security" element={
            <ProtectedRoute>
              <Layout><Security /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Settings routes */}
          <Route path="/settings/*" element={
            <ProtectedRoute>
              <Layout><Settings /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout><Settings /></Layout>
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
