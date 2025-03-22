
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Toaster } from '@/components/ui/sonner';
import { useTransactionStore } from '@/stores/transactionStore';
import { Loader2 } from 'lucide-react';

// Lazy load pages to improve performance and reduce initial load time
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Index = lazy(() => import('@/pages/Index'));
const Transactions = lazy(() => import('@/pages/Transactions'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Auth = lazy(() => import('@/pages/Auth'));
const WebhookPage = lazy(() => import('@/pages/WebhookPage'));
const WebhookPayment = lazy(() => import('@/pages/WebhookPayment'));
const WalletPage = lazy(() => import('@/pages/WalletPage'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

// Protected route component to prevent unauthorized access
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { userRole } = useTransactionStore();
  
  if (userRole !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/webhook" element={<WebhookPage />} />
          <Route path="/webhook-payment/:token" element={<WebhookPayment />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
