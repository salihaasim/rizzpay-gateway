
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentFlow from '@/components/PaymentFlow';

const PaymentPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto border shadow-lg">
        <CardHeader className="border-b bg-muted/40">
          <CardTitle className="text-2xl">Make a Payment</CardTitle>
          <CardDescription>
            Complete your payment using our secure payment gateway.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <PaymentFlow />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
