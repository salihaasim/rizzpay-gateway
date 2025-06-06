
import React from 'react';
import { Loader2, QrCode, IndianRupee, ArrowRightLeft, Server } from 'lucide-react';

const PaymentPageLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      {/* Main loading animation with INR symbol */}
      <div className="flex items-center justify-center relative">
        <div className="absolute animate-ping opacity-75">
          <IndianRupee className="h-10 w-10 text-[#0052FF]" />
        </div>
        <div className="relative flex gap-3 items-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#0052FF]" />
          <QrCode className="h-10 w-10 text-muted-foreground animate-pulse" />
        </div>
      </div>
      
      {/* Advanced server-to-server transfer animation */}
      <div className="relative w-80 h-20 flex items-center justify-between">
        {/* Source Server */}
        <div className="flex flex-col items-center">
          <div className="relative p-3 bg-green-100 rounded-lg animate-pulse">
            <Server className="h-8 w-8 text-green-600" />
            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
              ₹
            </div>
          </div>
          <span className="text-xs text-muted-foreground mt-1">Your Bank</span>
        </div>
        
        {/* Transfer Animation Path */}
        <div className="flex-1 relative mx-4">
          {/* Background transfer line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-[#0052FF]/30 to-blue-200 transform -translate-y-1/2"></div>
          
          {/* Animated rupee symbols moving across */}
          <div className="absolute top-1/2 transform -translate-y-1/2 w-full">
            {/* First rupee symbol */}
            <div className="absolute left-0 w-6 h-6 bg-[#0052FF] text-white text-xs rounded-full flex items-center justify-center animate-[slide-right_2s_linear_infinite]">
              ₹
            </div>
            
            {/* Second rupee symbol (delayed) */}
            <div className="absolute left-0 w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center animate-[slide-right_2s_linear_infinite_0.7s]">
              ₹
            </div>
            
            {/* Third rupee symbol (more delayed) */}
            <div className="absolute left-0 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center animate-[slide-right_2s_linear_infinite_1.4s]">
              ₹
            </div>
          </div>
          
          {/* Pulsing dots indicating data flow */}
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-[#0052FF] rounded-full animate-ping transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-500 rounded-full animate-ping transform -translate-y-1/2 animation-delay-500"></div>
          <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-orange-500 rounded-full animate-ping transform -translate-y-1/2 animation-delay-1000"></div>
        </div>
        
        {/* Destination Server */}
        <div className="flex flex-col items-center">
          <div className="relative p-3 bg-blue-100 rounded-lg animate-pulse">
            <Server className="h-8 w-8 text-[#0052FF]" />
            <div className="absolute -top-1 -right-1 bg-[#0052FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce animation-delay-500">
              ₹
            </div>
          </div>
          <span className="text-xs text-muted-foreground mt-1">RizzPay</span>
        </div>
      </div>
      
      {/* Enhanced money transfer status */}
      <div className="flex items-center justify-center mt-2 mb-2">
        <div className="flex items-center gap-3 bg-gradient-to-r from-[#0052FF]/10 via-green-50 to-orange-50 rounded-lg px-4 py-3 border border-[#0052FF]/20">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-green-600">₹</span>
            <ArrowRightLeft className="h-4 w-4 text-[#0052FF] animate-pulse" />
            <span className="text-sm font-medium text-[#0052FF]">₹</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <span className="text-xs font-medium text-gray-600">Secure Transfer</span>
        </div>
      </div>
      
      {/* Status messages */}
      <div className="text-center space-y-2">
        <p className="text-muted-foreground font-medium">Processing INR payment...</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Establishing secure connection...</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-[#0052FF] rounded-full animate-pulse animation-delay-300"></div>
            <span>Verifying transaction details...</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse animation-delay-600"></div>
            <span>Processing with bank servers...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(PaymentPageLoading);
