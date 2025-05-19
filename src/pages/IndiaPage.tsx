
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IndiaPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">RizzPay India</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          India's most reliable payment gateway solution for businesses of all sizes.
          Accept payments quickly, securely, and efficiently.
        </p>
      </header>

      <Tabs defaultValue="businesses" className="max-w-4xl mx-auto mb-10">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="businesses">For Businesses</TabsTrigger>
          <TabsTrigger value="customers">For Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="businesses" className="mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Accept All Payments</CardTitle>
                <CardDescription>Multiple payment options</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Accept payments via UPI, cards, net banking, and more. Give your customers the flexibility they need.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/register-merchant">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fast Settlements</CardTitle>
                <CardDescription>Get your money quickly</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Receive funds in your bank account within 24 hours. Transparent fee structure with no hidden costs.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/settlements">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Easy Integration</CardTitle>
                <CardDescription>Quick setup process</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Simple API integration, plugins for popular platforms, and comprehensive documentation for developers.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/developers">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="customers" className="mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Secure Transactions</CardTitle>
                <CardDescription>Bank-level security</CardDescription>
              </CardHeader>
              <CardContent>
                <p>All transactions are secured with end-to-end encryption and comply with PCI-DSS standards.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/security">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Easy UPI Payments</CardTitle>
                <CardDescription>Pay with your favorite app</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Make payments using any UPI app including Google Pay, PhonePe, Paytm, and more with just a few taps.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/upi-payment">Make Payment</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Support</CardTitle>
                <CardDescription>We're here to help</CardDescription>
              </CardHeader>
              <CardContent>
                <p>24/7 support via chat, email, and phone. Our team is always ready to assist you with any questions.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">RizzPay Advantage in India</h2>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-semibold mb-4">Compliant with Indian Regulations</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              RizzPay is fully compliant with all RBI regulations including the new Payment Aggregator guidelines.
              We handle all compliance requirements so you can focus on your business.
            </p>
            
            <h3 className="text-xl font-semibold mb-4">Support for Local Payment Methods</h3>
            <p className="text-gray-700 dark:text-gray-300">
              We support all popular payment methods in India including UPI, Rupay cards, NEFT/RTGS, net banking,
              and all major wallets - ensuring your customers can pay how they want.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Made for Indian Businesses</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Whether you're a small business owner or a large enterprise, our platform is designed
              to meet the unique needs of Indian merchants with tailored solutions.
            </p>
            
            <h3 className="text-xl font-semibold mb-4">Transparent Pricing</h3>
            <p className="text-gray-700 dark:text-gray-300">
              No hidden fees or surprise charges. Our pricing is transparent and competitive,
              with plans suitable for businesses of all sizes. Pay only for what you use.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-primary/5 py-12 px-6 rounded-lg max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Start Accepting Payments Today</h2>
        <p className="text-center text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of Indian businesses already using RizzPay to accept payments
          securely and grow their business.
        </p>
        
        <div className="flex justify-center gap-4 flex-wrap">
          <Button size="lg" asChild>
            <Link to="/register-merchant">Create Account</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/contact-sales">Contact Sales</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default IndiaPage;
