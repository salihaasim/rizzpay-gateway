
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from '@/components/ui/sonner';
import Dashboard from '@/pages/Dashboard';
import Index from '@/pages/Index';
import Transactions from '@/pages/Transactions';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';
import WebhookPage from '@/pages/WebhookPage';
import WebhookPayment from '@/pages/WebhookPayment';
import WalletPage from '@/pages/WalletPage';
import AdminDashboard from '@/pages/AdminDashboard';

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/webhook" element={<WebhookPage />} />
        <Route path="/webhook-payment/:token" element={<WebhookPayment />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
