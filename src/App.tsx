import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import TransactionsPage from '@/pages/TransactionsPage';
import WalletPage from '@/pages/WalletPage';
import TransfersPage from '@/pages/TransfersPage';
import BankingPage from '@/pages/BankingPage';
import KycVerificationPage from '@/pages/KycVerificationPage';
import UpiPaymentLinkGenerator from '@/components/upi/UpiPaymentLinkGenerator';
import UpiPluginPage from '@/pages/UpiPluginPage';
import DeveloperPage from '@/pages/DeveloperPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import WhitelistPage from '@/pages/WhitelistPage';
import PayoutPage from '@/pages/PayoutPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminTransactions from '@/pages/AdminTransactions';
import AdminMerchants from '@/pages/AdminMerchants';
import AdminSettlements from '@/pages/AdminSettlements';
import AdminEscrow from '@/pages/AdminEscrow';
import AdminWhitelist from '@/pages/AdminWhitelist';
import AdminMonitoring from '@/pages/AdminMonitoring';
import AdminMonitoringDetail from '@/pages/AdminMonitoringDetail';
import AdminUsers from '@/pages/AdminUsers';
import AdminRoles from '@/pages/AdminRoles';
import AdminLogs from '@/pages/AdminLogs';
import AdminSettings from '@/pages/AdminSettings';
import { ThemeProvider } from './components/theme-provider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import UpiLinkPaymentPage from './pages/UpiLinkPaymentPage';
import ErrorPage from './pages/ErrorPage';
import { useMerchantAuth } from './stores/merchantAuthStore';
import { useEffect } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { initializeErrorMonitoring } from '@/utils/monitoringUtils';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize error monitoring when app starts
    initializeErrorMonitoring();
    console.log('RizzPay Error Monitoring Initialized');
  }, []);

  const { currentMerchant } = useMerchantAuth();
  const isAdmin = currentMerchant?.role === 'admin';

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeProvider>
            <Toaster />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/upi-link-payment" element={<UpiLinkPaymentPage />} />
              <Route path="*" element={<ErrorPage />} />

              {/* Protected Merchant Routes */}
              <Route path="/" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><Layout><TransactionsPage /></Layout></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><Layout><WalletPage /></Layout></ProtectedRoute>} />
              <Route path="/payout" element={<ProtectedRoute><Layout><PayoutPage /></Layout></ProtectedRoute>} />
              <Route path="/transfers" element={<ProtectedRoute><Layout><TransfersPage /></Layout></ProtectedRoute>} />
              <Route path="/banking" element={<ProtectedRoute><Layout><BankingPage /></Layout></ProtectedRoute>} />
              <Route path="/kyc" element={<ProtectedRoute><Layout><KycVerificationPage /></Layout></ProtectedRoute>} />
              <Route path="/link-payment" element={<ProtectedRoute><Layout><UpiPaymentLinkGenerator /></Layout></ProtectedRoute>} />
              <Route path="/plugin" element={<ProtectedRoute><Layout><UpiPluginPage /></Layout></ProtectedRoute>} />
              <Route path="/developer" element={<ProtectedRoute><Layout><DeveloperPage /></Layout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
              <Route path="/whitelist" element={<ProtectedRoute><Layout><WhitelistPage /></Layout></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/transactions" element={<AdminProtectedRoute><AdminTransactions /></AdminProtectedRoute>} />
              <Route path="/admin/merchants" element={<AdminProtectedRoute><AdminMerchants /></AdminProtectedRoute>} />
              <Route path="/admin/settlements" element={<AdminProtectedRoute><AdminSettlements /></AdminProtectedRoute>} />
              <Route path="/admin/escrow" element={<AdminProtectedRoute><AdminEscrow /></AdminProtectedRoute>} />
              <Route path="/admin/whitelist" element={<AdminProtectedRoute><AdminWhitelist /></AdminProtectedRoute>} />
              <Route path="/admin/monitoring" element={<AdminProtectedRoute><AdminMonitoring /></AdminProtectedRoute>} />
              <Route path="/admin/monitoring/:dashboardId" element={<AdminProtectedRoute><AdminMonitoringDetail /></AdminProtectedRoute>} />
              <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
              <Route path="/admin/roles" element={<AdminProtectedRoute><AdminRoles /></AdminProtectedRoute>} />
              <Route path="/admin/logs" element={<AdminProtectedRoute><AdminLogs /></AdminProtectedRoute>} />
              <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
            </Routes>
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
