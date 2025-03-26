
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StepItem = ({ 
  number, 
  title, 
  description, 
  showArrow = false 
}: { 
  number: number; 
  title: string; 
  description: string; 
  showArrow?: boolean;
}) => (
  <div className="relative">
    <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold mb-4">
      {number}
    </div>
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">
      {description}
    </p>
    {showArrow && (
      <ChevronRight className="h-6 w-6 text-primary absolute top-1/2 -right-4 transform -translate-y-1/2 hidden md:block" />
    )}
  </div>
);

const HowItWorksSection = () => {
  const navigate = useNavigate();
  const steps = [
    {
      title: "Create Account",
      description: "Sign up for a merchant account with simple verification process"
    },
    {
      title: "Integrate API",
      description: "Connect our payment gateway to your website or application"
    },
    {
      title: "Start Accepting Payments",
      description: "Begin processing payments and manage transactions in real-time"
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting started with Rizzpay is simple and straightforward
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <StepItem
              key={index}
              number={index + 1}
              title={step.title}
              description={step.description}
              showArrow={index < steps.length - 1}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button onClick={() => navigate('/auth')} className="rounded-lg">
            Create Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HowItWorksSection);
