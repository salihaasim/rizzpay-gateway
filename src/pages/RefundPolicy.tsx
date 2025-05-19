
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      
      <div className="container px-4 mx-auto py-12 flex-grow">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-8">
          <div className="flex items-center mb-6">
            <FileText className="h-6 w-6 mr-2 text-primary" />
            <h1 className="text-3xl font-bold">Refund Policy</h1>
          </div>
          
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          
          <div className="prose prose-blue max-w-none">
            <h2 className="text-xl font-semibold mb-4 mt-6">1. General Refund Terms</h2>
            <p className="text-muted-foreground mb-4">
              At RizzPay, we strive to ensure complete satisfaction with our payment processing services. This refund policy outlines the terms and conditions under which refunds may be issued for our services.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">2. Eligibility for Refunds</h2>
            <p className="text-muted-foreground mb-4">
              Refunds may be issued under the following circumstances:
            </p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              <li className="mb-2">Double-charging or processing errors that result in duplicate payments</li>
              <li className="mb-2">Services not delivered as described or technical failures within our system</li>
              <li className="mb-2">Unauthorized transactions that are reported promptly (within 48 hours)</li>
              <li className="mb-2">Subscription fees for the current billing period when cancellation is requested</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">3. Refund Process</h2>
            <p className="text-muted-foreground mb-4">
              To request a refund, merchants must:
            </p>
            <ol className="list-decimal pl-5 mb-4 text-muted-foreground">
              <li className="mb-2">Submit a refund request through their RizzPay dashboard or contact our support team</li>
              <li className="mb-2">Provide transaction details including the transaction ID, amount, and reason for the refund</li>
              <li className="mb-2">Allow up to 5-7 business days for the refund request to be reviewed</li>
            </ol>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">4. Refund Timeline</h2>
            <p className="text-muted-foreground mb-4">
              Once approved, refunds will be processed as follows:
            </p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              <li className="mb-2">Credit/Debit card refunds: 5-10 business days</li>
              <li className="mb-2">Bank transfers: 3-5 business days</li>
              <li className="mb-2">UPI refunds: 1-3 business days</li>
              <li className="mb-2">Wallet credits: Immediately or within 24 hours</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">5. Non-Refundable Items</h2>
            <p className="text-muted-foreground mb-4">
              The following items are generally not eligible for refunds:
            </p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              <li className="mb-2">Transaction fees for successfully processed payments</li>
              <li className="mb-2">Setup fees or integration charges once services have been provided</li>
              <li className="mb-2">Subscription fees for previous billing periods already utilized</li>
              <li className="mb-2">Custom development work that has been delivered as specified</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">6. Disputes and Chargebacks</h2>
            <p className="text-muted-foreground mb-4">
              In the case of customer-initiated chargebacks:
            </p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              <li className="mb-2">Merchants are responsible for responding to and managing customer disputes</li>
              <li className="mb-2">RizzPay will provide necessary transaction data to assist in dispute resolution</li>
              <li className="mb-2">Chargeback fees may apply as outlined in the merchant agreement</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">7. Modifications to This Policy</h2>
            <p className="text-muted-foreground mb-4">
              RizzPay reserves the right to modify this refund policy at any time. Changes will be effective immediately upon posting to our website. It is the responsibility of merchants to review this policy periodically for changes.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-6">8. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions regarding our refund policy, please contact our support team at:
            </p>
            <p className="text-muted-foreground mb-4">
              Email: support@rizzpay.com<br />
              Phone: +91-7550248887<br />
              Hours: Monday-Friday, 9 AM to 6 PM IST
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

export default RefundPolicy;
