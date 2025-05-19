
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      
      <div className="container px-4 mx-auto py-12 flex-grow">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-8">
          <div className="flex items-center mb-6">
            <FileText className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-3xl font-bold">Terms and Conditions</h1>
          </div>
          
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          
          <div className="prose prose-blue max-w-none">
            <h2 className="text-xl font-semibold mb-4 mt-6">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using RizzPay's payment gateway services, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">2. Service Description</h2>
            <p className="text-muted-foreground mb-4">
              RizzPay provides a secure payment gateway that enables merchants to accept digital payments through various methods including UPI, credit/debit cards, net banking, and other electronic payment systems. Our services include:
            </p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              <li className="mb-2">Payment processing and gateway services</li>
              <li className="mb-2">Merchant onboarding and verification</li>
              <li className="mb-2">Transaction management and reporting</li>
              <li className="mb-2">Settlement and disbursement services</li>
              <li className="mb-2">Anti-fraud protection and risk management</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">3. Pricing and Fees</h2>
            <p className="text-muted-foreground mb-4">
              RizzPay charges a standard fee of 1% per transaction for all payment processing services. This fee structure includes:
            </p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              <li className="mb-2">1% of transaction value for all incoming payments</li>
              <li className="mb-2">1% of transaction value for all outgoing payments or withdrawals</li>
              <li className="mb-2">No hidden charges or monthly maintenance fees</li>
              <li className="mb-2">Volume discounts may be negotiated for high-volume merchants</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">4. Account Registration</h2>
            <p className="text-muted-foreground mb-4">
              To use RizzPay services, merchants must register and create an account. During registration, you agree to:
            </p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              <li className="mb-2">Provide accurate, current, and complete information</li>
              <li className="mb-2">Maintain and update your information as needed</li>
              <li className="mb-2">Ensure the security of your account credentials</li>
              <li className="mb-2">Accept responsibility for all activities under your account</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">5. Compliance Requirements</h2>
            <p className="text-muted-foreground mb-4">
              Merchants using RizzPay services must comply with:
            </p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              <li className="mb-2">All applicable laws and regulations including KYC and AML requirements</li>
              <li className="mb-2">Payment Card Industry Data Security Standards (PCI DSS)</li>
              <li className="mb-2">Reserve Bank of India guidelines for payment processors</li>
              <li className="mb-2">RizzPay's acceptable use policies</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">6. Prohibited Activities</h2>
            <p className="text-muted-foreground mb-4">
              The following activities are strictly prohibited when using RizzPay services:
            </p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              <li className="mb-2">Processing payments for illegal goods or services</li>
              <li className="mb-2">Money laundering or financing of terrorist activities</li>
              <li className="mb-2">Fraudulent transactions or misrepresentation of products/services</li>
              <li className="mb-2">Violating intellectual property rights</li>
              <li className="mb-2">Processing transactions for high-risk industries without proper disclosure and approval</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">7. Data Privacy and Security</h2>
            <p className="text-muted-foreground mb-4">
              RizzPay is committed to protecting user data and maintaining the security of our payment system:
            </p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              <li className="mb-2">We implement industry-standard security measures including encryption</li>
              <li className="mb-2">User data is collected and processed in accordance with our Privacy Policy</li>
              <li className="mb-2">Merchants are required to maintain their own appropriate data security measures</li>
              <li className="mb-2">Any security breaches must be reported immediately to our security team</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">8. Service Availability and Support</h2>
            <p className="text-muted-foreground mb-4">
              While we strive to maintain high service availability:
            </p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              <li className="mb-2">RizzPay does not guarantee uninterrupted service availability</li>
              <li className="mb-2">We provide technical support during business hours</li>
              <li className="mb-2">Scheduled maintenance will be communicated in advance when possible</li>
              <li className="mb-2">Service level agreements may be available for enterprise customers</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">9. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              All content, features, and functionality of the RizzPay service are owned by RizzPay and protected by international copyright, trademark, and other intellectual property laws.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">10. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              To the maximum extent permitted by law, RizzPay shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">11. Indemnification</h2>
            <p className="text-muted-foreground mb-4">
              You agree to indemnify and hold harmless RizzPay and its officers, directors, employees, and agents from any claims, damages, liabilities, costs, or expenses arising from your use of the service or violation of these terms.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">12. Termination</h2>
            <p className="text-muted-foreground mb-4">
              RizzPay reserves the right to terminate or suspend your account and access to services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">13. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of RizzPay services after any changes indicates your acceptance of the modified terms.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">14. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">15. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these Terms and Conditions, please contact us at:
            </p>
            <p className="text-muted-foreground mb-4">
              Email: legal@rizzpay.com<br />
              Address: RizzPay Technologies Pvt. Ltd., Mumbai, India
            </p>
            
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Last updated: May 19, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
