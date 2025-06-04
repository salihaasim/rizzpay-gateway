
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/context/ThemeContext';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import WalletPage from '@/pages/WalletPage';
import PayoutPage from '@/pages/PayoutPage';
import EnhancedPayoutPage from '@/pages/EnhancedPayoutPage';
import TransfersPage from '@/pages/TransfersPage';
import BankingPage from '@/pages/BankingPage';
import KycPage from '@/pages/KycPage';
import UpiLinkPaymentPage from '@/pages/UpiLinkPaymentPage';
import UpiPluginPage from '@/pages/UpiPluginPage';
import DeveloperPage from '@/pages/DeveloperPage';
import Settings from '@/pages/Settings';
import MerchantWhitelist from '@/pages/MerchantWhitelist';
import PaymentPage from '@/pages/PaymentPage';

// Merchant Pages
import AdvancedPayoutPage from '@/rizzpay-stable-ui/merchant/pages/AdvancedPayoutPage';

// Admin Pages
import AdminDashboard from '@/pages/AdminDashboard';
import AdminMonitoring from '@/pages/AdminMonitoring';
import AdminApiManagement from '@/pages/AdminApiManagement';
import AdminProductionApiManagement from '@/pages/AdminProductionApiManagement';
import AdminEscrow from '@/pages/AdminEscrow';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import AdminTransactionLog from '@/pages/AdminTransactionLog';
import AdminActivityLog from '@/pages/AdminActivityLog';
import AdminUpiManagement from '@/pages/AdminUpiManagement';
import AdminMerchants from '@/pages/admin/AdminMerchants';
import AdminKYC from '@/pages/admin/AdminKYC';
import AdminWhitelist from '@/pages/AdminWhitelist';
import AdminSettings from '@/pages/AdminSettings';
import AdminSupport from '@/pages/admin/AdminSupport';
import AdminPayoutManagement from '@/pages/admin/AdminPayoutManagement';

// Other Pages
import Profile from '@/pages/Profile';
import UpiPaymentPage from '@/pages/UpiPaymentPage';
import WebhookPayment from '@/pages/WebhookPayment';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/pay" element={<PaymentPage />} />
              <Route path="/pay/:paymentId" element={<PaymentPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/upi-payment/:transactionId" element={<UpiPaymentPage />} />
              <Route path="/webhook-payment/:transactionId" element={<WebhookPayment />} />

              {/* Merchant Dashboard Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/payout" element={<PayoutPage />} />
              <Route path="/merchant/advanced-payout" element={<AdvancedPayoutPage />} />
              <Route path="/payout-enhanced" element={<EnhancedPayoutPage />} />
              <Route path="/transfers" element={<TransfersPage />} />
              <Route path="/banking" element={<BankingPage />} />
              <Route path="/kyc" element={<KycPage />} />
              <Route path="/link-payment" element={<UpiLinkPaymentPage />} />
              <Route path="/plugin" element={<UpiPluginPage />} />
              <Route path="/developer" element={<DeveloperPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/whitelist" element={<MerchantWhitelist />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/monitoring" element={<AdminMonitoring />} />
              <Route path="/admin/api-management" element={<AdminApiManagement />} />
              <Route path="/admin/escrow" element={<AdminEscrow />} />
              <Route path="/admin/transactions" element={<AdminTransactions />} />
              <Route path="/admin/transactions-log" element={<AdminTransactionLog />} />
              <Route path="/admin/activity-log" element={<AdminActivityLog />} />
              <Route path="/admin/upi-management" element={<AdminUpiManagement />} />
              <Route path="/admin/merchants" element={<AdminMerchants />} />
              <Route path="/admin/kyc" element={<AdminKYC />} />
              <Route path="/admin/whitelist" element={<AdminWhitelist />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/support" element={<AdminSupport />} />
              <Route path="/admin/payout-management" element={<AdminPayoutManagement />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
