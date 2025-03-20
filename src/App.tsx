
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTransactionStore } from "@/stores/transactionStore";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import WalletPage from "./pages/WalletPage";
import WebhookPage from "./pages/WebhookPage";
import WebhookPayment from "./pages/WebhookPayment";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component to check for admin role
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { userRole } = useTransactionStore();
  
  if (userRole !== 'admin') {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

// Protected route component for any authenticated user
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { userRole } = useTransactionStore();
  
  if (!userRole) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected routes - require any user role */}
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
