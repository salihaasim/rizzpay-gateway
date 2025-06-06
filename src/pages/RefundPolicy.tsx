
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Clock, CreditCard, RefreshCw } from 'lucide-react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';
import { Helmet } from 'react-helmet';

const RefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy | RizzPay</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <LandingNavbar />
        <div className="container mx-auto px-4 py-12 flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Refund Policy</h1>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2 text-primary" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  RizzPay is committed to providing excellent service to all merchants and customers. This refund policy outlines the circumstances under which refunds may be issued and the process for requesting them.
                </p>
                <p className="text-muted-foreground">
                  As a payment processor, most refunds are initiated by merchants for their customers. However, RizzPay also provides refunds for service-related issues.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-primary" />
                  Transaction Refunds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold">Customer-Initiated Refunds</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Customers should first contact the merchant for refund requests</li>
                  <li>Merchants can process refunds through their RizzPay dashboard</li>
                  <li>Refunds typically process within 3-7 business days</li>
                  <li>UPI refunds are usually instant to same-day</li>
                  <li>Card refunds may take 3-7 business days depending on the issuing bank</li>
                </ul>

                <h4 className="font-semibold mt-6">Technical Failure Refunds</h4>
                <p className="text-muted-foreground">
                  If a payment fails due to technical issues on RizzPay's end but the customer was charged, we will automatically initiate a refund within 24 hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-primary" />
                  Service Fee Refunds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h4 className="font-semibold">Eligible for Refund</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Service downtime exceeding our SLA (99.9% uptime)</li>
                  <li>Erroneous charges due to system errors</li>
                  <li>Double charging for the same transaction</li>
                  <li>Fraudulent transactions processed through compromised accounts</li>
                </ul>

                <h4 className="font-semibold mt-6">Not Eligible for Refund</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Standard transaction processing fees</li>
                  <li>Fees for successful transactions</li>
                  <li>Setup or onboarding fees</li>
                  <li>Chargebacks initiated by customers</li>
                  <li>Account closure or suspension due to policy violations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  Refund Process & Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">For Merchants</h4>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Log into your RizzPay dashboard</li>
                      <li>Navigate to Transactions section</li>
                      <li>Find the transaction to refund</li>
                      <li>Click "Initiate Refund"</li>
                      <li>Confirm refund amount and reason</li>
                      <li>Submit refund request</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">For Customers</h4>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li>Contact the merchant directly</li>
                      <li>If merchant is unresponsive, contact RizzPay support</li>
                      <li>Provide transaction ID and details</li>
                      <li>Our team will investigate</li>
                      <li>Resolution within 5-7 business days</li>
                    </ol>
                  </div>
                </div>

                <div className="bg-card border border-border p-4 rounded-lg mt-6">
                  <h4 className="font-semibold mb-2 text-foreground">Refund Timeline</h4>
                  <ul className="space-y-1 text-sm text-foreground">
                    <li><strong>UPI Refunds:</strong> Instant to 24 hours</li>
                    <li><strong>Card Refunds:</strong> 3-7 business days</li>
                    <li><strong>Bank Transfer Refunds:</strong> 2-5 business days</li>
                    <li><strong>Wallet Refunds:</strong> Instant</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  If you're not satisfied with our refund decision, you can escalate the matter:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Email our senior support team at disputes@rizzpay.com</li>
                  <li>Include all relevant transaction details and correspondence</li>
                  <li>We will review and respond within 10 business days</li>
                  <li>For unresolved disputes, contact banking ombudsman or consumer court</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  For refund requests or questions about this policy:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Email Support</h4>
                    <p className="text-muted-foreground">support@rizzpay.com</p>
                    <p className="text-muted-foreground">refunds@rizzpay.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Phone Support</h4>
                    <p className="text-muted-foreground">+91 75502 48887</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri: 9 AM - 6 PM IST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator className="my-8" />
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p>© {new Date().getFullYear()} RizzPay. All rights reserved.</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default RefundPolicy;
