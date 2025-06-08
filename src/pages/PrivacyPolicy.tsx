
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LandingNavbar from '@/components/landing/LandingNavbar';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, make a payment, or contact us for support.</p>
            
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
            
            <h2>Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
            
            <h2>Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            
            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <ul>
              <li>Email: rizzpay1@gmail.com</li>
              <li>Phone: +91 9080186106</li>
              <li>Address: First Floor, 11/6, Ramanathan St, Mahalingapuram, Nungambakkam, Chennai, Tamil Nadu 600034</li>
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

export default PrivacyPolicy;
