
import React from 'react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MerchantOnboarding() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Join RizzPay as a Merchant</CardTitle>
            <CardDescription>
              Start accepting payments securely with our payment gateway
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Benefits</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Secure payment processing</li>
                  <li>Real-time transaction tracking</li>
                  <li>Instant settlements</li>
                  <li>24/7 support</li>
                </ul>
              </div>
              
              <Button 
                onClick={() => navigate('/register-merchant')} 
                className="w-full bg-[#0052FF]"
              >
                Register as Merchant
              </Button>
              
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Button variant="link" className="p-0 h-auto font-normal" onClick={() => navigate('/auth')}>
                  Login here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
