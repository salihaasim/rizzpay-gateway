
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import logoSvg from '../../assets/logo.svg';

const LandingNavbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6 mx-auto">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="font-semibold text-xl text-[#0052FF] flex items-center gap-1"
          >
            <img src={logoSvg} alt="RizzPay Logo" className="h-6 w-6" />
            <span className="font-bold">RizzPay</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-[#0052FF] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-[#0052FF] transition-colors">
              How it Works
            </a>
            <Link to="/terms" className="text-sm font-medium text-muted-foreground hover:text-[#0052FF] transition-colors flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Terms & Conditions
            </Link>
          </nav>
          
          <Link to="/auth">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          
          <Link to="/auth">
            <Button size="sm" className="bg-[#0052FF] text-white hover:bg-[#0045DB]">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default React.memo(LandingNavbar);
