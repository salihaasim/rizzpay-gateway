
import React, { useEffect, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import PaymentPage from './pages/PaymentPage';
import WebhookPayment from './pages/WebhookPayment';
import Layout from './components/Layout';
import { Toaster } from 'sonner';
import Transactions from './pages/Transactions';
import WalletPage from './pages/WalletPage';
import WebhookPage from './pages/WebhookPage';
import DeveloperIntegration from './pages/DeveloperIntegration';
import NotFound from './pages/NotFound';
import { useAuth } from './stores/authStore';

// Optimized Protected route component
const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-primary/10 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-primary/10 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-primary/10 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

function App() {
  const { checkAuth } = useAuth();
  
  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Index page without Layout to avoid duplicate navbar */}
        <Route path="/" element={<Index />} />
        
        {/* Protected routes with Layout */}
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <Layout><Transactions /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/wallet" element={
          <ProtectedRoute>
            <Layout><WalletPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/webhook" element={
          <ProtectedRoute>
            <Layout><WebhookPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/developers" element={
          <ProtectedRoute>
            <Layout><DeveloperIntegration /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute>
            <Layout><PaymentPage /></Layout>
          </ProtectedRoute>
        } />
        
        {/* Special pages */}
        <Route path="/webhook-payment" element={<WebhookPayment />} />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
