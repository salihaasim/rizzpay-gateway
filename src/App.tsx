
import React, { useEffect, memo, lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useMerchantAuth } from './stores/merchantAuthStore';
import Layout from './components/Layout';
import PaymentPageLoading from './components/payment/PaymentPageLoading';
import { ThemeProvider } from './context/ThemeContext';

// Import non-lazy loaded components
import Index from './pages/Index';
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
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Lazy load components that aren't needed immediately
const Transactions = lazy(() => import('./pages/Transactions'));
const WebhookPage = lazy(() => import('./pages/WebhookPage'));
const WebhookSetup = lazy(() => import('./pages/WebhookSetup'));
const DeveloperIntegration = lazy(() => import('./pages/DeveloperIntegration'));
const Security = lazy(() => import('./pages/Security'));
const Settings = lazy(() => import('./pages/Settings'));
const WebhookPayment = lazy(() => import('./pages/WebhookPayment'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Auth = lazy(() => import('./pages/Auth'));

const PageLoading = memo(() => <PaymentPageLoading />);

const App = () => {
  const { isAuthenticated, loading, currentMerchant } = useMerchantAuth();
  const [appReady, setAppReady] = useState(false);
  
  useEffect(() => {
    const hostname = window.location.hostname;
    console.log("Current hostname:", hostname);
    
    // Performance optimization - set title just once
    document.title = hostname.includes("rizzpay.co.in") ? "Rizzpay - Official Payment Gateway" : "Rizzpay";
    
    // Optimize app startup
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  if (!appReady || loading) {
    return <PageLoading />;
  }

  // Use currentMerchant?.role instead of relying on transactionStore
  const isAdmin = currentMerchant?.role === 'admin';

  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-right" richColors />
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register-merchant" element={<RegisterMerchant />} />
            
            {/* Dashboard routes */}
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
            <Route path="/banking" element={<BankingPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/developer/integration" element={<DeveloperIntegration />} />
            <Route path="/merchant-onboarding" element={<MerchantOnboarding />} />
            <Route path="/whitelist" element={<MerchantWhitelist />} />
            
            {/* Policy pages */}
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/merchants" element={<AdminDashboard />} />
            <Route path="/admin/escrow" element={<AdminDashboard />} />
            <Route path="/admin/pricing" element={<AdminDashboard />} />
            <Route path="/admin/transactions" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
            <Route path="/admin/whitelist" element={<AdminDashboard />} />
            <Route path="/admin/monitoring" element={<AdminMonitoring />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default React.memo(App);
