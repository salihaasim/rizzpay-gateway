
import React from 'react';
import { Card } from '@/components/ui/card';
import LandingNavbar from '@/components/landing/LandingNavbar';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';
import { FileText, RefreshCw, Info } from 'lucide-react';

const sections = [
  {
    icon: <RefreshCw className="inline-block w-5 h-5 mr-2 text-blue-500" />,
    title: "Overview",
    body: (
      <>
        <p>RizzPay is committed to providing excellent service to all merchants and customers. This refund policy outlines the circumstances under which refunds may be issued and the process for requesting them.</p>
        <p className="mt-2">As a payment processor, most refunds are initiated by merchants for their customers. However, RizzPay also provides refunds for service-related issues.</p>
      </>
    )
  },
  {
    icon: <FileText className="inline-block w-5 h-5 mr-2 text-blue-500" />,
    title: "Transaction Refunds",
    body: (
      <>
        <strong>Customer-Initiated Refunds</strong>
        <ul className="list-disc pl-6 mt-1 space-y-1">
          <li>Customers should first contact the merchant for refund requests</li>
          <li>Merchants can process refunds through their RizzPay dashboard</li>
          <li>Refunds typically process within 3-7 business days</li>
          <li>UPI refunds are usually instant to same-day</li>
          <li>Card refunds may take 3-7 business days depending on the issuing bank</li>
        </ul>
        <strong className="block mt-4">Technical Failure Refunds</strong>
        <p className="mt-1">If a payment fails due to technical issues on RizzPay's end but the customer was charged, we will automatically initiate a refund within 24 hours.</p>
      </>
    )
  },
  {
    icon: <Info className="inline-block w-5 h-5 mr-2 text-blue-500" />,
    title: "Service Fee Refunds",
    body: (
      <>
        <strong>Eligible for Refund</strong>
        <ul className="list-disc pl-6 mt-1 space-y-1">
          <li>Service downtime exceeding our SLA (99.9% uptime)</li>
          <li>Erroneous deduction due to system errors</li>
        </ul>
        <strong className="block mt-4">Not Eligible for Refund</strong>
        <ul className="list-disc pl-6 mt-1 space-y-1">
          <li>Refunds on service fees for completed transactions</li>
          <li>Custom integrations after work is delivered</li>
        </ul>
      </>
    )
  },
  {
    icon: <FileText className="inline-block w-5 h-5 mr-2 text-blue-500" />,
    title: "Refund Request Process",
    body: (
      <>
        <ol className="list-decimal pl-6 mt-1 space-y-1">
          <li>Contact the merchant first for most transaction-related refunds</li>
          <li>If merchant assistance is insufficient, contact RizzPay support (<span className="break-all">rizzpay1@gmail.com</span> / +91 9080186106)</li>
          <li>Provide all required information (transaction ID, date, amount, reason, and proof)</li>
          <li>RizzPay will investigate and coordinate with merchants where needed</li>
        </ol>
      </>
    )
  },
  {
    icon: <Info className="inline-block w-5 h-5 mr-2 text-blue-500" />,
    title: "Processing Timelines",
    body: (
      <>
        <ul className="list-disc pl-6 mt-1 space-y-1">
          <li><strong>UPI:</strong> Instant to 1 business day</li>
          <li><strong>Card:</strong> 3-7 business days</li>
          <li><strong>Net Banking:</strong> 3-7 business days</li>
        </ul>
      </>
    )
  },
  {
    icon: <FileText className="inline-block w-5 h-5 mr-2 text-blue-500" />,
    title: "Contact & Support",
    body: (
      <>
        <p>For refund requests or questions:</p>
        <ul className="pl-0 mt-2">
          <li>Email: rizzpay1@gmail.com</li>
          <li>Phone: +91 9080186106</li>
          <li>Phone: +91 7550248887</li>
          <li>WhatsApp: +91 9080186106</li>
        </ul>
        <p className="mt-1">Address: First Floor, 11/6, Ramanathan St, Mahalingapuram, Nungambakkam, Chennai, Tamil Nadu 600034</p>
      </>
    )
  }
];

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Refund Policy</h1>
        <div className="flex flex-col gap-8">
          {sections.map((section, idx) => (
            <Card key={section.title} className="p-6 rounded-xl border border-slate-300 shadow-sm">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                {section.icon}{section.title}
              </h2>
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

export default RefundPolicy;

