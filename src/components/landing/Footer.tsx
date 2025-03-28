
import React from 'react';
import { CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background py-8 border-t mt-auto">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-2">
              <CreditCard className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <span className="font-bold text-xl bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
              RizzPay
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
            © {new Date().getFullYear()} RizzPay. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
