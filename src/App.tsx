
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
import AasimoAI from './components/aasimo/AasimoAI';
import AdminMonitoring from './pages/AdminMonitoring';

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
const AdminSettings = React.lazy(() => import('./pages/AdminSettings'));
const AdminTransactionLog = React.lazy(() => import('./pages/AdminTransactionLog'));
const MerchantWhitelist = React.lazy(() => import('./pages/MerchantWhitelist'));
const MonitoringDashboard = React.lazy(() => import('./components/admin/monitoring/MonitoringDashboard'));

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

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={
            isAuthenticated ? 
              (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) : 
              <Auth />
          } />
          <Route path="/terms" element={<TermsAndConditions />} />
          
          {/* Special Aasimo AI route - not linked from admin or merchant interfaces */}
          <Route path="/aasimo-ai" element={<AasimoAI />} />
          
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/merchants" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/escrow" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/pricing" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/settings" element={isAdmin ? <AdminSettings /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/analytics" element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/transactions" element={isAdmin ? <AdminTransactionLog /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/whitelist" element={isAdmin ? <MerchantWhitelist /> : <Navigate to="/auth" replace />} />
          <Route path="/admin/monitoring" element={isAdmin ? <AdminMonitoring /> : <Navigate to="/auth" replace />} />
          
          {/* Individual monitoring dashboard routes */}
          <Route path="/admin/monitoring/:dashboardType" element={isAdmin ? <MonitoringDashboard /> : <Navigate to="/auth" replace />} />
          
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
          
          <Route path="/webhook-payment" element={<WebhookPayment />} />
          
          <Route path="/upi-payment" element={<UpiPaymentPage />} />
          <Route path="/payment/upi" element={<UpiPaymentPage />} />
          
          <Route path="*" element={<NotFound />} />
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
