
import React from 'react';
import { Transaction, PaymentProcessingState } from '@/stores/transactions/types';
import { getPaymentStateLabel } from './TransactionUtils';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Check, AlertCircle, Clock } from 'lucide-react';

interface PaymentProcessingFlowProps {
  transaction: Transaction;
}

const PaymentProcessingFlow: React.FC<PaymentProcessingFlowProps> = ({ transaction }) => {
  const timeline = transaction.processingTimeline || [];
  const processingState = transaction.processingState || 'initiated';
  
  // Simplified flow stages based on transaction status
  const mainFlowStages: PaymentProcessingState[] = [
    'initiated',
    'gateway_processing',
    'processor_routing',
    'authorization_decision'
  ];
  
  const getStageIcon = (stage: PaymentProcessingState) => {
    const isCurrentOrCompleted = isStageActiveOrComplete(stage);
    
    if (transaction.status === 'failed' && stage === processingState) {
      return <AlertCircle className="h-5 w-5 text-rose-500" />;
    }
    
    if (stage === processingState) {
      return <Clock className="h-5 w-5 text-blue-500" />;
    }
    
    if (isCurrentOrCompleted) {
      return <Check className="h-5 w-5 text-emerald-500" />;
    }
    
    return <div className="h-5 w-5 rounded-full border border-gray-200"></div>;
  };
  
  const isStageActiveOrComplete = (stage: PaymentProcessingState) => {
    const allStages = [...mainFlowStages];
    const currentIndex = allStages.indexOf(processingState);
    const stageIndex = allStages.indexOf(stage);
    
    return stageIndex <= currentIndex;
  };
  
  const getStageTimestamp = (stage: PaymentProcessingState) => {
    const stageEvent = timeline.find(event => event.stage === stage);
    if (stageEvent) {
      return new Date(stageEvent.timestamp);
    }
    return null;
  };
  
  const formatTimestamp = (timestamp: Date | null) => {
    if (!timestamp) return '';
    return format(timestamp, 'HH:mm:ss');
  };
  
  const getStageMessage = (stage: PaymentProcessingState) => {
    const stageEvent = timeline.find(event => event.stage === stage);
    return stageEvent?.message || '';
  };
  
  const renderFinalStatus = () => {
    if (transaction.status === 'successful') {
      return (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-emerald-500 mr-2" />
            <span className="font-medium text-emerald-700">Payment Successful</span>
          </div>
          {transaction.paymentDetails?.authorizationCode && (
            <div className="mt-2 text-sm text-emerald-600">
              Authorization Code: {transaction.paymentDetails.authorizationCode}
            </div>
          )}
        </div>
      );
    }
    
    if (transaction.status === 'failed' || transaction.status === 'declined') {
      return (
        <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-rose-500 mr-2" />
            <span className="font-medium text-rose-700">Payment Failed</span>
          </div>
          {transaction.paymentDetails?.declineReason && (
            <div className="mt-2 text-sm text-rose-600">
              Reason: {transaction.paymentDetails.declineReason}
            </div>
          )}
        </div>
      );
    }
    
    if (transaction.status === 'processing') {
      return (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium text-blue-700">Payment Processing</span>
          </div>
          <div className="mt-2 text-sm text-blue-600">
            Your payment is being processed. This may take a few moments.
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6 p-1">
      <div className="text-lg font-semibold mb-4">Payment Flow</div>
      
      <div className="space-y-4">
        {mainFlowStages.map((stage, index) => (
          <div key={stage} className="relative">
            {index > 0 && (
              <div 
                className={`absolute left-3 top-0 h-full w-0.5 -translate-x-1/2 ${
                  isStageActiveOrComplete(stage) ? 'bg-primary' : 'bg-gray-200'
                }`} 
                style={{ top: '-1rem' }} 
              />
            )}
            
            <div className="flex items-start">
              <div className="relative z-10 flex h-6 w-6 items-center justify-center">
                {getStageIcon(stage)}
              </div>
              
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {getPaymentStateLabel(stage)}
                    {processingState === stage && (
                      <Badge variant="outline" className="ml-2 text-xs bg-primary/10">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTimestamp(getStageTimestamp(stage))}
                  </div>
                </div>
                
                <p className="mt-1 text-sm text-muted-foreground">{getStageMessage(stage)}</p>
                
                {/* Show payment details for specific stages */}
                {stage === 'processor_routing' && transaction.paymentDetails?.processor && (
                  <div className="mt-2 text-xs bg-muted p-2 rounded-md">
                    <span className="font-medium">Processor:</span> {transaction.paymentDetails.processor}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {renderFinalStatus()}
    </div>
  );
};

export default PaymentProcessingFlow;
