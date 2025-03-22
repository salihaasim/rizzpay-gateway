
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import { useTransactionStore } from '@/stores/transactionStore';
import PaymentPageError from '@/components/payment/PaymentPageError';
import PaymentPageDetails from '@/components/payment/PaymentPageDetails';
import PaymentPageLoading from '@/components/payment/PaymentPageLoading';

interface PaymentDetails {
  callbackUrl?: string;
  [key: string]: any;
}

const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const { addTransaction } = useTransactionStore();
  
  const transactionId = searchParams.get('id');
  
  useEffect(() => {
    if (!transactionId) {
      setError('Invalid payment request: Missing transaction ID');
      setLoading(false);
      return;
    }
    
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase()
          .from('transactions')
          .select('*, merchants(name, email)')
          .eq('id', transactionId)
          .single();
        
        if (error) {
          console.error('Error fetching transaction:', error);
          setError('Payment request not found or expired');
          setLoading(false);
          return;
        }
        
        if (!data) {
          setError('Payment request not found');
          setLoading(false);
          return;
        }
        
        const paymentDetails = data.payment_details as PaymentDetails | null;
        
        setPaymentData({
          transactionId: data.id,
          amount: data.amount,
          currency: data.currency || 'INR',
          description: data.description,
          merchant: data.merchants?.name || 'Merchant',
          merchantEmail: data.merchants?.email,
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          callbackUrl: paymentDetails?.callbackUrl,
          date: new Date(data.date).toLocaleString()
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading payment details:', err);
        setError('An error occurred while loading payment details');
        setLoading(false);
      }
    };
    
    fetchTransactionDetails();
  }, [transactionId]);
  
  if (loading) {
    return <PaymentPageLoading />;
  }
  
  if (error) {
    return <PaymentPageError error={error} navigateToHome={() => navigate('/')} />;
  }
  
  return (
    <PaymentPageDetails 
      paymentData={paymentData}
      transactionId={transactionId}
      addTransaction={addTransaction}
      navigate={navigate}
    />
  );
};

export default React.memo(PaymentPage);
