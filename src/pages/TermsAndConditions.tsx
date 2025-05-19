
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, ArrowLeft, Printer, CreditCard, Shield, AlertTriangle } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms and Conditions | RizzPay</title>
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
        
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Terms and Conditions</h1>
        
        <div className="mb-8 p-6 bg-card rounded-lg border shadow-sm">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Secure Payment Processing</h2>
              <p className="text-muted-foreground">
                RizzPay provides secure, reliable payment processing services for merchants and customers. Our platform adheres to the
                highest security standards in the industry.
              </p>
            </div>
          </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Payments</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="prohibited" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Prohibited</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
              <p>
                By accessing or using RizzPay's services, you agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, please do not use our services.
              </p>
              
              <h2 className="text-xl font-semibold">2. Description of Services</h2>
              <p>
                RizzPay provides digital payment processing services that enable merchants to accept payments from 
                their customers through various payment methods including UPI, bank transfers, and other electronic 
                payment systems. Our services include payment processing, transaction management, and settlement services.
              </p>
              
              <h2 className="text-xl font-semibold">3. Account Registration</h2>
              <p>
                To use RizzPay services, merchants must register for an account and provide accurate, complete, and 
                up-to-date information. You are responsible for maintaining the confidentiality of your account credentials 
                and for all activities that occur under your account.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Payment</h2>
                <ul className="list-none space-y-4 mt-4">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>By using RizzPay, you authorize us to facilitate the processing of payments on your behalf.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>We may charge fees for the use of our services, which will be clearly communicated to you. You are responsible for paying all applicable fees associated with your use of the services.</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-md">
                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Secure Payment Processing</h3>
                    <p className="text-sm text-muted-foreground">Our payment processing complies with PCI DSS standards to ensure your payment data is always secure.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold">4. Fees and Payments</h2>
                <p className="mt-2">
                  Merchants agree to pay all fees associated with the services as outlined in their service agreement. 
                  RizzPay reserves the right to change its fee structure with appropriate notice. All fees are non-refundable 
                  except as required by law or as specifically provided in these terms.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Privacy Policy</h2>
              <p>
                Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms by reference, 
                explains how we collect, use, and protect your personal information. By using our services, 
                you consent to our collection and use of personal information as described in our Privacy Policy.
              </p>
              
              <h2 className="text-xl font-semibold">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against 
                unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of 
                transmission over the Internet or method of electronic storage is 100% secure.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="prohibited" className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">5. Prohibited Activities</h2>
              <p>
                When using RizzPay services, you agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Use the services for any illegal purpose or in violation of any local, state, national, or international law</li>
                <li>Violate or encourage others to violate the rights of third parties, including intellectual property rights</li>
                <li>Process transactions for businesses or activities not disclosed during account registration</li>
                <li>Use the services to process payments for restricted businesses without prior approval</li>
                <li>Attempt to bypass or circumvent any security measures implemented by RizzPay</li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Third-Party Links/Offers</h2>
              <p>
                RizzPay may contain links to third-party websites or services. These links are provided for your convenience. We do 
                not endorse or assume any responsibility for the content, accuracy, or privacy practices of third-party websites. Use 
                third-party websites at your own risk.
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Our Partners</h2>
              <p>
                We may collaborate with third-party service providers or partners to enhance our services. However, we are not 
                responsible for the acts or omissions of our partners. Any interactions or transactions with our partners are solely 
                between you and the partners.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-10 p-5 border-t">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 RizzPay Payment Technologies. All rights reserved.</p>
            <p className="mt-2">For questions about these Terms, please contact us at: <span className="text-primary">rizzpay1@gmail.com</span></p>
            <p>Phone: +91-9080186106 | Address: RizzPay Headquarters, Chennai, India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
