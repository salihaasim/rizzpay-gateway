
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/context/ThemeContext';

// Import pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import MerchantDashboardNew from '@/pages/MerchantDashboardNew';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import Transactions from '@/pages/Transactions';
import AdminTransactions from '@/pages/admin/AdminTransactions';
import WalletPage from '@/pages/WalletPage';
import PayoutPage from '@/pages/PayoutPage';
import BankingPage from '@/pages/BankingPage';
import TransfersPage from '@/pages/TransfersPage';
import UpiPluginPage from '@/pages/UpiPluginPage';
import Webhooks from '@/pages/Webhooks';
import KycPage from '@/pages/KycPage';
import AdminKYC from '@/pages/admin/AdminKYC';
import DeveloperPage from '@/pages/DeveloperPage';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Auth from '@/pages/Auth';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import RegisterMerchant from '@/pages/RegisterMerchant';
import MerchantOnboarding from '@/pages/MerchantOnboarding';
import AdminMerchants from '@/pages/admin/AdminMerchants';
import AdminEscrow from '@/pages/admin/AdminEscrow';
import AdminUpiManagement from '@/pages/AdminUpiManagement';
import AdminWhitelist from '@/pages/admin/AdminWhitelist';
import AdminMonitoring from '@/pages/AdminMonitoring';
import AdminActivityLog from '@/pages/AdminActivityLog';
import AdminTransactionLog from '@/pages/AdminTransactionLog';
import AdminSettings from '@/pages/AdminSettings';
import UpiPaymentPage from '@/pages/UpiPaymentPage';
import UpiLinkPaymentPage from '@/pages/UpiLinkPaymentPage';
import WebhookPayment from '@/pages/WebhookPayment';
import NotFound from '@/pages/NotFound';

// Layout components
import AdminLayout from '@/components/admin/AdminLayout';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-merchant" element={<RegisterMerchant />} />
            <Route path="/merchant-onboarding" element={<MerchantOnboarding />} />
            
            {/* Payment routes */}
            <Route path="/upi-payment" element={<UpiPaymentPage />} />
            <Route path="/upi-link-payment" element={<UpiLinkPaymentPage />} />
            <Route path="/webhook-payment" element={<WebhookPayment />} />
            
            {/* Merchant routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/merchant-dashboard-new" element={<MerchantDashboardNew />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/payout" element={<PayoutPage />} />
            <Route path="/banking" element={<BankingPage />} />
            <Route path="/transfers" element={<TransfersPage />} />
            <Route path="/upi-plugin" element={<UpiPluginPage />} />
            <Route path="/webhooks" element={<Webhooks />} />
            <Route path="/kyc" element={<KycPage />} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/merchants" element={<AdminLayout><AdminMerchants /></AdminLayout>} />
            <Route path="/admin/transactions" element={<AdminLayout><AdminTransactions /></AdminLayout>} />
            <Route path="/admin/kyc" element={<AdminLayout><AdminKYC /></AdminLayout>} />
            <Route path="/admin/escrow" element={<AdminLayout><AdminEscrow /></AdminLayout>} />
            <Route path="/admin/upi-management" element={<AdminLayout><AdminUpiManagement /></AdminLayout>} />
            <Route path="/admin/whitelist" element={<AdminLayout><AdminWhitelist /></AdminLayout>} />
            <Route path="/admin/monitoring" element={<AdminLayout><AdminMonitoring /></AdminLayout>} />
            <Route path="/admin/activity-log" element={<AdminLayout><AdminActivityLog /></AdminLayout>} />
            <Route path="/admin/transactions-log" element={<AdminLayout><AdminTransactionLog /></AdminLayout>} />
            <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
