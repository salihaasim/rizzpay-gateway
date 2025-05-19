
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Separator } from '@/components/ui/separator';

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Refund Policy | RizzPay</title>
      </Helmet>
      
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/" className="text-primary hover:underline flex items-center gap-2">
            <span>← Back to Home</span>
          </Link>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">RizzPay Refund Policy</h1>
          <p className="text-muted-foreground">Version: 1.0</p>
          <p className="text-muted-foreground">Effective Date: May 15, 2025</p>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              This Refund Policy defines the conditions and procedures under which RizzPay ("we," "our," or "us") 
              handles refund requests from merchants and integrated partners using our digital payment infrastructure. 
              RizzPay operates as a technical service provider facilitating UPI and bank-based payments. 
              We do not directly handle end-user refunds. Refunds initiated by a merchant are governed by their own refund terms.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">2. Eligibility for Refund</h2>
            <p>Refunds through RizzPay may be initiated under the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong>Duplicate Payments:</strong> A transaction was processed more than once due to technical or manual error.
              </li>
              <li>
                <strong>Failed Transaction with Debit:</strong> The transaction failed but funds were debited from the payer's account.
              </li>
              <li>
                <strong>Technical Malfunction:</strong> Infrastructure or API-level issues from RizzPay's side caused unintended settlement or routing.
              </li>
              <li>
                <strong>Confirmed Fraud:</strong> A transaction is found to be fraudulent following investigation or regulatory inquiry.
              </li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">3. Refund Request Procedure</h2>
            <p>To initiate a refund request, the merchant must:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Submit a refund request via email (support@rizzpay.co.in) or merchant dashboard.</li>
              <li>Include the following:
                <ul className="list-disc pl-6 mt-2">
                  <li>RizzPay Transaction ID</li>
                  <li>Merchant Order/Reference ID</li>
                  <li>Reason for Refund</li>
                  <li>Supporting Documentation (user complaints, screenshots, logs)</li>
                </ul>
              </li>
            </ul>
            
            <p className="mt-4"><strong>Internal Review:</strong> RizzPay will review the request within 2–5 business days and may request additional clarification.</p>
            
            <p className="mt-4"><strong>Decision Outcome:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Approved:</strong> Refund processed to the payer's original account via UPI or IMPS/NEFT.</li>
              <li><strong>Declined:</strong> Merchant receives written justification for denial.</li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">4. Refund Timelines</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>UPI-based refunds: 1–3 business days after approval</li>
              <li>Bank refunds (NEFT/IMPS): 2–5 business days</li>
              <li>Delays beyond 5 days may occur due to banking holidays, regulatory holds, or recipient bank policies.</li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">5. Merchant Obligations</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintain adequate balances in settlement or escrow accounts to fund approved refunds.</li>
              <li>Ensure refund requests are initiated within 30 calendar days of the original transaction.</li>
              <li>RizzPay remains neutral in customer disputes unless compelled by law or regulatory order.</li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">6. Non-Refundable Scenarios</h2>
            <p>RizzPay will not facilitate refunds in the following cases:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Legitimate, merchant-initiated orders with successful transaction logs.</li>
              <li>Transactions where the user explicitly consented and verified payment.</li>
              <li>Complaints based solely on user dissatisfaction or buyer's remorse.</li>
              <li>Transactions processed through third-party gateways or off-RizzPay infrastructure.</li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">7. Chargebacks & Compliance Actions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>RizzPay may withhold settlements or reverse funds upon receipt of chargebacks or regulatory orders (RBI, NPCI).</li>
              <li>Investigations may incur fees or penalties as per our merchant agreement.</li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">8. Policy Modifications</h2>
            <p>
              This policy may be amended to align with regulatory changes, platform updates, or internal risk assessments. 
              Major revisions will be communicated at least 7 days in advance.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
            <p>For refund-related support:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Email: support@rizzpay.co.in</li>
              <li>Phone: +91-9876543210</li>
              <li>Registered Address: RizzPay HQ, Mumbai, India</li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <p className="text-center font-semibold mt-8">
            This document is binding upon all merchants operating through RizzPay's infrastructure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
