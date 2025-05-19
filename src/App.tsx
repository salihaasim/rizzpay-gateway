
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import { useTransactionStore } from './stores/transactions';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Login from './pages/Login';
import Register from './pages/Register';
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

const App: React.FC = () => {
  const { setUserRole, isAuthenticated } = useTransactionStore();
  
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upi-payment" element={<UpiPaymentPage />} />
        <Route path="/india" element={<IndiaPage />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        
        {/* Protected routes for authenticated users */}
        <Route
          path="/"
          element={isAuthenticated() ? <Dashboard /> : <Login />}
        />
        <Route
          path="/transactions"
          element={isAuthenticated() ? <Transactions /> : <Login />}
        />
        <Route
          path="/profile"
          element={isAuthenticated() ? <Profile /> : <Login />}
        />
        <Route
          path="/banking"
          element={isAuthenticated() ? <BankingPage /> : <Login />}
        />
        <Route
          path="/webhooks"
          element={isAuthenticated() ? <Webhooks /> : <Login />}
        />
        <Route
          path="/wallet"
          element={isAuthenticated() ? <WalletPage /> : <Login />}
        />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
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
