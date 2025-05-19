
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet
} from 'react-router-dom';
import { useTransactionStore } from './stores/transactionStore';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import BankingPage from './pages/BankingPage';
import Webhooks from './pages/Webhooks';
import AdminDashboard from './pages/AdminDashboard';
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
import GlobalFooter from './components/GlobalFooter';
import Auth from './pages/Auth';

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <div className="flex-grow">
      <Outlet />
    </div>
    <GlobalFooter />
  </div>
);

const App: React.FC = () => {
  const { setUserRole, userRole, isAuthenticated } = useTransactionStore();
  
  useEffect(() => {
    // Simulate checking authentication status and setting user role
    const checkAuthStatus = async () => {
      // Replace this with your actual authentication logic
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      if (isLoggedIn) {
        // Simulate fetching user role from local storage or API
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
        {/* Public routes wrapped in PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/upi-payment" element={<UpiPaymentPage />} />
          <Route path="/india" element={<IndiaPage />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          
          {/* Protected routes for authenticated users */}
          <Route
            path="/dashboard"
            element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/transactions"
            element={isAuthenticated() ? <Transactions /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={isAuthenticated() ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/banking"
            element={isAuthenticated() ? <BankingPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/webhooks"
            element={isAuthenticated() ? <Webhooks /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/wallet"
            element={isAuthenticated() ? <WalletPage /> : <Navigate to="/login" replace />}
          />
        </Route>
        
        {/* Admin routes - Only accessible if user is admin */}
        <Route 
          path="/admin" 
          element={userRole === 'admin' ? <AdminLayout /> : <Navigate to="/login" replace />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="merchants" element={<AdminMerchants />} />
          <Route path="kyc" element={<AdminKYC />} />
          <Route path="whitelist" element={<AdminWhitelist />} />
          <Route path="upi-management" element={<AdminUpiManagement />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
