import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, CreditCard, Globe } from 'lucide-react';

const features = [
  {
    title: 'Secure Payments',
    description: 'Bank-grade security with end-to-end encryption for all transactions',
    icon: Shield
  },
  {
    title: 'Fast Processing',
    description: 'Instant payment processing with real-time transaction updates',
    icon: Zap
  },
  {
    title: 'Multiple Payment Methods',
    description: 'Support for UPI, cards, net banking, and more',
    icon: CreditCard
  },
  {
    title: 'Global Reach',
    description: 'Accept payments from customers worldwide',
    icon: Globe
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose RizzPay?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the next generation of payment processing with our comprehensive suite of features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(FeaturesSection);
