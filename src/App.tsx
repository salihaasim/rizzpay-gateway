import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Session } from '@supabase/supabase-js';

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

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, [user, supabase]);

  const SupabaseStatus = () => (
    <div className="absolute top-0 left-0 w-full flex justify-center">
      {session ? (
        <Link to="/dashboard" className="py-2 px-4 rounded-md bg-green-500 text-white">
          {user?.email} is signed in
        </Link>
      ) : (
        <Link to="/auth" className="py-2 px-4 rounded-md bg-blue-500 text-white">
          Sign in
        </Link>
      )}
    </div>
  );

  return (
    <BrowserRouter>
      <div className="app-container">
        <SupabaseStatus />
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
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
