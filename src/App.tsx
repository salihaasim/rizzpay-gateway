
import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from '@/pages/Index';
import AuthPage from '@/pages/Auth';
import { ThemeProvider } from "@/context/ThemeContext"
import { MerchantDashboard } from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import { trackPageView } from './utils/analytics';

const TermsAndConditionsPage = lazy(() => import('@/pages/TermsAndConditions'));

function AppContent() {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/terms" element={<TermsAndConditionsPage />} />
        <Route path="/dashboard" element={<MerchantDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
