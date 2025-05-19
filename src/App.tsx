
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
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
import Index from './pages/Index';
import Auth from './pages/Auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const App: React.FC = () => {
  const { setUserRole } = useTransactionStore();
  
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
        {/* Public landing page */}
        <Route path="/" element={<Index />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upi-payment" element={<UpiPaymentPage />} />
        <Route path="/india" element={<IndiaPage />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected routes for authenticated users */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/banking" element={<BankingPage />} />
        <Route path="/webhooks" element={<Webhooks />} />
        <Route path="/wallet" element={<WalletPage />} />
        
        {/* Admin routes with AdminLayout */}
        <Route path="/admin" element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        } />
        <Route path="/admin/transactions" element={
          <AdminLayout>
            <AdminTransactions />
          </AdminLayout>
        } />
        <Route path="/admin/merchants" element={
          <AdminLayout>
            <AdminMerchants />
          </AdminLayout>
        } />
        <Route path="/admin/kyc" element={
          <AdminLayout>
            <AdminKYC />
          </AdminLayout>
        } />
        <Route path="/admin/whitelist" element={
          <AdminLayout>
            <AdminWhitelist />
          </AdminLayout>
        } />
        <Route path="/admin/upi-management" element={
          <AdminLayout>
            <AdminUpiManagement />
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App;
