
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Printer, CreditCard, ArrowLeftRight, Clock } from 'lucide-react';

const RefundPolicy: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Refund Policy | RizzPay</title>
      </Helmet>
      
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">RizzPay Refund Policy</h1>
        
        <div className="mb-8 flex flex-wrap gap-4 text-sm justify-center">
          <span className="bg-primary/10 rounded-full px-4 py-1 text-primary">Version: 1.0</span>
          <span className="bg-primary/10 rounded-full px-4 py-1 text-primary">Effective Date: May 15, 2025</span>
        </div>
        
        <div className="mb-8 p-6 bg-card rounded-lg border shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Introduction</h2>
              <p className="text-muted-foreground">
                This Refund Policy defines the conditions and procedures under which RizzPay handles refund requests 
                from merchants and integrated partners using our digital payment infrastructure. RizzPay operates as a 
                technical service provider facilitating UPI and bank-based payments.
              </p>
            </div>
          </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="process" className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              <span>Refund Process</span>
            </TabsTrigger>
            <TabsTrigger value="timelines" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Timelines</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Eligibility for Refund</h2>
              <p>Refunds through RizzPay may be initiated under the following circumstances:</p>
              <ul className="list-none space-y-4 mt-4">
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
              </ul>
              
              <h2 className="text-xl font-semibold">Non-Refundable Scenarios</h2>
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
            </div>
          </TabsContent>
          
          <TabsContent value="process" className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Refund Request Procedure</h2>
              <p>To initiate a refund request, the merchant must:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Submit a refund request via email (rizzpay1@gmail.com) or merchant dashboard.</li>
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
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Merchant Obligations</h2>
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
            </div>
          </TabsContent>
          
          <TabsContent value="timelines" className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Refund Timelines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
            
              <h2 className="text-xl font-semibold">Chargebacks & Compliance Actions</h2>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-400 p-4 rounded-r-md mt-4">
                <p>RizzPay may withhold settlements or reverse funds upon receipt of chargebacks or regulatory orders (RBI, NPCI).</p>
                <p className="mt-2">Investigations may incur fees or penalties as per our merchant agreement.</p>
              </div>
            
              <h2 className="text-xl font-semibold">Policy Modifications</h2>
              <p>
                This policy may be amended to align with regulatory changes, platform updates, or internal risk assessments. 
                Major revisions will be communicated at least 7 days in advance.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-10 p-5 border-t">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="font-medium">Email</p>
                <p className="text-primary">rizzpay1@gmail.com</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="font-medium">Phone</p>
                <p className="text-primary">+91-9080186106</p>
              </div>
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="font-medium">Address</p>
                <p className="text-primary">RizzPay HQ, Chennai, India</p>
              </div>
            </div>
            <p className="text-center font-semibold mt-8 py-3 bg-primary/5 rounded-md border border-primary/10">
              This document is binding upon all merchants operating through RizzPay's infrastructure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
