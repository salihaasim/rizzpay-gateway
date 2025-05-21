
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { useTransactionStore } from './stores/transactions';
import { useMerchantAuth } from './stores/merchantAuthStore';
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
import Auth from './pages/Auth';
import AdminSettings from './pages/AdminSettings';
import AdminTransactionLog from './pages/AdminTransactionLog';
import AdminActivityLog from './pages/AdminActivityLog';
import { toast } from 'sonner';

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

// Authentication guard for merchant routes
const MerchantRouteGuard = ({ element }) => {
  const { isAuthenticated } = useMerchantAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  return isAuthenticated ? element : null;
};

// Authentication guard for admin routes
const AdminRouteGuard = ({ element }) => {
  const { currentMerchant } = useMerchantAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentMerchant || currentMerchant.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/auth', { replace: true });
    }
  }, [currentMerchant, navigate]);
  
  return currentMerchant?.role === 'admin' ? element : null;
};

const App: React.FC = () => {
  const { setUserRole, resetUserRole } = useTransactionStore();
  const { isAuthenticated } = useMerchantAuth();
  
  useEffect(() => {
    // Simulate checking authentication status and setting user role
    const checkAuthStatus = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      if (isLoggedIn) {
        const userRole = localStorage.getItem('userRole') || 'merchant';
        const userEmail = localStorage.getItem('userEmail') || 'merchant@example.com';
        setUserRole(userRole as 'admin' | 'merchant', userEmail);
      }
    };
    
    checkAuthStatus();
  }, [setUserRole]);
  
  return (
    <Router>
      <Routes>
        {/* Home page route with footer */}
        <Route element={<HomePageLayout />}>
          <Route path="/" element={<Index />} />
        </Route>
        
        {/* Auth routes */}
        <Route element={<PublicLayout />}>
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
          
          {/* Public pages without authentication */}
          <Route path="/upi-payment" element={<UpiPaymentPage />} />
          <Route path="/upi-link-payment" element={<UpiLinkPaymentPage />} />
          <Route path="/link-payment" element={<Navigate to="/upi-link-payment" />} />
          <Route path="/india" element={<IndiaPage />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/contact" element={<ContactUs />} />
        </Route>
        
        {/* Merchant routes */}
        <Route element={<PublicLayout />}>
          <Route path="/dashboard" element={<MerchantRouteGuard element={<Dashboard />} />} />
          <Route path="/transactions" element={<MerchantRouteGuard element={<Transactions />} />} />
          <Route path="/profile" element={<MerchantRouteGuard element={<Profile />} />} />
          <Route path="/settings" element={<MerchantRouteGuard element={<Settings />} />} />
          <Route path="/banking" element={<MerchantRouteGuard element={<BankingPage />} />} />
          <Route path="/webhooks" element={<MerchantRouteGuard element={<Webhooks />} />} />
          <Route path="/wallet" element={<MerchantRouteGuard element={<WalletPage />} />} />
          <Route path="/upi-plugin" element={<MerchantRouteGuard element={<UpiPluginPage />} />} />
          <Route path="/transfers" element={<MerchantRouteGuard element={<TransfersPage />} />} />
          <Route path="/developer" element={<MerchantRouteGuard element={<DeveloperPage />} />} />
          <Route path="/plugin" element={
            isAuthenticated ? <Navigate to="/upi-plugin" replace /> : <Navigate to="/auth" replace />
          } />
        </Route>
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminRouteGuard element={<AdminLayout />} />}>
          <Route index element={<AdminDashboard />} />
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
    </Router>
  );
};

export default App;
