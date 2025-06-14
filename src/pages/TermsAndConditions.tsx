
import React from 'react';
import { Card } from '@/components/ui/card';
import LandingNavbar from '@/components/landing/LandingNavbar';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: (
      <>
        <p>By accessing and using RizzPay's payment gateway services, you accept and agree to be bound by the terms and provisions of this agreement.</p>
        <p className="mt-2">RizzPay is a payment gateway service that facilitates secure online transactions between merchants and customers through various payment methods including UPI, cards, and bank transfers.</p>
      </>
    )
  },
  {
    title: "2. Service Description",
    body: (
      <>
        <p>RizzPay provides the following services:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Payment processing for e-commerce and digital services</li>
          <li>UPI payments and QR code generation</li>
          <li>Card payment processing (Credit/Debit)</li>
          <li>Bank transfer services (NEFT/IMPS/RTGS)</li>
          <li>Digital wallet functionality</li>
          <li>Merchant dashboard and analytics</li>
          <li>API integration for developers</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Merchant Obligations",
    body: (
      <>
        <p>As a merchant using RizzPay services, you agree to:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Provide accurate business information during registration</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Maintain the confidentiality of account credentials</li>
          <li>Respond to customer disputes and refund requests promptly</li>
          <li>Honor stated refund/return policies</li>
        </ul>
      </>
    )
  },
  {
    title: "4. Prohibited Activities",
    body: (
      <>
        <p>You may not use RizzPay for any of the following activities:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Illegal gambling or betting</li>
          <li>Sale of illegal items/services</li>
          <li>Money laundering or terrorist financing</li>
          <li>Fraud or deceptive practices</li>
          <li>Any activity that violates Indian or international law</li>
        </ul>
      </>
    )
  },
  {
    title: "5. Limitation of Liability & Modifications",
    body: (
      <>
        <p>RizzPay is not liable for indirect or consequential damages arising from service use. Terms may be revised at any time and your continued use constitutes acceptance of changes.</p>
        <p className="mt-2">These terms are governed by Indian law and subject to the courts of Chennai, Tamil Nadu.</p>
      </>
    )
  },
  {
    title: "6. Contact",
    body: (
      <>
        <ul className="pl-0 mt-2">
          <li>Email: rizzpay1@gmail.com</li>
          <li>Phone: +91 9080186106</li>
          <li>Phone: +91 7550248887</li>
          <li>WhatsApp: +91 9080186106</li>
          <li>Address: First Floor, 11/6, Ramanathan St, Mahalingapuram, Nungambakkam, Chennai, Tamil Nadu 600034</li>
        </ul>
      </>
    )
  }
];

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Terms & Conditions</h1>
        <div className="flex flex-col gap-8">
          {sections.map((section, idx) => (
            <Card key={section.title} className="p-6 rounded-xl border border-slate-300 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
              <div className="text-base text-muted-foreground">{section.body}</div>
            </Card>
          ))}
        </div>
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

