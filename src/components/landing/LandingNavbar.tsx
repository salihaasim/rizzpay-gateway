
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const LandingNavbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6 mx-auto">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="font-semibold text-xl text-primary flex items-center gap-1"
          >
            <CreditCard
              className="h-6 w-6"
              strokeWidth={1.5}
            />
            <span className="font-bold">RizzPay</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <Link to="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              How it Works
            </Link>
            <Link to="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>
          
          <Link to="/auth">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          
          <Link to="/auth">
            <Button size="sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
