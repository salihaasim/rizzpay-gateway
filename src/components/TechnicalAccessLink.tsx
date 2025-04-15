
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Lock, FileText } from 'lucide-react';

const TechnicalAccessLink = () => {
  const { isAuthenticated } = useMerchantAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleAccessTechnicalDetails = () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to access technical documentation');
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    // Simulate loading for better UX
    setTimeout(() => {
      setIsLoading(false);
      navigate('/how-it-works-technical');
    }, 800);
  };

  return (
    <Button 
      variant="outline" 
      className="flex items-center gap-2 w-full justify-center bg-blue-50 hover:bg-blue-100 border-blue-200"
      onClick={handleAccessTechnicalDetails}
      disabled={isLoading}
    >
      <Lock size={16} className="text-blue-600" />
      <span className="font-medium text-blue-600">Access Technical Documentation</span>
      <FileText size={16} className="text-blue-600" />
    </Button>
  );
};

export default TechnicalAccessLink;
