
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const RefundPolicy: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Refund Policy | RizzPay</title>
        <meta name="description" content="RizzPay refund policy and terms" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight">Refund Policy</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: May 19, 2025
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              This Refund Policy outlines the terms and conditions for refunds on RizzPay transactions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              At RizzPay, we strive to ensure complete satisfaction with our payment services. This Refund Policy explains the circumstances under which refunds may be processed and the procedures to follow when requesting a refund.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Refund Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Eligible for Refund:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Unauthorized transactions that have been verified as fraudulent</li>
                <li>Double-charged transactions for the same purchase</li>
                <li>Services or products not received but payment was processed</li>
                <li>Technical errors resulting in incorrect transaction amount</li>
              </ul>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h3 className="font-medium">Not Eligible for Refund:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Completed service transactions where the service was delivered as described</li>
                <li>Requests made after 30 days from the transaction date</li>
                <li>Transactions disputed after product/service was received and accepted</li>
                <li>Purchase of digital content that has been accessed, downloaded, or streamed</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Refund Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To request a refund, please follow these steps:
            </p>
            
            <ol className="list-decimal pl-6 space-y-2">
              <li>Log into your RizzPay account</li>
              <li>Navigate to the "Transactions" section</li>
              <li>Locate the transaction in question</li>
              <li>Select "Request Refund" and follow the prompts</li>
              <li>Provide the necessary information to support your refund request</li>
            </ol>
            
            <p className="text-sm text-muted-foreground mt-4">
              All refund requests are reviewed within 2-3 business days. You will be notified via email once a decision has been made.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Refund Timeframe</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Once a refund is approved, it typically takes:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><span className="font-medium">Credit/Debit Cards:</span> 5-10 business days</li>
              <li><span className="font-medium">Bank Transfers:</span> 3-5 business days</li>
              <li><span className="font-medium">E-wallets:</span> 1-2 business days</li>
              <li><span className="font-medium">UPI Transactions:</span> 1-3 business days</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              If you have any questions about our Refund Policy, please contact our customer support:
            </p>
            <div className="mt-3 space-y-1">
              <p><span className="font-medium">Email:</span> support@rizzpay.co.in</p>
              <p><span className="font-medium">Phone:</span> +91 1800-123-4567</p>
              <p><span className="font-medium">Hours:</span> Monday to Friday, 9:00 AM to 6:00 PM IST</p>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center text-xs text-muted-foreground mt-12">
          <p>© 2025 RizzPay Payment Technologies. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default React.memo(RefundPolicy);
