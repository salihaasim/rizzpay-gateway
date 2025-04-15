
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, ShieldCheck, CreditCard, CheckCircle2, Globe, Clock, ServerCrash, Wallet, Code } from 'lucide-react';
import { motion } from '@/components/ui/motion';

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  benefits,
  delay = 0
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  benefits: string[];
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
  >
    <Card className="border-0 bg-gradient-to-b from-background to-secondary/20 shadow-md overflow-hidden card-hover h-full">
      <CardContent className="p-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <ul className="mt-4 space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </motion.div>
);

const Stats = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mb-16">
    {[
      { value: "99.99%", label: "Uptime" },
      { value: "1000+", label: "Transactions/sec" },
      { value: "24/7", label: "Support" },
      { value: "150+", label: "Integrations" }
    ].map((stat, index) => (
      <motion.div 
        key={index}
        className="text-center p-4 bg-secondary/30 rounded-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
        <div className="text-sm text-muted-foreground">{stat.label}</div>
      </motion.div>
    ))}
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Lightning Fast Payments",
      description: "Process Indian rupee transactions instantly with our optimized payment infrastructure.",
      benefits: ["Instant UPI confirmations", "Low-cost domestic transfers", "Real-time notification system"],
      delay: 0.1
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Bank-Grade Security",
      description: "End-to-end encryption and compliance with Indian financial regulations.",
      benefits: ["RBI compliant", "Fraud protection", "Multi-factor authentication"],
      delay: 0.2
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Multiple Payment Options",
      description: "Support for UPI, credit cards, debit cards, and Indian bank transfers.",
      benefits: ["All major UPI apps", "Instant bank transfers", "Seamless card processing"],
      delay: 0.3
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Multi-Platform Integration",
      description: "Integrate RizzPay with virtually any platform or programming language.",
      benefits: ["PHP, Node.js, Python support", "WordPress plugins", "Custom API access"],
      delay: 0.4
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Quick Settlement",
      description: "Get your funds transferred to your bank account quickly and reliably.",
      benefits: ["Same-day settlements", "Automated reconciliation", "Detailed transaction reports"],
      delay: 0.5
    },
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "Developer Friendly",
      description: "Comprehensive documentation and tools for seamless integration.",
      benefits: ["Well-documented APIs", "Sandbox testing", "Code examples in multiple languages"],
      delay: 0.6
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Why Businesses Choose RizzPay</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our powerful platform is designed to meet the needs of Indian merchants, 
            customers, and businesses with an intuitive payment solution.
          </p>
        </motion.div>
        
        <Stats />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              benefits={feature.benefits}
              delay={feature.delay}
            />
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
            <span className="text-xs font-medium">Ready to get started?</span>
          </div>
          <h3 className="text-2xl font-bold mb-6">Join 10,000+ businesses already using RizzPay</h3>
          <a href="/auth" className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Create Free Account
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(FeaturesSection);
