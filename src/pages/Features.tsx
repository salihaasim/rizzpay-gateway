
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, CreditCard, Clock, Check, DollarSign } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Lightning Fast Processing",
      description: "Process up to 1,000 transactions per second with real-time confirmations"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Bank-Grade Security",
      description: "End-to-end encryption and compliance with Indian financial regulations"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      title: "Multiple Payment Options",
      description: "Support for UPI, credit cards, debit cards, and bank transfers"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "24/7 Processing",
      description: "Continuous operation with 99.99% uptime guarantee"
    },
    {
      icon: <Check className="h-8 w-8 text-primary" />,
      title: "Instant Settlement",
      description: "Same-day settlement for eligible merchants"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: "Competitive Pricing",
      description: "Low transaction fees starting at 1% for domestic payments"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            RizzPay Features
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the next generation of payment processing with our comprehensive suite of features
            designed for the Indian market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 bg-gradient-to-b from-background to-secondary/20 shadow-md overflow-hidden">
              <CardHeader className="space-y-0 pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
