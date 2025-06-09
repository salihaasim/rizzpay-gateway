
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMerchantAuth } from '@/stores/merchantAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentMerchant, isAuthenticated } = useMerchantAuth();

  if (!isAuthenticated || !currentMerchant) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
