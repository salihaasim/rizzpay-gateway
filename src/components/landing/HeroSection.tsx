import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { useTransactionStore } from '@/stores/transactionStore';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useMerchantAuth();
  const { userRole } = useTransactionStore();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="relative w-full py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-background z-[-1]" />
      
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
            <span className="text-xs font-medium">Next-Gen Payment Solution</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Seamless Payments for Everyone
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 animate-fade-in">
            Rizzpay provides a secure, fast and reliable payment gateway for businesses and consumers. 
            Integrate UPI, cards, and more with a single platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button size="lg" className="rounded-full px-8 shadow-md" onClick={handleGetStarted}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);
