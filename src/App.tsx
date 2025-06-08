
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import Dashboard from '@/pages/Dashboard';
import TransactionsPage from '@/pages/TransactionsPage';
import WalletPage from '@/pages/WalletPage';
import SettingsPage from '@/pages/SettingsPage';
import ActivityLogPage from '@/pages/ActivityLogPage';
import SupportPage from '@/pages/SupportPage';
import BankingPage from '@/pages/BankingPage';
import KycPage from '@/pages/KycPage';
import DeveloperPage from '@/pages/DeveloperPage';
import LinkPaymentPage from '@/pages/LinkPaymentPage';
import PluginPage from '@/pages/PluginPage';
import TransfersPage from '@/pages/TransfersPage';
import AdvancedPayoutPage from '@/pages/AdvancedPayoutPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminMerchants from '@/pages/admin/AdminMerchants';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import AdminTransactionLog from '@/pages/AdminTransactionLog';
import AdminPayoutManagement from '@/pages/admin/AdminPayoutManagement';
import AdminKYC from '@/pages/admin/AdminKYC';
import AdminWhitelist from '@/pages/AdminWhitelist';
import AdminSupport from '@/pages/admin/AdminSupport';
import AdminPaymentRecon from '@/pages/admin/AdminPaymentRecon';
import AdminSettings from '@/pages/AdminSettings';
import AdminActivityLog from '@/pages/AdminActivityLog';
import AdminMonitoring from '@/pages/AdminMonitoring';
import AdminApiManagement from '@/pages/AdminApiManagement';
import AdminEscrow from '@/pages/AdminEscrow';
import AdminUpiManagement from '@/pages/AdminUpiManagement';
import TermsAndConditions from '@/pages/TermsAndConditions';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import RefundPolicy from '@/pages/RefundPolicy';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="*" element={<NotFoundPage />} />

            {/* Merchant Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/banking" element={<BankingPage />} />
            <Route path="/transfers" element={<TransfersPage />} />
            <Route path="/advanced-payout" element={<AdvancedPayoutPage />} />
            <Route path="/kyc" element={<KycPage />} />
            <Route path="/link-payment" element={<LinkPaymentPage />} />
            <Route path="/plugin" element={<PluginPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
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
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/activity-log" element={<AdminActivityLog />} />
            <Route path="/admin/monitoring" element={<AdminMonitoring />} />
            <Route path="/admin/api-management" element={<AdminApiManagement />} />
            <Route path="/admin/escrow" element={<AdminEscrow />} />
            <Route path="/admin/upi-management" element={<AdminUpiManagement />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
