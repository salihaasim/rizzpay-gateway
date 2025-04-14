import React from 'react';
import { 
  QrCode, 
  CreditCard, 
  BanknoteIcon, 
  CheckCircle2 
} from 'lucide-react';

const StepCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => (
  <div className="flex items-start space-x-4 bg-background p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <QrCode className="h-6 w-6 text-primary" />,
      title: "Generate UPI QR",
      description: "Create instant UPI QR codes for seamless domestic payments."
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Multiple Payment Methods",
      description: "Accept payments via UPI, net banking, and Indian bank cards."
    },
    {
      icon: <BanknoteIcon className="h-6 w-6 text-primary" />,
      title: "Instant Settlements",
      description: "Receive funds instantly in your Indian bank account."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-secondary/20">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How Domestic Payments Work</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simplified payment processing tailored for the Indian market, 
            ensuring fast, secure, and hassle-free transactions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <StepCard 
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(HowItWorksSection);
