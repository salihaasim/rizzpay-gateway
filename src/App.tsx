
import React, { useEffect, memo, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import { Toaster } from 'sonner';
import { useMerchantAuth } from './stores/merchantAuthStore';
import { useTransactionStore } from './stores/transactionStore';
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
  const { isAuthenticated, loading, currentMerchant } = useMerchantAuth();
  const { userRole } = useTransactionStore();
  const [appReady, setAppReady] = useState(false);
  
  useEffect(() => {
    // Add domain check for proper initialization
    const hostname = window.location.hostname;
    console.log("Current hostname:", hostname);
    
    // Add any domain-specific initialization here
    document.title = hostname.includes("rizzpay.co.in") ? "Rizzpay - Official Payment Gateway" : "Rizzpay";
    
    setAppReady(true);
  }, []);

  if (!appReady && loading) {
    return <PageLoading />;
  }

  // Check if user is an admin directly from merchant auth
  const isAdmin = currentMerchant?.role === 'admin' || userRole === 'admin';

  return (
    <Router>
      <Toaster position="top-right" />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          
          {/* Admin routes - No Layout component since AdminLayout handles this */}
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/merchants" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/escrow" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/pricing" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/settings" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/analytics" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/transactions" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
          
          {/* Protected merchant routes with Layout - Redirect admin to admin dashboard */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              {isAdmin ? <Navigate to="/admin" replace /> : <Layout><Dashboard /></Layout>}
            </ProtectedRoute>
          } />
          
          <Route path="/transactions" element={
            <ProtectedRoute>
              {isAdmin ? <Navigate to="/admin" replace /> : <Layout><Transactions /></Layout>}
            </ProtectedRoute>
          } />
          <Route path="/wallet" element={
            <ProtectedRoute>
              {isAdmin ? <Navigate to="/admin" replace /> : <Layout><WalletPage /></Layout>}
            </ProtectedRoute>
          } />
          
          {/* Webhook routes - ensuring Layout component is used */}
          <Route path="/webhook" element={
            <ProtectedRoute>
              {isAdmin ? <Navigate to="/admin" replace /> : <Layout><WebhookSetup /></Layout>}
            </ProtectedRoute>
          } />
          <Route path="/webhooks" element={
            <ProtectedRoute>
              {isAdmin ? <Navigate to="/admin" replace /> : <Layout><WebhookSetup /></Layout>}
            </ProtectedRoute>
          } />
          
          <Route path="/developers" element={
            <ProtectedRoute>
              {isAdmin ? <Navigate to="/admin" replace /> : <Layout><DeveloperIntegration /></Layout>}
            </ProtectedRoute>
          } />
          <Route path="/security" element={
            <ProtectedRoute>
              {isAdmin ? <Navigate to="/admin" replace /> : <Layout><Security /></Layout>}
            </ProtectedRoute>
          } />
          
          {/* Settings routes */}
          <Route path="/settings/*" element={
            <ProtectedRoute>
              {isAdmin ? <Navigate to="/admin" replace /> : <Layout><Settings /></Layout>}
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              {isAdmin ? <Navigate to="/admin" replace /> : <Layout><Settings /></Layout>}
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
