
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Session } from '@supabase/supabase-js';
import { useAuth } from '@/stores/authStore';

import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import WalletPage from './pages/WalletPage';
import PaymentPage from './pages/PaymentPage';
import WebhookPage from './pages/WebhookPage';
import WebhookSetup from './pages/WebhookSetup';
import WebhookPayment from './pages/WebhookPayment';
import DeveloperIntegration from './pages/DeveloperIntegration';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import { supabase } from './integrations/supabase/client';
import SupabaseStatus from './components/SupabaseStatus';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const { checkAuth, isAuthenticated, user } = useAuth();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Check auth on component mount
    checkAuth();

    return () => subscription.unsubscribe();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <div className="app-container relative">
        <div className="fixed bottom-4 left-4 z-50 py-1 px-3 rounded-full bg-background/80 backdrop-blur-sm shadow-md border">
          <SupabaseStatus />
        </div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/webhook" element={<WebhookPage />} />
          <Route path="/webhook/setup" element={<WebhookSetup />} />
          <Route path="/webhook/payment" element={<WebhookPayment />} />
          <Route path="/developers" element={<DeveloperIntegration />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
