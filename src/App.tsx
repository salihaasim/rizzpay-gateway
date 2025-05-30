import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { MerchantDashboard } from '@/pages/MerchantDashboard';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from './utils/analytics';
const TermsAndConditionsPage = lazy(() => import('@/pages/TermsAndConditionsPage'));
function App() {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/terms" element={<TermsAndConditionsPage />} />
            <Route path="/dashboard" element={<MerchantDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
