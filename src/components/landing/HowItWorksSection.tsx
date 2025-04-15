
import React from 'react';
import { 
  QrCode, 
  CreditCard, 
  BanknoteIcon, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { motion } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import HowItWorksDetailedSection from './HowItWorksDetailedSection';

const StepCard = ({ 
  icon, 
  title, 
  description,
  delay = 0
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay?: number;
}) => (
  <motion.div 
    className="flex items-start space-x-4 bg-background p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);

const HowItWorksSection = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: <QrCode className="h-6 w-6 text-primary" />,
      title: "Generate UPI QR",
      description: "Create instant UPI QR codes for seamless domestic payments.",
      delay: 0.1
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Multiple Payment Methods",
      description: "Accept payments via UPI, net banking, and Indian bank cards.",
      delay: 0.2
    },
    {
      icon: <BanknoteIcon className="h-6 w-6 text-primary" />,
      title: "Instant Settlements",
      description: "Receive funds instantly in your Indian bank account.",
      delay: 0.3
    }
  ];

  return (
    <>
      <section id="how-it-works" className="py-16 md:py-24 bg-secondary/20">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">How Domestic Payments Work</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simplified payment processing tailored for the Indian market, 
              ensuring fast, secure, and hassle-free transactions.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <StepCard 
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                delay={step.delay}
              />
            ))}
          </div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              onClick={() => navigate('/how-it-works-technical')} 
              className="group"
            >
              <span>Explore Technical Details</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </section>
      
      <HowItWorksDetailedSection />
    </>
  );
};

export default React.memo(HowItWorksSection);
