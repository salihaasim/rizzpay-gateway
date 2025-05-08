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
import { default as AasimoAIComponent } from './components/aasimo/AasimoAI';
import KycPage from './pages/KycPage';
import UpiPluginSettings from './pages/UpiPluginSettings';
import UpiLinkPaymentPage from './pages/UpiLinkPaymentPage';
import ReportsPage from './pages/ReportsPage';
import TransfersPage from './pages/TransfersPage';
import RegisterMerchant from './pages/RegisterMerchant';
import BankingPage from './pages/BankingPage';
import DeveloperPage from './pages/DeveloperPage';
import MerchantOnboarding from './pages/MerchantOnboarding';

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
    { path: "/", element: <Index /> },
    { path: "/auth", element: <Auth /> },
    { path: "/register-merchant", element: <RegisterMerchant /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/transactions", element: <Transactions /> },
    { path: "/transfers", element: <TransfersPage /> },
    { path: "/wallet", element: <WalletPage /> },
    { path: "/payment", element: <UpiPaymentPage /> },
    { path: "/payment/:status", element: <UpiPaymentPage /> },
    { path: "/link-payment", element: <UpiLinkPaymentPage /> },
    { path: "/link-payment/:paymentId", element: <UpiLinkPaymentPage /> },
    { path: "/plugin", element: <UpiPluginSettings /> },
    { path: "/webhooks", element: <WebhookPage /> },
    { path: "/webhook-payment", element: <WebhookPayment /> },
    { path: "/webhook-setup", element: <WebhookSetup /> },
    { path: "/settings", element: <Settings /> },
    { path: "/kyc", element: <KycPage /> },
    { path: "/whitelist", element: <MerchantWhitelist /> },
    { path: "/banking", element: <BankingPage /> },
    { path: "/reports", element: <ReportsPage /> },
    { path: "/developer", element: <DeveloperPage /> },
    { path: "/developer/integration", element: <DeveloperIntegration /> },
    { path: "/merchant-onboarding", element: <MerchantOnboarding /> },
    { path: "*", element: <NotFound /> }
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
