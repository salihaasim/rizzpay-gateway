
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IndianRupee, QrCode, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useTransactionStore } from '@/stores/transactionStore';
import UpiLinkPayment from '@/components/upi/UpiLinkPayment';
import { Helmet } from 'react-helmet';

const UpiLinkPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addTransaction } = useTransactionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  
  // Get payment details from URL parameters
  const amount = searchParams.get('amount') || '0';
  const merchantId = searchParams.get('mid') || '';
  const merchantName = searchParams.get('name') || 'RizzPay Merchant';
  const description = searchParams.get('desc') || 'Payment via RizzPay';
  const upiId = searchParams.get('upi') || '';
  const returnUrl = searchParams.get('return_url') || '';
  
  // Format the amount for display
  const formattedAmount = parseFloat(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
  
  const handlePaymentSuccess = (txnId: string, utrId: string) => {
    setTransactionId(txnId);
    setPaymentSuccess(true);
    
    toast.success('Payment submitted for verification', {
      description: 'Your transaction will be verified shortly'
    });
    
    // If there's a return URL, append the transaction ID and redirect
    if (returnUrl) {
      const redirectUrl = new URL(returnUrl);
      redirectUrl.searchParams.append('txnId', txnId);
      redirectUrl.searchParams.append('utrId', utrId);
      redirectUrl.searchParams.append('status', 'pending');
      
      // Delay redirect to allow toast to be seen
      setTimeout(() => {
        window.location.href = redirectUrl.toString();
      }, 2000);
    }
  };
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  return (
    <>
      <Helmet>
        <title>RizzPay - Pay ₹{formattedAmount}</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-primary rounded-full h-12 w-12 flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <Card className="border shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Payment Request</CardTitle>
              <CardDescription>
                Pay to {merchantName}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Amount to Pay</p>
                <p className="text-3xl font-bold">₹{formattedAmount}</p>
              </div>
              
              {description && (
                <div className="bg-muted/50 p-3 rounded-md text-sm text-center">
                  {description}
                </div>
              )}
              
              {paymentSuccess ? (
                <div className="bg-green-50 border border-green-100 rounded-md p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="bg-green-100 rounded-full p-2">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <h3 className="font-medium text-green-800">Payment Submitted</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Your payment is being verified
                  </p>
                  <p className="text-xs text-green-600 mt-3">
                    Transaction ID: {transactionId}
                  </p>
                </div>
              ) : (
                <Button 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={handleOpenModal}
                >
                  <QrCode className="h-5 w-5" />
                  Pay with UPI
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-xs text-muted-foreground">
                Secure payments powered by RizzPay
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <UpiLinkPayment
        amount={parseFloat(amount)}
        merchantName={merchantName}
        upiId={upiId}
        description={description}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default UpiLinkPaymentPage;
