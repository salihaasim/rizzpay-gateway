
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Download, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const RefundPolicy = () => {
  const [isViewingPrintable, setIsViewingPrintable] = useState(false);
  
  const togglePrintableView = () => {
    setIsViewingPrintable(!isViewingPrintable);
  };
  
  const printDocument = () => {
    window.print();
  };
  
  const downloadPdf = () => {
    // In a real application, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };
  
  return (
    <>
      <Helmet>
        <title>Refund Policy | RizzPay</title>
      </Helmet>
      
      <div className={`min-h-screen bg-background ${isViewingPrintable ? 'p-8' : 'py-8'}`}>
        {!isViewingPrintable && (
          <header className="container mx-auto px-4 mb-8">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-primary hover:text-primary/90 flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={togglePrintableView}>
                  <Pin className="h-4 w-4 mr-2" />
                  Printable Version
                </Button>
                <Button variant="outline" size="sm" onClick={downloadPdf}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </header>
        )}
        
        <main className={`container mx-auto ${isViewingPrintable ? '' : 'px-4'} max-w-3xl`}>
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="mb-6 text-3xl font-bold">RizzPay Refund Policy</h1>
            <p className="text-muted-foreground mb-8">Effective Date: May 15, 2025</p>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Refund Eligibility and Processing</h2>
              <p>RizzPay is committed to providing a reliable and secure payment infrastructure. This Refund Policy outlines the terms and conditions under which refunds may be processed for payments made through our platform.</p>
              
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="font-medium">1.1 Merchant-Initiated Refunds</h3>
                  <p className="text-sm mt-2">Merchants using RizzPay can initiate refunds for transactions within 180 days of the original payment date. The refund will be processed through the same payment method used for the original transaction when technically feasible.</p>
                </div>
                
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="font-medium">1.2 Refund Processing Timeline</h3>
                  <p className="text-sm mt-2">Refund processing times vary based on the payment method:</p>
                  <ul className="list-disc list-inside text-sm mt-2">
                    <li>UPI Payments: 1-3 business days</li>
                    <li>Card Payments: 5-7 business days</li>
                    <li>Bank Transfers: 3-5 business days</li>
                  </ul>
                  <p className="text-sm mt-2">The actual credit to a customer's account depends on the policies of the issuing bank or payment provider.</p>
                </div>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Refund Limitations</h2>
              
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="font-medium">2.1 Transaction Fees</h3>
                  <p className="text-sm mt-2">RizzPay does not refund transaction fees for processed payments, even if the payment amount is subsequently refunded. The transaction fee covers the cost of payment processing services already rendered.</p>
                </div>
                
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="font-medium">2.2 Partial Refunds</h3>
                  <p className="text-sm mt-2">Merchants can process partial refunds through the RizzPay dashboard. Multiple partial refunds are supported as long as their sum does not exceed the original transaction amount.</p>
                </div>
                
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="font-medium">2.3 Refund Restrictions</h3>
                  <p className="text-sm mt-2">RizzPay reserves the right to restrict refunds in cases of:</p>
                  <ul className="list-disc list-inside text-sm mt-2">
                    <li>Suspected fraudulent activity</li>
                    <li>Violations of our Terms of Service</li>
                    <li>Regulatory or compliance requirements</li>
                    <li>Chargebacks already initiated for the transaction</li>
                  </ul>
                </div>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. Customer-Initiated Refund Requests</h2>
              <p>Customers should contact the merchant directly for refund requests. Merchants are responsible for handling refund requests according to their own refund policies.</p>
              
              <p className="mt-4">In exceptional circumstances where a merchant is unresponsive or unable to process a legitimate refund, customers may contact RizzPay customer support at rizzpay1@gmail.com with:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Transaction ID</li>
                <li>Payment date</li>
                <li>Merchant name</li>
                <li>Refund reason</li>
                <li>Evidence of attempts to contact the merchant</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Disputes and Chargebacks</h2>
              <p>If a customer initiates a chargeback with their bank or payment provider, the chargeback process will proceed according to the rules of the relevant card network or payment scheme. RizzPay will provide necessary transaction details to assist in resolving the dispute.</p>
              
              <div className="mt-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800 rounded-lg p-4">
                <h3 className="font-medium text-amber-800 dark:text-amber-400">Chargeback Fees</h3>
                <p className="text-sm mt-2 text-amber-700 dark:text-amber-300">Merchants are responsible for all chargeback fees imposed by payment processors. These fees are separate from and in addition to any refund of the transaction amount.</p>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Service Fees and Subscription Refunds</h2>
              
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="font-medium">5.1 Monthly/Annual Subscription Fees</h3>
                  <p className="text-sm mt-2">Subscription fees for RizzPay merchant services are refundable on a pro-rata basis if cancelled within the first 14 days of initial subscription. After this period, subscription fees are non-refundable for the current billing period.</p>
                </div>
                
                <div className="rounded-lg border p-4 bg-background">
                  <h3 className="font-medium">5.2 Setup and Integration Fees</h3>
                  <p className="text-sm mt-2">One-time setup and integration fees are non-refundable once the integration process has begun.</p>
                </div>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Policy Changes</h2>
              <p>RizzPay reserves the right to modify this Refund Policy at any time. Changes will be effective when posted on our website. For significant changes, we will provide notice through the merchant dashboard or via email.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">7. Contact Information</h2>
              <p>For questions regarding this Refund Policy, please contact our support team:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Email: rizzpay1@gmail.com</li>
                <li>Phone: +91-9080186106</li>
                <li>Address: RizzPay Headquarters, Chennai, India</li>
              </ul>
            </section>
          </article>
        </main>
        
        {isViewingPrintable && (
          <div className="fixed bottom-4 right-4 z-50 print:hidden">
            <div className="flex gap-2">
              <Button onClick={printDocument}>
                <Pin className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={togglePrintableView}>
                Exit Print View
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RefundPolicy;
