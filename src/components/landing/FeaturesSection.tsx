
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, ShieldCheck, CreditCard, CheckCircle2 } from 'lucide-react';

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  benefits 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  benefits: string[]; 
}) => (
  <Card className="border-0 bg-gradient-to-b from-background to-secondary/20 shadow-md overflow-hidden card-hover">
    <CardContent className="p-6">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      <ul className="mt-4 space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
            {benefit}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Lightning Fast",
      description: "Process transactions in milliseconds with our optimized payment infrastructure.",
      benefits: ["Instant confirmations", "Low latency processing"]
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Bank-Grade Security",
      description: "End-to-end encryption and compliance with global security standards.",
      benefits: ["Data encryption", "Fraud protection"]
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Multiple Payment Options",
      description: "Support for UPI, credit cards, debit cards, and more payment methods.",
      benefits: ["All UPI apps supported", "International payments"]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Rizzpay?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our powerful platform is designed to meet the needs of merchants, 
            customers, and administrators with an intuitive interface.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              benefits={feature.benefits}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(FeaturesSection);
