
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';
import { Helmet } from 'react-helmet';

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | RizzPay</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <LandingNavbar />
        <div className="container mx-auto px-4 py-12 flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Terms & Conditions</h1>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  By accessing and using RizzPay's payment processing services, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <p className="text-muted-foreground">
                  RizzPay is a payment gateway service that facilitates secure online transactions between merchants and customers through various payment methods including UPI, cards, and bank transfers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Service Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  RizzPay provides the following services:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Payment processing for e-commerce and digital services</li>
                  <li>UPI payments and QR code generation</li>
                  <li>Card payment processing (Credit/Debit)</li>
                  <li>Bank transfer services (NEFT/IMPS/RTGS)</li>
                  <li>Digital wallet functionality</li>
                  <li>Merchant dashboard and analytics</li>
                  <li>API integration for developers</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Merchant Obligations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  As a merchant using RizzPay services, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Provide accurate business information during registration</li>
                  <li>Complete KYC verification as required by regulations</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Use the service only for legitimate business purposes</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not engage in fraudulent or illegal activities</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Payment Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>Transaction Fees:</strong> RizzPay charges a processing fee for each transaction. Current rates are:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Deposits via UPI & Bank Transfer: 2% fee</li>
                  <li>Withdrawals via Bank Transfer: 1% fee</li>
                  <li>Card payments: As per card network rates</li>
                </ul>
                <p className="text-muted-foreground">
                  <strong>Settlement:</strong> Funds are typically settled within 1-3 business days, subject to verification and compliance checks.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Prohibited Activities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The following activities are strictly prohibited:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Money laundering or terrorist financing</li>
                  <li>Sale of illegal goods or services</li>
                  <li>Gambling or betting (unless licensed)</li>
                  <li>Adult content or services</li>
                  <li>Cryptocurrency trading (unless compliant)</li>
                  <li>Fraudulent transactions or chargebacks</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Data Protection & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  RizzPay is committed to protecting your data and privacy. We comply with:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Reserve Bank of India (RBI) guidelines</li>
                  <li>Payment Card Industry Data Security Standard (PCI DSS)</li>
                  <li>Information Technology Act, 2000</li>
                  <li>Personal Data Protection Act (when applicable)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  RizzPay shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
                <p className="text-muted-foreground">
                  Our total liability shall not exceed the total amount of fees paid by you to RizzPay in the 12 months preceding the claim.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Either party may terminate this agreement with 30 days written notice. RizzPay reserves the right to suspend or terminate accounts immediately for violation of these terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Governing Law</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Chennai, Tamil Nadu.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  For questions about these Terms & Conditions, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Email:</strong> legal@rizzpay.com</p>
                  <p><strong>Phone:</strong> +91 75502 48887</p>
                  <p><strong>Address:</strong> First Floor, 11/6, Ramanathan St, Mahalingapuram, Nungambakkam, Chennai, Tamil Nadu 600034</p>
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

export default TermsAndConditions;
