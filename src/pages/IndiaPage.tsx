
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const IndiaPage = () => {
  return (
    <Layout>
      <div className="container max-w-4xl py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">RizzPay India</h1>
          <p className="text-muted-foreground mt-2">Payment Solutions for the Indian Market</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>RizzPay in India</CardTitle>
            <CardDescription>
              Powering digital payments across the subcontinent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              RizzPay offers comprehensive payment solutions tailored specifically for the Indian market, 
              integrating seamlessly with UPI, netbanking, and other popular local payment methods to provide 
              a frictionless experience for both merchants and customers.
            </p>
            <p>
              Our platform is fully compliant with RBI regulations and follows all necessary security protocols 
              to ensure safe and reliable transactions throughout India.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Local Payment Methods</CardTitle>
            <CardDescription>
              Support for India's diverse payment ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">UPI Payments</h3>
              <p>
                Unified Payments Interface (UPI) integration allows for instant bank transfers using 
                popular apps like PhonePe, Google Pay, and BHIM. Our platform supports both QR code 
                payments and direct UPI ID transfers.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Card Payments</h3>
              <p>
                Secure processing for all major debit and credit cards, including RuPay, Visa, and Mastercard, 
                with support for tokenization to enhance security and compliance with the latest RBI guidelines.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Netbanking</h3>
              <p>
                Direct integration with 100+ Indian banks for seamless netbanking transactions, allowing customers 
                to pay directly from their bank accounts without the need for cards or wallets.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">NEFT/RTGS/IMPS</h3>
              <p>
                Support for traditional bank transfer methods with automated reconciliation, making it easy for 
                businesses to track and verify payments made through these channels.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Regulatory Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>RizzPay maintains strict compliance with Indian financial regulations:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Reserve Bank of India (RBI) Payment Aggregator guidelines</li>
              <li>Information Technology Act, 2000</li>
              <li>Payment and Settlement Systems Act, 2007</li>
              <li>Personal Data Protection compliance</li>
              <li>Know Your Customer (KYC) and Anti-Money Laundering (AML) protocols</li>
              <li>Two-Factor Authentication requirements for card transactions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact RizzPay India</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p><strong>Corporate Office:</strong> RizzPay India Pvt. Ltd., 4th Floor, Salarpuria Tower, Koramangala, Bangalore 560034</p>
              <p><strong>Customer Support:</strong> +91-7550248887</p>
              <p><strong>Email:</strong> india@rizzpay.co.in</p>
              <p><strong>GST Number:</strong> 29AABCR1234Z1ZA</p>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              RizzPay India is a registered payment aggregator with the Reserve Bank of India.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default IndiaPage;
