
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const RefundPolicy: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Helmet>
        <title>Refund Policy | RizzPay</title>
        <meta name="description" content="RizzPay refund policy and terms" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight">Refund Policy</h1>
          <p className="text-muted-foreground mt-2">
            Version: 1.0, Effective Date: May 19, 2025
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This Refund Policy defines the conditions and procedures under which RizzPay ("we," "our," or "us") 
              handles refund requests from merchants and integrated partners using our digital payment infrastructure. 
              RizzPay operates as a technical service provider facilitating UPI and bank-based payments. We do not 
              directly handle end-user refunds. Refunds initiated by a merchant are governed by their own refund terms.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Eligibility for Refund</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Refunds through RizzPay may be initiated under the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-medium">Duplicate Payments:</span> A transaction was processed more than once due to technical or manual error.
              </li>
              <li>
                <span className="font-medium">Failed Transaction with Debit:</span> The transaction failed but funds were debited from the payer's account.
              </li>
              <li>
                <span className="font-medium">Technical Malfunction:</span> Infrastructure or API-level issues from RizzPay's side caused unintended settlement or routing.
              </li>
              <li>
                <span className="font-medium">Confirmed Fraud:</span> A transaction is found to be fraudulent following investigation or regulatory inquiry.
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Refund Request Procedure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To initiate a refund request, the merchant must:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Submit a refund request via email (support@rizzpay.co.in) or merchant dashboard.</li>
              <li>Include the following:
                <ul className="list-circle pl-6 mt-2 space-y-1">
                  <li>RizzPay Transaction ID</li>
                  <li>Merchant Order/Reference ID</li>
                  <li>Reason for Refund</li>
                  <li>Supporting Documentation (user complaints, screenshots, logs)</li>
                </ul>
              </li>
            </ul>
            
            <p className="font-medium mt-4">Internal Review:</p>
            <p>RizzPay will review the request within 2–5 business days and may request additional clarification.</p>
            
            <p className="font-medium mt-4">Decision Outcome:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><span className="font-medium">Approved:</span> Refund processed to the payer's original account via UPI or IMPS/NEFT.</li>
              <li><span className="font-medium">Declined:</span> Merchant receives written justification for denial.</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Refund Timelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>UPI-based refunds: 1–3 business days after approval</li>
              <li>Bank refunds (NEFT/IMPS): 2–5 business days</li>
              <li>Delays beyond 5 days may occur due to banking holidays, regulatory holds, or recipient bank policies.</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Merchant Obligations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintain adequate balances in settlement or escrow accounts to fund approved refunds.</li>
              <li>Ensure refund requests are initiated within 30 calendar days of the original transaction.</li>
              <li>RizzPay remains neutral in customer disputes unless compelled by law or regulatory order.</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Non-Refundable Scenarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              RizzPay will not facilitate refunds in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Legitimate, merchant-initiated orders with successful transaction logs.</li>
              <li>Transactions where the user explicitly consented and verified payment.</li>
              <li>Complaints based solely on user dissatisfaction or buyer's remorse.</li>
              <li>Transactions processed through third-party gateways or off-RizzPay infrastructure.</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Chargebacks & Compliance Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>RizzPay may withhold settlements or reverse funds upon receipt of chargebacks or regulatory orders (RBI, NPCI).</li>
              <li>Investigations may incur fees or penalties as per our merchant agreement.</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>8. Policy Modifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              This policy may be amended to align with regulatory changes, platform updates, or internal risk assessments. 
              Major revisions will be communicated at least 7 days in advance.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>9. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              For refund-related support:
            </p>
            <div className="space-y-1">
              <p><span className="font-medium">Email:</span> support@rizzpay.co.in</p>
              <p><span className="font-medium">Phone:</span> +91 1800-123-4567</p>
              <p><span className="font-medium">Registered Address:</span> RizzPay HQ, Mumbai, India</p>
            </div>
            
            <p className="mt-4 text-muted-foreground">
              This document is binding upon all merchants operating through RizzPay's infrastructure.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default React.memo(RefundPolicy);
