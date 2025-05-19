import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Store, Users } from 'lucide-react';

const RoleSectionWrapper = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Solutions for Everyone</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're a business owner or a customer, RizzPay has the perfect solution for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Store className="w-12 h-12 text-primary mb-4" />
              <CardTitle>For Merchants</CardTitle>
              <CardDescription>
                Accept payments from customers worldwide with our secure payment gateway
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Easy integration with your website
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Multiple payment methods
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Real-time transaction monitoring
                </li>
              </ul>
              <Link to="/auth">
                <Button className="w-full">Get Started as Merchant</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-primary mb-4" />
              <CardTitle>For Customers</CardTitle>
              <CardDescription>
                Make secure payments to your favorite merchants with ease
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Multiple payment options
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Secure transactions
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  Instant payment confirmation
                </li>
              </ul>
              <Link to="/auth">
                <Button variant="outline" className="w-full">Create Account</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default React.memo(RoleSectionWrapper);
