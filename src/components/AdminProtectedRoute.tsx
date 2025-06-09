
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { currentMerchant, isAuthenticated } = useMerchantAuth();

  if (!isAuthenticated || !currentMerchant) {
    return <Navigate to="/login" replace />;
  }

  if (currentMerchant.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
