import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';
import { trackPageView } from '@/utils/analytics';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import BankingPage from './pages/BankingPage';
import Webhooks from './pages/Webhooks';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminMerchants from './pages/admin/AdminMerchants';
import AdminKYC from './pages/admin/AdminKYC';
import AdminWhitelist from './pages/admin/AdminWhitelist';
import AdminLayout from './components/admin/AdminLayout';
import UpiPaymentPage from './pages/UpiPaymentPage';
import WalletPage from './pages/WalletPage';
import PayoutPage from './pages/PayoutPage';
import AdminUpiManagement from './pages/AdminUpiManagement';
import IndiaPage from './pages/IndiaPage';
import RefundPolicy from './pages/RefundPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ContactUs from './pages/ContactUs';
import GlobalFooter from './components/GlobalFooter';
import Settings from './pages/Settings';
import UpiLinkPaymentPage from './pages/UpiLinkPaymentPage';
import UpiPluginPage from './pages/UpiPluginPage';
import TransfersPage from './pages/TransfersPage';
import DeveloperPage from './pages/DeveloperPage';
import AdminSettings from './pages/AdminSettings';
import AdminTransactionLog from './pages/AdminTransactionLog';
import AdminActivityLog from './pages/AdminActivityLog';
import AdminMonitoring from './pages/AdminMonitoring';
import MonitoringDashboard from './components/admin/monitoring/MonitoringDashboard';
import KycPage from './pages/KycPage';
import Auth from './pages/Auth';
import AdminEscrow from './pages/AdminEscrow';

// Analytics wrapper component
const AnalyticsWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname + location.search);
  }, [location]);

  return <>{children}</>;
};

// Layout for pages that should have the footer (only home page)
const HomePageLayout = () => (
  <div className="min-h-screen flex flex-col">
    <div className="flex-grow">
      <Outlet />
    </div>
    <GlobalFooter />
  </div>
);

// Layout for pages without footer
const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <div className="flex-grow">
      <Outlet />
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <AnalyticsWrapper>
        <Routes>
          {/* Home page route with footer - ALWAYS ACCESSIBLE */}
          <Route element={<HomePageLayout />}>
            <Route path="/" element={<Index />} />
          </Route>
          
          {/* Auth route - accessible for login/signup */}
          <Route element={<PublicLayout />}>
            <Route path="/auth" element={<Auth />} />
          </Route>
          
          {/* Public pages without authentication */}
          <Route element={<PublicLayout />}>
            <Route path="/upi-payment" element={<UpiPaymentPage />} />
            <Route path="/upi-link-payment" element={<UpiLinkPaymentPage />} />
            <Route path="/link-payment" element={<Navigate to="/upi-link-payment" />} />
            <Route path="/india" element={<IndiaPage />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/contact" element={<ContactUs />} />
          </Route>
          
          {/* Merchant routes - directly accessible for now */}
          <Route element={<PublicLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/banking" element={<BankingPage />} />
            <Route path="/webhooks" element={<Webhooks />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/payout" element={<PayoutPage />} />
            <Route path="/kyc" element={<KycPage />} />
            <Route path="/upi-plugin" element={<UpiPluginPage />} />
            <Route path="/transfers" element={<TransfersPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/plugin" element={<Navigate to="/upi-plugin" replace />} />
          </Route>
          
          {/* Admin routes - directly accessible for now */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="monitoring" element={<AdminMonitoring />} />
            <Route path="monitoring/:dashboardType" element={<MonitoringDashboard />} />
            <Route path="escrow" element={<AdminEscrow />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="merchants" element={<AdminMerchants />} />
            <Route path="kyc" element={<AdminKYC />} />
            <Route path="whitelist" element={<AdminWhitelist />} />
            <Route path="upi-management" element={<AdminUpiManagement />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="transactions-log" element={<AdminTransactionLog />} />
            <Route path="activity-log" element={<AdminActivityLog />} />
          </Route>
        </Routes>
      </AnalyticsWrapper>
    </Router>
  );
};

export default App;
