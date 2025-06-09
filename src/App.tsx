
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import Layout from '@/components/Layout';
import AdminEscrow from '@/pages/AdminEscrow';
import { ThemeProvider } from './components/theme-provider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import NotFound from '@/pages/NotFound';
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

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeProvider>
            <Toaster />
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/escrow" element={<AdminProtectedRoute><AdminEscrow /></AdminProtectedRoute>} />
              
              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
