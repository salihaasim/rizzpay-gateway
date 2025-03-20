
import React from 'react';
import { Transaction, PaymentProcessingState } from '@/stores/transactionStore';
import { getPaymentStateLabel } from './TransactionUtils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface PaymentProcessingFlowProps {
  transaction: Transaction;
}

const PaymentProcessingFlow: React.FC<PaymentProcessingFlowProps> = ({ transaction }) => {
  const timeline = transaction.processingTimeline || [];
  const processingState = transaction.processingState || 'initiated';
  
  const flowStages: PaymentProcessingState[] = [
    'initiated',
    'gateway_processing',
    'processor_routing',
    'card_network_processing',
    'bank_authorization',
    'authorization_decision'
  ];
  
  // After authorization, the flow branches
  const successStages: PaymentProcessingState[] = [
    'settlement_recording',
    'settlement_initiated',
    'settlement_processing',
    'funds_transferred',
    'merchant_credited',
    'completed'
  ];
  
  const failureStages: PaymentProcessingState[] = [
    'declined'
  ];

  const isCurrentOrCompleted = (stage: PaymentProcessingState) => {
    // For determining if a stage is active or passed
    if (transaction.status === 'failed' && stage === 'declined') {
      return true;
    }
    
    const allStages = [...flowStages, ...successStages];
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

  return (
    <div className="space-y-6 p-1">
      <div className="text-lg font-semibold mb-4">Payment Processing Flow</div>
      
      {/* Initial flow - common to all transactions */}
      <div className="space-y-4">
        {flowStages.map((stage, index) => (
          <div key={stage} className="relative">
            {index > 0 && (
              <div 
                className={`absolute left-3 top-0 h-full w-0.5 -translate-x-1/2 ${
                  isCurrentOrCompleted(stage) ? 'bg-primary' : 'bg-gray-200'
                }`} 
                style={{ top: '-1rem' }} 
              />
            )}
            
            <div className="flex items-start">
              <div 
                className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isCurrentOrCompleted(stage) 
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
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
                
                {stage === 'card_network_processing' && transaction.paymentDetails?.cardNetwork && (
                  <div className="mt-2 text-xs bg-muted p-2 rounded-md">
                    <span className="font-medium">Network:</span> {transaction.paymentDetails.cardNetwork}
                  </div>
                )}
                
                {stage === 'bank_authorization' && transaction.paymentDetails?.issuingBank && (
                  <div className="mt-2 text-xs bg-muted p-2 rounded-md">
                    <span className="font-medium">Issuing Bank:</span> {transaction.paymentDetails.issuingBank}
                  </div>
                )}
                
                {stage === 'authorization_decision' && transaction.paymentDetails?.authorizationCode && (
                  <div className="mt-2 text-xs bg-muted p-2 rounded-md">
                    <span className="font-medium">Auth Code:</span> {transaction.paymentDetails.authorizationCode}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Decision point - visual branch */}
        <div className="relative flex items-center">
          <div 
            className={`absolute left-3 top-0 h-full w-0.5 -translate-x-1/2 ${
              isCurrentOrCompleted('authorization_decision') ? 'bg-primary' : 'bg-gray-200'
            }`} 
            style={{ top: '-1rem', height: '1rem' }} 
          />
          
          <div 
            className={`h-8 w-8 rounded-md border ${
              isCurrentOrCompleted('authorization_decision') 
                ? 'border-primary text-primary' 
                : 'border-gray-200 text-gray-500'
            } flex items-center justify-center`}
          >
            ?
          </div>
          
          <div className="ml-4 font-medium">
            Approved?
          </div>
        </div>
      </div>
      
      {/* Branch in the flow - Success or Failure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Success branch */}
        <div className={`space-y-4 rounded-lg p-4 ${transaction.status === 'successful' || transaction.status === 'processing' ? 'border-green-200 bg-green-50/50' : 'bg-gray-50 opacity-50'}`}>
          <div className="font-semibold text-emerald-600">Settlement Process</div>
          {successStages.map((stage, index) => (
            <div key={stage} className="relative">
              {index > 0 && (
                <div 
                  className={`absolute left-3 top-0 h-full w-0.5 -translate-x-1/2 ${
                    isCurrentOrCompleted(stage) ? 'bg-emerald-500' : 'bg-gray-200'
                  }`} 
                  style={{ top: '-1rem' }} 
                />
              )}
              
              <div className="flex items-start">
                <div 
                  className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    isCurrentOrCompleted(stage) 
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {getPaymentStateLabel(stage)}
                      {processingState === stage && (
                        <Badge variant="outline" className="ml-2 text-xs bg-emerald-500/10 text-emerald-700 border-emerald-200">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimestamp(getStageTimestamp(stage))}
                    </div>
                  </div>
                  
                  <p className="mt-1 text-sm text-muted-foreground">{getStageMessage(stage)}</p>
                  
                  {/* Show specific details for settlement stages */}
                  {stage === 'settlement_recording' && transaction.paymentDetails?.settlementId && (
                    <div className="mt-2 text-xs bg-muted p-2 rounded-md">
                      <span className="font-medium">Settlement ID:</span> {transaction.paymentDetails.settlementId}
                    </div>
                  )}
                  
                  {stage === 'funds_transferred' && transaction.paymentDetails?.acquiringBank && (
                    <div className="mt-2 text-xs bg-muted p-2 rounded-md">
                      <span className="font-medium">Acquiring Bank:</span> {transaction.paymentDetails.acquiringBank}
                    </div>
                  )}
                  
                  {stage === 'merchant_credited' && transaction.paymentDetails?.processingFee && (
                    <div className="mt-2 text-xs bg-muted p-2 rounded-md">
                      <span className="font-medium">Processing Fee:</span> {transaction.paymentDetails.processingFee}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Failure branch */}
        <div className={`space-y-4 rounded-lg p-4 ${transaction.status === 'failed' ? 'border-rose-200 bg-rose-50/50' : 'bg-gray-50 opacity-50'}`}>
          <div className="font-semibold text-rose-600">Declined Transaction</div>
          {failureStages.map((stage, index) => (
            <div key={stage} className="relative">
              <div className="flex items-start">
                <div 
                  className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    isCurrentOrCompleted(stage) 
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {getPaymentStateLabel(stage)}
                      {processingState === stage && (
                        <Badge variant="outline" className="ml-2 text-xs bg-rose-500/10 text-rose-700 border-rose-200">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimestamp(getStageTimestamp(stage))}
                    </div>
                  </div>
                  
                  <p className="mt-1 text-sm text-muted-foreground">{getStageMessage(stage)}</p>
                  
                  {/* Show decline reason if available */}
                  {stage === 'declined' && transaction.paymentDetails?.declineReason && (
                    <div className="mt-2 text-xs bg-rose-100 p-2 rounded-md text-rose-700">
                      <span className="font-medium">Reason:</span> {transaction.paymentDetails.declineReason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessingFlow;
