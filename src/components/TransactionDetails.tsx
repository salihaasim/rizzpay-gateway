
import React from 'react';
import { Transaction } from '@/stores/transactionStore';
import { getStatusIndicatorClass } from './TransactionUtils';
import PaymentProcessingFlow from './PaymentProcessingFlow';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, CreditCard, User, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface TransactionDetailsProps {
  transaction: Transaction;
  onClose?: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onClose }) => {
  const navigate = useNavigate();

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'successful':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-rose-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-slate-500" />;
    }
  };

  const getStatusLabel = () => {
    switch (transaction.status) {
      case 'successful':
        return 'Successful';
      case 'processing':
        return 'Processing';
      case 'failed':
        return 'Failed';
      case 'pending':
        return 'Pending';
      default:
        return transaction.status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose || (() => navigate('/transactions'))}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center">
          {getStatusIcon()}
          <span className={`ml-2 font-medium ${
            transaction.status === 'successful' ? 'text-emerald-500' :
            transaction.status === 'processing' ? 'text-blue-500' :
            transaction.status === 'failed' ? 'text-rose-500' :
            transaction.status === 'pending' ? 'text-amber-500' : 
            'text-slate-500'
          }`}>
            {getStatusLabel()}
          </span>
        </div>
      </div>

      <div className="bg-secondary/50 rounded-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Transaction ID</div>
            <div className="font-medium">{transaction.id}</div>
          </div>
          
          <div className="bg-primary/10 text-primary rounded px-3 py-2 text-xl font-bold">
            {transaction.amount}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
            <div>
              <div className="text-xs text-muted-foreground">Date</div>
              <div className="font-medium">{transaction.date}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 text-muted-foreground mr-2" />
            <div>
              <div className="text-xs text-muted-foreground">Payment Method</div>
              <div className="font-medium">{transaction.paymentMethod}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <User className="h-4 w-4 text-muted-foreground mr-2" />
            <div>
              <div className="text-xs text-muted-foreground">Customer</div>
              <div className="font-medium">{transaction.customer}</div>
            </div>
          </div>
        </div>
      </div>
      
      <PaymentProcessingFlow transaction={transaction} />
      
      {/* Additional Payment Details Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">View Payment Details</Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {transaction.paymentDetails && Object.entries(transaction.paymentDetails).map(([key, value]) => (
              value && (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className="font-medium">{value}</span>
                </div>
              )
            ))}
            
            {(!transaction.paymentDetails || Object.keys(transaction.paymentDetails).length === 0) && (
              <div className="text-center text-muted-foreground py-4">
                No additional payment details available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionDetails;
