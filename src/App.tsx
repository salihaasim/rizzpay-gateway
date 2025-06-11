
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import AdminPaymentReconciliation from "./pages/admin/AdminPaymentReconciliation";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/payment-reconciliation" element={<AdminPaymentReconciliation />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
