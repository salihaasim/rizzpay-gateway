
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container max-w-4xl py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">RizzPay Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: May 16, 2025</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
            <CardDescription>
              How we handle your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              At RizzPay, we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our payment gateway services.
            </p>
            <p>
              By using RizzPay's services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
            <CardDescription>
              Types of data we process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p>
                We collect information that you provide directly to us when registering for an account, conducting transactions, or communicating with us. This may include:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Name and contact information</li>
                <li>Business details</li>
                <li>Bank account information</li>
                <li>Government-issued identification</li>
                <li>Login credentials</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Transaction Information</h3>
              <p>
                We collect details about the payments you process through our platform, including:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Transaction amounts and dates</li>
                <li>Payment methods used</li>
                <li>Merchant and customer identifiers</li>
                <li>Device information</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Log Data and Analytics</h3>
              <p>
                Our servers automatically record information when you use our services:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>IP address</li>
                <li>Browser type and settings</li>
                <li>Date and time of access</li>
                <li>Usage patterns and interactions</li>
                <li>Device information</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use the information we collect for various purposes, including:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Processing payments and transfers</li>
              <li>Providing customer support</li>
              <li>Improving our services</li>
              <li>Complying with legal obligations</li>
              <li>Preventing fraud and unauthorized activities</li>
              <li>Communicating with you about account updates, security alerts, and promotional offers (with your consent)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              RizzPay implements strong security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>End-to-end encryption for all transactions</li>
              <li>PCI-DSS compliance for payment data</li>
              <li>Regular security audits and testing</li>
              <li>Restricted access controls for employees</li>
              <li>Secure data storage and transmission</li>
            </ul>
            <p className="mt-4">
              While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions or concerns regarding our Privacy Policy, please contact our Data Protection Officer:
            </p>
            <div className="space-y-1">
              <p><strong>Email:</strong> privacy@rizzpay.co.in</p>
              <p><strong>Phone:</strong> +91-7550248887</p>
              <p><strong>Address:</strong> RizzPay Headquarters, 123 Payment Street, Mumbai 400001, India</p>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              RizzPay reserves the right to update or modify this Privacy Policy at any time without prior notice. Any changes will be effective immediately upon posting on our website.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
