
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LandingNavbar from '@/components/landing/LandingNavbar';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using RizzPay, you accept and agree to be bound by the terms and provision of this agreement.</p>
            
            <h2>2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of RizzPay per device for personal, non-commercial transitory viewing only.</p>
            
            <h2>3. Disclaimer</h2>
            <p>The materials on RizzPay are provided on an 'as is' basis. RizzPay makes no warranties, expressed or implied.</p>
            
            <h2>4. Limitations</h2>
            <p>In no event shall RizzPay or its suppliers be liable for any damages arising out of the use or inability to use the materials on RizzPay.</p>
            
            <h2>5. Contact Information</h2>
            <p>For any questions about these Terms and Conditions, please contact us at:</p>
            <ul>
              <li>Email: rizzpay1@gmail.com</li>
              <li>Phone: +91 9080186106</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <footer className="bg-background py-8 border-t mt-auto">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src={logoSvg} alt="RizzPay Logo" className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                RizzPay
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 md:gap-8 justify-center">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/refund-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Refund Policy
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
            
            <div className="text-sm text-muted-foreground mt-4 md:mt-0">
              © {new Date().getFullYear()} RizzPay. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
