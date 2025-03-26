
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Index page without Layout to avoid duplicate navbar */}
        <Route path="/" element={<Index />} />
        
        {/* Pages with Layout */}
        <Route path="/dashboard/*" element={<Layout><Dashboard /></Layout>} />
        <Route path="/payment" element={<Layout><PaymentPage /></Layout>} />
        <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
        <Route path="/wallet" element={<Layout><WalletPage /></Layout>} />
        <Route path="/webhook" element={<Layout><WebhookPage /></Layout>} />
        <Route path="/developers" element={<Layout><DeveloperIntegration /></Layout>} />
        
        {/* Special pages */}
        <Route path="/webhook-payment" element={<WebhookPayment />} />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
