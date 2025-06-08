
import React from 'react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import RoleSectionWrapper from '@/components/landing/RoleSectionWrapper';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <RoleSectionWrapper />
      
      {/* Footer with Privacy Policy, Terms and Conditions, Refund Policy */}
      <footer className="bg-background py-12 border-t mt-auto">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <img src={logoSvg} alt="RizzPay Logo" className="h-8 w-8 mr-2" />
                <span className="font-bold text-xl bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                  RizzPay
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Secure, fast, and reliable payment processing for businesses of all sizes in India.
              </p>
              <div className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} RizzPay Payment Technologies. All rights reserved.
              </div>
            </div>

            {/* Legal Links */}
            <div className="md:col-span-1">
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <Link to="/terms" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
                <Link to="/privacy-policy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/refund-policy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </div>
            </div>

            {/* Product Links */}
            <div className="md:col-span-1">
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <Link to="/auth" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Merchant Login
                </Link>
                <Link to="/features" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
                <Link to="/developer" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  API Documentation
                </Link>
              </div>
            </div>

            {/* Support Links */}
            <div className="md:col-span-1">
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
                <Link to="/support" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
                <a href="mailto:support@rizzpay.com" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Email Support
                </a>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <div>
                <p>Licensed payment aggregator regulated by Reserve Bank of India</p>
              </div>
              <div className="flex gap-6 mt-4 md:mt-0">
                <span>🔒 256-bit SSL Encryption</span>
                <span>🛡️ PCI DSS Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
