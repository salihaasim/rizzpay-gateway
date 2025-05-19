
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const RefundPolicy = () => {
  return (
    <Layout>
      <div className="container max-w-4xl py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">RizzPay Refund Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: May 16, 2025</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Our approach to refunds and returns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              At RizzPay, we strive to ensure complete satisfaction with our payment services. This Refund Policy outlines the terms and conditions regarding refunds for transactions processed through the RizzPay payment gateway.
            </p>
            <p>
              We understand that issues can arise with transactions, and we have established this policy to provide clarity on when and how refunds are processed within our platform.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Transaction Refund Policy</CardTitle>
            <CardDescription>
              Guidelines for payment refunds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Merchant-Initiated Refunds</h3>
              <p>
                Merchants using RizzPay can initiate refunds for their customers through the RizzPay dashboard for up to 180 days after the original transaction date. Refund processing typically takes 5-7 business days to reflect in the customer's account, depending on the payment method and issuing bank.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Full and Partial Refunds</h3>
              <p>
                RizzPay supports both full and partial refunds. Merchants can choose to refund the complete transaction amount or only a portion, based on their business policies and agreement with the customer.
              </p>
              <p>
                The refund processing fee is 1% of the refund amount, with a minimum charge of ₹5 and a maximum of ₹50 per refund transaction.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">RizzPay Service Fee Refunds</h3>
              <p>
                RizzPay service fees are non-refundable. When a merchant initiates a refund for their customer, the original transaction fee charged by RizzPay is not returned to the merchant.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Failed Transactions</h3>
              <p>
                For failed transactions where the customer's account was debited but the transaction did not complete successfully, RizzPay automatically initiates a refund process. These refunds are typically processed within 5-7 business days.
              </p>
              <p>
                If a customer's account was debited but no refund has been processed after 7 business days, the customer should contact their merchant directly. Merchants can then raise a ticket through the RizzPay dashboard for resolution.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Disputes and Chargebacks</h3>
              <p>
                In case of disputes or chargebacks initiated by customers through their card issuer or bank, RizzPay will notify the merchant and may temporarily hold the disputed funds until the dispute is resolved. Merchants are required to provide evidence to contest the dispute within 7 calendar days of notification.
              </p>
              <p>
                If a dispute is resolved in favor of the customer, the funds will be refunded, and a chargeback fee of ₹300 will be charged to the merchant.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Platform Service Fee Refunds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              For merchants using RizzPay's platform services, the following refund policies apply to subscription and service fees:
            </p>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Monthly Subscription Plans</h3>
              <p>
                Monthly subscription fees are non-refundable once the billing cycle has begun. If you cancel your subscription, you will continue to have access to the service until the end of your current billing period.
              </p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Annual Subscription Plans</h3>
              <p>
                For annual subscription plans, you may request a prorated refund within 30 days of your subscription renewal. The refund amount will be calculated based on the unused portion of your subscription period.
              </p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Setup and Integration Fees</h3>
              <p>
                One-time setup and integration fees are non-refundable once the integration process has begun. However, if RizzPay fails to deliver the integration services as specified in your contract, you may be eligible for a full or partial refund at our discretion.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Request a Refund</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">For Customers</h3>
              <p>
                If you, as a customer, wish to request a refund for a purchase made using RizzPay, please contact the merchant directly. As a payment processor, RizzPay does not decide when refunds should be issued - this decision lies solely with the merchant according to their refund policy.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">For Merchants</h3>
              <p>
                Merchants can process refunds by following these steps:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Log in to your RizzPay merchant dashboard</li>
                <li>Navigate to "Transactions" section</li>
                <li>Locate the transaction you wish to refund</li>
                <li>Click on the "Refund" button next to the transaction</li>
                <li>Enter the refund amount (for partial refunds)</li>
                <li>Provide a reason for the refund</li>
                <li>Confirm the refund</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions or concerns regarding our Refund Policy, please contact our support team:
            </p>
            <div className="space-y-1">
              <p><strong>Email:</strong> support@rizzpay.co.in</p>
              <p><strong>Phone:</strong> +91-7550248887</p>
              <p><strong>Hours:</strong> Monday to Saturday, 9:00 AM to 6:00 PM IST</p>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              RizzPay reserves the right to update or modify this Refund Policy at any time without prior notice. Any changes will be effective immediately upon posting on our website.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RefundPolicy;
