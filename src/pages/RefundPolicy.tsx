
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
            <p className="text-sm text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>Overview</h2>
            <p>At RizzPay, we understand that circumstances may arise where a refund is necessary. This Refund Policy outlines the terms and conditions under which refunds are processed for transactions made through our payment gateway platform.</p>
            
            <h2>Refund Eligibility</h2>
            <p>Refunds are available for certain transactions processed through RizzPay, subject to the following conditions:</p>
            <ul>
              <li>The refund request must be made within 30 days of the original transaction</li>
              <li>The transaction must be eligible for refund according to the merchant's refund policy</li>
              <li>Proper documentation and proof of transaction must be provided</li>
              <li>The refund request must be legitimate and not fraudulent in nature</li>
            </ul>
            
            <h2>Types of Refunds</h2>
            
            <h3>Full Refunds</h3>
            <p>Full refunds may be issued in the following circumstances:</p>
            <ul>
              <li>Product or service was not delivered as promised</li>
              <li>Technical error resulted in duplicate charges</li>
              <li>Merchant error in processing the transaction</li>
              <li>Fraudulent transaction (after proper verification)</li>
            </ul>
            
            <h3>Partial Refunds</h3>
            <p>Partial refunds may be considered for:</p>
            <ul>
              <li>Damaged goods that are partially usable</li>
              <li>Services that were partially rendered</li>
              <li>Returns that incur restocking fees</li>
            </ul>
            
            <h2>Non-Refundable Items and Services</h2>
            <p>Certain items and services may not be eligible for refunds, including but not limited to:</p>
            <ul>
              <li>RizzPay service fees and processing charges</li>
              <li>Digital products that have been downloaded or accessed</li>
              <li>Personalized or customized products</li>
              <li>Services that have been fully rendered</li>
              <li>Gift cards and vouchers (unless required by law)</li>
              <li>Subscription services after the cooling-off period</li>
            </ul>
            
            <h2>Refund Process</h2>
            
            <h3>Step 1: Contact the Merchant</h3>
            <p>Before contacting RizzPay, customers should first attempt to resolve the issue directly with the merchant. Many issues can be resolved quickly through direct communication.</p>
            
            <h3>Step 2: Submit Refund Request</h3>
            <p>If the issue cannot be resolved with the merchant, customers can submit a refund request to RizzPay by providing:</p>
            <ul>
              <li>Transaction ID or reference number</li>
              <li>Date and amount of transaction</li>
              <li>Detailed explanation of the refund request</li>
              <li>Supporting documentation (receipts, emails, etc.)</li>
              <li>Proof of attempted resolution with merchant</li>
            </ul>
            
            <h3>Step 3: Review and Investigation</h3>
            <p>RizzPay will review each refund request and may:</p>
            <ul>
              <li>Request additional documentation</li>
              <li>Contact the merchant for their response</li>
              <li>Investigate the transaction details</li>
              <li>Verify the legitimacy of the claim</li>
            </ul>
            
            <h2>Processing Time</h2>
            <p>Refund processing times vary depending on the payment method and financial institution:</p>
            <ul>
              <li><strong>Credit/Debit Cards:</strong> 5-10 business days after approval</li>
              <li><strong>UPI Transactions:</strong> 3-7 business days after approval</li>
              <li><strong>Net Banking:</strong> 5-10 business days after approval</li>
              <li><strong>Wallet Refunds:</strong> Instant to 24 hours after approval</li>
            </ul>
            <p>Please note that weekends and public holidays may extend processing times.</p>
            
            <h2>Chargeback Protection</h2>
            <p>RizzPay provides chargeback protection services for merchants. In case of chargebacks:</p>
            <ul>
              <li>We assist merchants in responding to chargeback claims</li>
              <li>We provide documentation and evidence to support legitimate transactions</li>
              <li>We work with banks and card networks to resolve disputes</li>
              <li>Merchants are notified immediately of any chargeback requests</li>
            </ul>
            
            <h2>Dispute Resolution</h2>
            <p>If a customer is not satisfied with the refund decision:</p>
            <ul>
              <li>They may escalate the issue to our senior support team</li>
              <li>An independent review of the case will be conducted</li>
              <li>Additional evidence may be requested from all parties</li>
              <li>Final decisions will be communicated within 15 business days</li>
            </ul>
            
            <h2>Fraudulent Refund Requests</h2>
            <p>RizzPay reserves the right to:</p>
            <ul>
              <li>Investigate suspicious refund requests</li>
              <li>Deny refunds for fraudulent claims</li>
              <li>Take legal action against fraudulent activities</li>
              <li>Report fraudulent behavior to relevant authorities</li>
            </ul>
            
            <h2>Merchant Responsibilities</h2>
            <p>Merchants using RizzPay services must:</p>
            <ul>
              <li>Clearly display their refund policy to customers</li>
              <li>Honor legitimate refund requests promptly</li>
              <li>Cooperate with RizzPay's refund investigations</li>
              <li>Maintain accurate transaction records</li>
              <li>Respond to customer complaints in a timely manner</li>
            </ul>
            
            <h2>How to Request a Refund</h2>
            <p>To request a refund, please contact our support team with your transaction details:</p>
            <ul>
              <li>Email: rizzpay1@gmail.com</li>
              <li>Phone: +91 9080186106</li>
              <li>Phone: +91 7550248887</li>
              <li>WhatsApp: +91 9080186106</li>
              <li>Live Chat: Available on merchant dashboard during business hours</li>
            </ul>
            
            <h2>Contact Information</h2>
            <p>For any questions about refunds or this policy, please contact us:</p>
            <ul>
              <li>Email: rizzpay1@gmail.com</li>
              <li>Phone: +91 9080186106</li>
              <li>Phone: +91 7550248887</li>
              <li>WhatsApp: +91 9080186106</li>
              <li>Address: First Floor, 11/6, Ramanathan St, Mahalingapuram, Nungambakkam, Chennai, Tamil Nadu 600034</li>
            </ul>
            
            <h2>Changes to This Policy</h2>
            <p>RizzPay reserves the right to update this Refund Policy at any time. Changes will be effective immediately upon posting to our website. Continued use of our services after changes constitutes acceptance of the revised policy.</p>
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
