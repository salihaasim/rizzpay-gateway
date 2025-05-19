
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Store } from 'lucide-react';

interface AuthHeaderProps {
  onBack: () => void;
}

const AuthHeader = ({ onBack }: AuthHeaderProps) => {
  return (
    <header className="w-full py-6 border-b bg-background">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mr-2">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              RizzPay
            </span>
          </div>
          <div></div>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
