
import React, { useEffect, memo, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import { Toaster } from 'sonner';
import { useMerchantAuth } from './stores/merchantAuthStore';
import { useTransactionStore } from './stores/transactionStore';
import Layout from './components/Layout';
import PaymentPageLoading from './components/payment/PaymentPageLoading';
import WalletPage from './pages/WalletPage';
import TermsAndConditions from './pages/TermsAndConditions';
import UpiPaymentPage from './pages/UpiPaymentPage';
import AdminMonitoring from './pages/AdminMonitoring';
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from './pages/AdminSettings';
import AdminTransactionLog from './pages/AdminTransactionLog';
import MerchantWhitelist from './pages/MerchantWhitelist';
import MonitoringDashboard from './components/admin/monitoring/MonitoringDashboard';
import HowItWorksTechnical from './pages/HowItWorksTechnical';
import Dashboard from './pages/Dashboard';
import Features from './pages/Features';
import Features2 from './pages/Features2';
import AdminAasimoAI from './pages/AdminAasimoAI';

const Transactions = React.lazy(() => import('./pages/Transactions'));
const WebhookPage = React.lazy(() => import('./pages/WebhookPage'));
const WebhookSetup = React.lazy(() => import('./pages/WebhookSetup'));
const DeveloperIntegration = React.lazy(() => import('./pages/DeveloperIntegration'));
const Security = React.lazy(() => import('./pages/Security'));
const Settings = React.lazy(() => import('./pages/Settings'));
const WebhookPayment = React.lazy(() => import('./pages/WebhookPayment'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Auth = React.lazy(() => import('./pages/Auth'));

const PageLoading = () => <PaymentPageLoading />;

const App = () => {
  const { isAuthenticated, loading, currentMerchant } = useMerchantAuth();
  const transactionStore = useTransactionStore();
  const { setUserRole } = transactionStore || {}; 
  const [appReady, setAppReady] = useState(false);
  
  useEffect(() => {
    const hostname = window.location.hostname;
    console.log("Current hostname:", hostname);
    
    document.title = hostname.includes("rizzpay.co.in") ? "Rizzpay - Official Payment Gateway" : "Rizzpay";
    
    if (isAuthenticated && currentMerchant && setUserRole) {
      const role = currentMerchant.role === 'admin' ? 'admin' : 'merchant';
      setUserRole(role, currentMerchant.username);
      console.log(`User role set to ${role} on app initialization`);
    }
    
    setAppReady(true);
  }, [isAuthenticated, currentMerchant, setUserRole]);

  useEffect(() => {
    if (isAuthenticated && currentMerchant && setUserRole && transactionStore) {
      const role = currentMerchant.role === 'admin' ? 'admin' : 'merchant';
      if (transactionStore.userRole !== role) {
        setUserRole(role, currentMerchant.username);
        console.log(`User role updated to ${role} after authentication change`);
      }
    }
  }, [isAuthenticated, currentMerchant, transactionStore, setUserRole]);

  if (!appReady || loading) {
    return <PageLoading />;
  }

  const isAdmin = currentMerchant?.role === 'admin' || (transactionStore && transactionStore.userRole === 'admin');

  const routes = [
    <Route key="index" path="/" element={<Index />} />,
    <Route key="auth" path="/auth" element={
      isAuthenticated ? 
        (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) : 
        <Auth />
    } />,
    <Route key="terms" path="/terms" element={<TermsAndConditions />} />,
    
    <Route key="aasimo" path="/aasimo-ai" element={<AasimoAI />} />,
    
    <Route key="admin" path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />,
    <Route key="admin-merchants" path="/admin/merchants" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />,
    <Route key="admin-escrow" path="/admin/escrow" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />,
    <Route key="admin-pricing" path="/admin/pricing" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />,
    <Route key="admin-settings" path="/admin/settings" element={isAdmin ? <AdminSettings /> : <Navigate to="/auth" replace />} />,
    <Route key="admin-analytics" path="/admin/analytics" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />,
    <Route key="admin-transactions" path="/admin/transactions" element={isAdmin ? <AdminTransactionLog /> : <Navigate to="/auth" replace />} />,
    <Route key="admin-whitelist" path="/admin/whitelist" element={isAdmin ? <MerchantWhitelist /> : <Navigate to="/auth" replace />} />,
    <Route key="admin-monitoring" path="/admin/monitoring" element={isAdmin ? <AdminMonitoring /> : <Navigate to="/auth" replace />} />,
    <Route key="admin-aasimo" path="/admin/aasimo" element={isAdmin ? <AdminAasimoAI /> : <Navigate to="/auth" replace />} />,
    
    <Route key="admin-monitoring-dashboard" path="/admin/monitoring/:dashboardType" element={isAdmin ? <MonitoringDashboard /> : <Navigate to="/auth" replace />} />,
    
    <Route key="dashboard" path="/dashboard/*" element={
      <ProtectedRoute>
        {isAdmin ? <Navigate to="/admin" replace /> : <Layout><Dashboard /></Layout>}
      </ProtectedRoute>
    } />,
    
    <Route key="transactions" path="/transactions" element={
      <ProtectedRoute>
        {isAdmin ? <Navigate to="/admin" replace /> : <Layout><Transactions /></Layout>}
      </ProtectedRoute>
    } />,
    <Route key="wallet" path="/wallet" element={
      <ProtectedRoute>
        {isAdmin ? <Navigate to="/admin" replace /> : <Layout><WalletPage /></Layout>}
      </ProtectedRoute>
    } />,
    
    <Route key="webhook" path="/webhook" element={
      <ProtectedRoute>
        {isAdmin ? <Navigate to="/admin" replace /> : <Layout><WebhookSetup /></Layout>}
      </ProtectedRoute>
    } />,
    <Route key="webhooks" path="/webhooks" element={
      <ProtectedRoute>
        {isAdmin ? <Navigate to="/admin" replace /> : <Layout><WebhookSetup /></Layout>}
      </ProtectedRoute>
    } />,
    
    <Route key="developers" path="/developers" element={
      <ProtectedRoute>
        {isAdmin ? <Navigate to="/admin" replace /> : <Layout><DeveloperIntegration /></Layout>}
      </ProtectedRoute>
    } />,
    <Route key="security" path="/security" element={
      <ProtectedRoute>
        {isAdmin ? <Navigate to="/admin" replace /> : <Layout><Security /></Layout>}
      </ProtectedRoute>
    } />,
    
    <Route key="settings-wild" path="/settings/*" element={
      <ProtectedRoute>
        {isAdmin ? <Navigate to="/admin" replace /> : <Layout><Settings /></Layout>}
      </ProtectedRoute>
    } />,
    <Route key="settings" path="/settings" element={
      <ProtectedRoute>
        {isAdmin ? <Navigate to="/admin" replace /> : <Layout><Settings /></Layout>}
      </ProtectedRoute>
    } />,
    
    <Route key="webhook-payment" path="/webhook-payment" element={<WebhookPayment />} />,
    
    <Route key="upi-payment" path="/upi-payment" element={<UpiPaymentPage />} />,
    <Route key="payment-upi" path="/payment/upi" element={<UpiPaymentPage />} />,
    
    <Route key="how-it-works-technical" path="/how-it-works-technical" element={
      <ProtectedRoute>
        <HowItWorksTechnical />
      </ProtectedRoute>
    } />,
    
    <Route key="features" path="/features" element={<Features />} />,
    <Route key="features2" path="/features2" element={<Features2 />} />,
    
    <Route key="not-found" path="*" element={<NotFound />} />
  ];

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {routes}
        </Routes>
      </Suspense>
    </Router>
  );
};

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
