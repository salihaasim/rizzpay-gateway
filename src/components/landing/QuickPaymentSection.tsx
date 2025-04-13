
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickPaymentSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 md:py-20 bg-primary/10">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Need to Make a Quick Payment?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            No account needed. Make secure payments instantly using the RizzPay gateway.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/payment')} 
            className="rounded-full px-8 shadow-md"
          >
            Make Payment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default React.memo(QuickPaymentSection);
