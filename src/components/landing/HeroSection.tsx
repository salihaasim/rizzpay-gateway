
import React from 'react';
import { Button } from '@/components/ui/button';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { useTransactionStore } from '@/stores/transactionStore';
import TypewriterText from './TypewriterText';

const HeroSection = () => {
  const {
    isAuthenticated
  } = useMerchantAuth();
  const {
    userRole
  } = useTransactionStore();

  const businessTypes = [
    'E-commerce Stores',
    'B2B Businesses',
    'Digital Services',
    'Online Marketplaces',
    'SaaS Companies',
    'Content Creators',
    'Subscription Services'
  ];

  return <section className="relative w-full py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-background z-[-1]" />
      
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
            <span className="text-xs font-medium">Next-Gen Payment Solution</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Seamless Payments for Everyone
          </h1>
          
          <div className="text-lg text-muted-foreground mb-10 animate-fade-in md:text-xl font-semibold">
            <p className="mb-4">
              Rizzpay provides a secure, fast and reliable payment gateway for businesses and consumers.
            </p>
            <p className="mb-4">
              Perfect for{' '}
              <TypewriterText 
                words={businessTypes}
                typingSpeed={100}
                deletingSpeed={80}
                pauseDuration={2000}
                className="text-primary font-bold"
              />
            </p>
            <p>
              Integrate UPI, cards, and more with a single platform.
            </p>
          </div>
        </div>
      </div>
    </section>;
};

export default React.memo(HeroSection);
