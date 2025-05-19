
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Refund Policy | RizzPay</title>
      </Helmet>
      
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none bg-card rounded-lg shadow-sm p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">RizzPay Refund Policy</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
            <p className="bg-primary/10 rounded-full px-3 py-1">Version: 1.0</p>
            <p className="bg-primary/10 rounded-full px-3 py-1">Effective Date: May 15, 2025</p>
          </div>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4 text-primary/90">1. Introduction</h2>
            <p className="text-foreground/90">
              This Refund Policy defines the conditions and procedures under which RizzPay ("we," "our," or "us") 
              handles refund requests from merchants and integrated partners using our digital payment infrastructure. 
              RizzPay operates as a technical service provider facilitating UPI and bank-based payments. 
              We do not directly handle end-user refunds. Refunds initiated by a merchant are governed by their own refund terms.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4 text-primary/90">2. Eligibility for Refund</h2>
            <p>Refunds through RizzPay may be initiated under the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></span>
                <div>
                  <strong className="text-primary/90">Duplicate Payments:</strong> A transaction was processed more than once due to technical or manual error.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></span>
                <div>
                  <strong className="text-primary/90">Failed Transaction with Debit:</strong> The transaction failed but funds were debited from the payer's account.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></span>
                <div>
                  <strong className="text-primary/90">Technical Malfunction:</strong> Infrastructure or API-level issues from RizzPay's side caused unintended settlement or routing.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-2 flex-shrink-0"></span>
                <div>
                  <strong className="text-primary/90">Confirmed Fraud:</strong> A transaction is found to be fraudulent following investigation or regulatory inquiry.
                </div>
              </li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4 text-primary/90">3. Refund Request Procedure</h2>
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
            
            <div className="bg-muted p-4 rounded-md mt-4">
              <p className="font-medium">Internal Review:</p>
              <p>RizzPay will review the request within 2–5 business days and may request additional clarification.</p>
            </div>
            
            <div className="mt-4">
              <p className="font-medium">Decision Outcome:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong className="text-green-600 dark:text-green-400">Approved:</strong> Refund processed to the payer's original account via UPI or IMPS/NEFT.</li>
                <li><strong className="text-red-600 dark:text-red-400">Declined:</strong> Merchant receives written justification for denial.</li>
              </ul>
            </div>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4 text-primary/90">4. Refund Timelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium">UPI-based refunds:</p>
                <p>1–3 business days after approval</p>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium">Bank refunds (NEFT/IMPS):</p>
                <p>2–5 business days</p>
              </div>
            </div>
            <p className="mt-4">Delays beyond 5 days may occur due to banking holidays, regulatory holds, or recipient bank policies.</p>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4 text-primary/90">5. Merchant Obligations</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                <div className="bg-primary/20 p-2 rounded-full text-primary">1</div>
                <div>Maintain adequate balances in settlement or escrow accounts to fund approved refunds.</div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                <div className="bg-primary/20 p-2 rounded-full text-primary">2</div>
                <div>Ensure refund requests are initiated within 30 calendar days of the original transaction.</div>
              </li>
              <li className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                <div className="bg-primary/20 p-2 rounded-full text-primary">3</div>
                <div>RizzPay remains neutral in customer disputes unless compelled by law or regulatory order.</div>
              </li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4 text-primary/90">6. Non-Refundable Scenarios</h2>
            <p>RizzPay will not facilitate refunds in the following cases:</p>
            <div className="mt-4 border border-muted rounded-lg overflow-hidden">
              <div className="bg-muted p-3 font-medium">Non-Refundable Cases</div>
              <ul className="divide-y divide-muted">
                <li className="p-3">Legitimate, merchant-initiated orders with successful transaction logs.</li>
                <li className="p-3">Transactions where the user explicitly consented and verified payment.</li>
                <li className="p-3">Complaints based solely on user dissatisfaction or buyer's remorse.</li>
                <li className="p-3">Transactions processed through third-party gateways or off-RizzPay infrastructure.</li>
              </ul>
            </div>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4 text-primary/90">7. Chargebacks & Compliance Actions</h2>
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-400 p-4 rounded-r-md">
              <p>RizzPay may withhold settlements or reverse funds upon receipt of chargebacks or regulatory orders (RBI, NPCI).</p>
              <p className="mt-2">Investigations may incur fees or penalties as per our merchant agreement.</p>
            </div>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4 text-primary/90">8. Policy Modifications</h2>
            <p>
              This policy may be amended to align with regulatory changes, platform updates, or internal risk assessments. 
              Major revisions will be communicated at least 7 days in advance.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4 text-primary/90">9. Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="font-medium">Email</p>
                <p className="text-primary">support@rizzpay.co.in</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="font-medium">Phone</p>
                <p className="text-primary">+91-9876543210</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="font-medium">Address</p>
                <p className="text-primary">RizzPay HQ, Mumbai, India</p>
              </div>
            </div>
          </section>
          
          <Separator className="my-6" />
          
          <p className="text-center font-semibold mt-8 py-3 bg-primary/5 rounded-md border border-primary/10">
            This document is binding upon all merchants operating through RizzPay's infrastructure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
