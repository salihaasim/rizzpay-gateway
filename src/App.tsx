
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTransactionStore } from "@/stores/transactionStore";

// Regular imports
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy load the less frequently accessed pages to improve initial load time
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Settings = lazy(() => import("./pages/Settings"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const WebhookPage = lazy(() => import("./pages/WebhookPage"));
const WebhookPayment = lazy(() => import("./pages/WebhookPayment"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetching on window focus for better performance
      staleTime: 1000 * 60 * 5, // 5 minutes - reduce network requests
    },
  },
});

// Protected route component to check for admin role
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { userRole } = useTransactionStore();
  
  if (userRole !== 'admin') {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

// Protected route component for any authenticated user (admin or merchant)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { userRole } = useTransactionStore();
  
  if (!userRole) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

// Loading fallback for lazy-loaded components
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-primary">Loading...</div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes - require admin or merchant role */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            } />
            <Route path="/wallet" element={
              <ProtectedRoute>
                <WalletPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/webhook" element={
              <ProtectedRoute>
                <WebhookPage />
              </ProtectedRoute>
            } />
            
            {/* Admin-only routes */}
            <Route path="/payment" element={
              <AdminRoute>
                <WebhookPayment />
              </AdminRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
