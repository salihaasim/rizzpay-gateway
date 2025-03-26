import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RoleSelector from '@/components/RoleSelector';
import { ArrowRight, CreditCard, ShieldCheck, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
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
              <Button size="lg" className="rounded-full px-8 shadow-md" onClick={() => navigate('/dashboard')}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8"
                onClick={() => navigate('/quick-payment')}
              >
                Make a Payment
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
            <Card className="border-0 bg-gradient-to-b from-background to-secondary/20 shadow-md overflow-hidden card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Process transactions in milliseconds with our optimized payment infrastructure.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Instant confirmations
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Low latency processing
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-b from-background to-secondary/20 shadow-md overflow-hidden card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Bank-Grade Security</h3>
                <p className="text-muted-foreground">
                  End-to-end encryption and compliance with global security standards.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Data encryption
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    Fraud protection
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-b from-background to-secondary/20 shadow-md overflow-hidden card-hover">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Multiple Payment Options</h3>
                <p className="text-muted-foreground">
                  Support for UPI, credit cards, debit cards, and more payment methods.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    All UPI apps supported
                  </li>
                  <li className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                    International payments
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started with Rizzpay is simple and straightforward
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="relative">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-medium mb-2">Create Account</h3>
              <p className="text-muted-foreground">
                Sign up for a merchant account with simple verification process
              </p>
              <ChevronRight className="h-6 w-6 text-primary absolute top-1/2 -right-4 transform -translate-y-1/2 hidden md:block" />
            </div>
            
            <div className="relative">
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-medium mb-2">Integrate API</h3>
              <p className="text-muted-foreground">
                Connect our payment gateway to your website or application
              </p>
              <ChevronRight className="h-6 w-6 text-primary absolute top-1/2 -right-4 transform -translate-y-1/2 hidden md:block" />
            </div>
            
            <div>
              <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-medium mb-2">Start Accepting Payments</h3>
              <p className="text-muted-foreground">
                Begin processing payments and manage transactions in real-time
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button onClick={() => navigate('/auth')} className="rounded-lg">
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Role Selection Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
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
      
      {/* Quick Payment Section */}
      <section className="py-16 md:py-20 bg-secondary/20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Need to Make a Quick Payment?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              No account needed. Make secure payments instantly using our payment gateway.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/quick-payment')} 
              className="rounded-full px-8 shadow-md"
            >
              Quick Payment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background py-8 border-t mt-auto">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-2">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                Rizzpay
              </span>
            </div>
            
            <div className="flex gap-8">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </a>
            </div>
            
            <div className="text-sm text-muted-foreground mt-4 md:mt-0">
              © {new Date().getFullYear()} Rizzpay. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
