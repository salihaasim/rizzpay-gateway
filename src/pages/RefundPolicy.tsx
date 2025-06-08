
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LandingNavbar from '@/components/landing/LandingNavbar';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Refund Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2>Refund Eligibility</h2>
            <p>Refunds are available for certain transactions processed through RizzPay, subject to the terms outlined below.</p>
            
            <h2>Processing Time</h2>
            <p>Refunds typically take 5-7 business days to process and appear in your account, depending on your bank or payment provider.</p>
            
            <h2>How to Request a Refund</h2>
            <p>To request a refund, please contact our support team with your transaction details:</p>
            <ul>
              <li>Email: rizzpay1@gmail.com</li>
              <li>Phone: +91 9080186106</li>
              <li>WhatsApp: +91 9080186106</li>
            </ul>
            
            <h2>Non-Refundable Items</h2>
            <p>Certain items and services may not be eligible for refunds, including but not limited to service fees and processing charges.</p>
            
            <h2>Contact Information</h2>
            <p>For any questions about refunds or this policy, please contact us:</p>
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

export default RefundPolicy;
