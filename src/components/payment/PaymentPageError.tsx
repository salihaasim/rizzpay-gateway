
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PaymentPageErrorProps {
  error: string;
  navigateToHome: () => void;
}

const PaymentPageError: React.FC<PaymentPageErrorProps> = ({ error, navigateToHome }) => {
  return (
    <div className="max-w-md mx-auto mt-8">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      <div className="mt-4 text-center">
        <Button variant="outline" onClick={navigateToHome}>
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default React.memo(PaymentPageError);
