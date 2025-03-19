
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RoleSelector from '@/components/RoleSelector';
import { ArrowRight, CreditCard, ShieldCheck, Zap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 z-[-1]" />
        
        <div className="container px-4 py-16 md:py-24 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4 animate-fade-in">
              <span className="text-xs font-medium">Next-Gen Payment Solution</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
              Seamless Payments for Everyone
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in">
              Rizzpay provides a secure, fast and reliable payment gateway for businesses and consumers. 
              Integrate UPI, cards, and more with a single platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button size="lg" className="rounded-full px-8 shadow-md" onClick={() => navigate('/dashboard')}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
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
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Process transactions in milliseconds with our optimized payment infrastructure.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Bank-Grade Security</h3>
              <p className="text-muted-foreground">
                End-to-end encryption and compliance with global security standards.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Multiple Payment Options</h3>
              <p className="text-muted-foreground">
                Support for UPI, credit cards, debit cards, and more payment methods.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Role Selection Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Role</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're managing a business, processing transactions, or making payments,
              Rizzpay has the right interface for you.
            </p>
          </div>
          
          <RoleSelector />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary/80 py-8 mt-auto">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="bg-primary text-primary-foreground p-2 rounded-md mr-2">
                <CreditCard size={20} />
              </span>
              <span className="font-bold text-xl">Rizzpay</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Rizzpay. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
