
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
            <p className="text-sm text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using RizzPay's payment gateway services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            
            <h2>2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of RizzPay's services per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
              <li>Attempt to decompile or reverse engineer any software contained on RizzPay's platform</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
            <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by RizzPay at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</p>
            
            <h2>3. Payment Processing Services</h2>
            <p>RizzPay provides payment processing services for legal transactions only. By using our services, you agree that:</p>
            <ul>
              <li>All transactions processed through our platform are legitimate and legal</li>
              <li>You will not use our services for any illegal activities, money laundering, or fraudulent transactions</li>
              <li>You understand that payment processing fees apply as outlined in our fee structure</li>
              <li>Chargebacks and disputes will be handled according to banking regulations and our dispute resolution process</li>
            </ul>
            
            <h2>4. Account Registration and Security</h2>
            <p>To access certain features of RizzPay, you must register for an account. You agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and accept all risks of unauthorized access</li>
              <li>Immediately notify us of any unauthorized use of your account</li>
            </ul>
            
            <h2>5. Merchant Obligations</h2>
            <p>As a merchant using RizzPay services, you agree to:</p>
            <ul>
              <li>Comply with all applicable laws and regulations</li>
              <li>Provide accurate product/service descriptions to customers</li>
              <li>Honor refund and return policies as stated to customers</li>
              <li>Maintain adequate customer service and support</li>
              <li>Complete KYC (Know Your Customer) verification when required</li>
            </ul>
            
            <h2>6. Prohibited Activities</h2>
            <p>You may not use RizzPay for any of the following prohibited activities:</p>
            <ul>
              <li>Illegal gambling or betting activities</li>
              <li>Sale of illegal drugs, weapons, or other prohibited items</li>
              <li>Money laundering or terrorist financing</li>
              <li>Fraudulent or deceptive practices</li>
              <li>Adult content or services (where prohibited by law)</li>
              <li>Any activity that violates local, state, or federal laws</li>
            </ul>
            
            <h2>7. Fees and Charges</h2>
            <p>RizzPay charges fees for processing payments. Current fee structure includes:</p>
            <ul>
              <li>Payment processing fees as disclosed during onboarding</li>
              <li>Settlement fees for fund transfers</li>
              <li>Chargeback fees when applicable</li>
              <li>Additional fees for premium services</li>
            </ul>
            <p>All fees are subject to change with appropriate notice to merchants.</p>
            
            <h2>8. Data Protection and Privacy</h2>
            <p>RizzPay is committed to protecting your privacy and personal data. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
            
            <h2>9. Dispute Resolution</h2>
            <p>In the event of disputes:</p>
            <ul>
              <li>Merchants and customers should first attempt to resolve disputes directly</li>
              <li>RizzPay will assist in dispute resolution when requested</li>
              <li>Chargebacks will be handled according to card network rules</li>
              <li>Legal disputes will be subject to arbitration in Chennai, Tamil Nadu</li>
            </ul>
            
            <h2>10. Service Availability</h2>
            <p>While we strive for 99.9% uptime, RizzPay does not guarantee uninterrupted service. We reserve the right to:</p>
            <ul>
              <li>Perform scheduled maintenance</li>
              <li>Make emergency repairs</li>
              <li>Suspend services for security reasons</li>
              <li>Terminate services with appropriate notice</li>
            </ul>
            
            <h2>11. Limitation of Liability</h2>
            <p>In no event shall RizzPay or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use RizzPay services, even if RizzPay or a RizzPay authorized representative has been notified orally or in writing of the possibility of such damage. Some jurisdictions do not allow the exclusion of implied warranties, so the above exclusion may not apply to you.</p>
            
            <h2>12. Indemnification</h2>
            <p>You agree to indemnify and hold harmless RizzPay, its officers, directors, employees, agents, and suppliers from any claim, demand, or damage, including reasonable attorneys' fees, asserted by any third party due to or arising out of your use of RizzPay services.</p>
            
            <h2>13. Modifications to Terms</h2>
            <p>RizzPay may revise these Terms of Service at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these Terms of Service.</p>
            
            <h2>14. Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.</p>
            
            <h2>15. Contact Information</h2>
            <p>For any questions about these Terms and Conditions, please contact us at:</p>
            <ul>
              <li>Email: rizzpay1@gmail.com</li>
              <li>Phone: +91 9080186106</li>
              <li>Phone: +91 7550248887</li>
              <li>WhatsApp: +91 9080186106</li>
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

export default TermsAndConditions;
