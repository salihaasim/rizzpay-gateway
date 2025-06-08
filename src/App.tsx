import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import AuthPage from '@/pages/AuthPage';
import Dashboard from '@/pages/Dashboard';
import TransactionsPage from '@/pages/TransactionsPage';
import WalletPage from '@/pages/WalletPage';
import SettingsPage from '@/pages/SettingsPage';
import ActivityLogPage from '@/pages/ActivityLogPage';
import SupportPage from '@/pages/SupportPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminMerchants from '@/pages/admin/AdminMerchants';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import AdminTransactionLog from '@/pages/AdminTransactionLog';
import AdminPayoutManagement from '@/pages/admin/AdminPayoutManagement';
import AdminKYC from '@/pages/admin/AdminKYC';
import AdminWhitelist from '@/pages/admin/AdminWhitelist';
import AdminSupport from '@/pages/admin/AdminSupport';
import AdminPaymentRecon from '@/pages/admin/AdminPaymentRecon';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<NotFoundPage />} />

            {/* Merchant Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/activity-log" element={<ActivityLogPage />} />
            <Route path="/support" element={<SupportPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/merchants" element={<AdminMerchants />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
            <Route path="/admin/transaction-log" element={<AdminTransactionLog />} />
            <Route path="/admin/payout-management" element={<AdminPayoutManagement />} />
            <Route path="/admin/payment-recon" element={<AdminPaymentRecon />} />
            <Route path="/admin/kyc" element={<AdminKYC />} />
            <Route path="/admin/whitelist" element={<AdminWhitelist />} />
            <Route path="/admin/support" element={<AdminSupport />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
