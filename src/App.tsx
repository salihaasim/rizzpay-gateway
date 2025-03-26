
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import PaymentPage from './pages/PaymentPage';
import WebhookPayment from './pages/WebhookPayment';
import Layout from './components/Layout';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard/*" element={<Layout><Dashboard /></Layout>} />
        <Route path="/payment" element={<Layout><PaymentPage /></Layout>} />
        <Route path="/webhook-payment" element={<WebhookPayment />} />
      </Routes>
    </Router>
  );
}

export default App;
