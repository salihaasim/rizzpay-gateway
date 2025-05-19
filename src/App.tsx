
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

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register-merchant" element={<RegisterMerchant />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transfers" element={<TransfersPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/payment" element={<UpiPaymentPage />} />
          <Route path="/payment/:status" element={<UpiPaymentPage />} />
          <Route path="/link-payment" element={<UpiLinkPaymentPage />} />
          <Route path="/link-payment/:paymentId" element={<UpiLinkPaymentPage />} />
          <Route path="/plugin" element={<UpiPluginSettings />} />
          <Route path="/webhooks" element={<WebhookPage />} />
          <Route path="/webhook-payment" element={<WebhookPayment />} />
          <Route path="/webhook-setup" element={<WebhookSetup />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/kyc" element={<KycPage />} />
          <Route path="/whitelist" element={<MerchantWhitelist />} />
          <Route path="/banking" element={<BankingPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="/developer/integration" element={<DeveloperIntegration />} />
          <Route path="/merchant-onboarding" element={<MerchantOnboarding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
