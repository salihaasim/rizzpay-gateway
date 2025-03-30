
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CreditCard, FileText, Shield } from "lucide-react";
import logoSvg from '../../assets/logo.svg';

const LandingNavbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6 mx-auto">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="font-semibold text-xl text-coinbase flex items-center gap-1"
          >
            <img src={logoSvg} alt="RizzPay Logo" className="h-6 w-6" />
            <span className="font-bold">RizzPay</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <Link to="#features" className="text-sm font-medium text-muted-foreground hover:text-coinbase transition-colors">
              Features
            </Link>
            <Link to="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-coinbase transition-colors">
              How it Works
            </Link>
            <Link to="/terms" className="text-sm font-medium text-muted-foreground hover:text-coinbase transition-colors flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Terms & Conditions
            </Link>
            <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-coinbase transition-colors flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              Admin Portal
            </Link>
          </nav>
          
          <Link to="/auth">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          
          <Link to="/auth">
            <Button size="sm" className="bg-coinbase text-white hover:bg-coinbase/90">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
