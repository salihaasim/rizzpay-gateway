
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, CreditCard, Lock, ExternalLink, Users, Print } from 'lucide-react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TermsAndConditions = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      
      <div className="container px-4 mx-auto py-12 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <FileText className="h-6 w-6 mr-2 text-primary" />
              <h1 className="text-3xl font-bold">Terms and Conditions</h1>
            </div>
            
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center">
              <Print className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
          
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex items-start">
              <Shield className="h-8 w-8 text-primary mt-1 mr-4" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Secure Payment Processing</h2>
                <p className="text-muted-foreground">
                  RizzPay provides secure, reliable payment processing services for merchants and customers. Our platform adheres to the highest security standards in the industry.
                </p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="general" className="flex items-center justify-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center justify-center">
                <CreditCard className="h-4 w-4 mr-2" />
                <span>Payments</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center justify-center">
                <Lock className="h-4 w-4 mr-2" />
                <span>Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="prohibited" className="flex items-center justify-center">
                <Shield className="h-4 w-4 mr-2" />
                <span>Prohibited</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="border rounded-lg p-6">
              <TabsContent value="general">
                <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground mb-4">
                  By accessing or using RizzPay's payment gateway services, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
                </p>
                
                <h2 className="text-xl font-semibold mb-4 mt-6">2. Service Description</h2>
                <p className="text-muted-foreground mb-4">
                  RizzPay provides a secure payment gateway that enables merchants to accept digital payments through various methods including UPI, credit/debit cards, net banking, and other electronic payment systems. Our services include:
                </p>
                <ul className="list-disc pl-5 mb-4 text-muted-foreground">
                  <li className="mb-2">Payment processing and gateway services</li>
                  <li className="mb-2">Merchant onboarding and verification</li>
                  <li className="mb-2">Transaction management and reporting</li>
                  <li className="mb-2">Settlement and disbursement services</li>
                  <li className="mb-2">Anti-fraud protection and risk management</li>
                </ul>
                
                <h2 className="text-xl font-semibold mb-4 mt-6">9. Intellectual Property</h2>
                <p className="text-muted-foreground mb-4">
                  All content, features, and functionality of the RizzPay service are owned by RizzPay and protected by international copyright, trademark, and other intellectual property laws.
                </p>
                
                <h2 className="text-xl font-semibold mb-4 mt-6">10. Limitation of Liability</h2>
                <p className="text-muted-foreground mb-4">
                  To the maximum extent permitted by law, RizzPay shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
                </p>
              </TabsContent>
              
              <TabsContent value="payments">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="text-xl font-semibold">Payment Terms</h2>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-start my-4">
                    <div className="text-green-500 mr-3 mt-1">✓</div>
                    <p className="text-muted-foreground">By using RizzPay, you authorize us to facilitate the processing of payments on your behalf.</p>
                  </div>
                  
                  <div className="flex items-start my-4">
                    <div className="text-green-500 mr-3 mt-1">✓</div>
                    <p className="text-muted-foreground">We may charge fees for the use of our services, which will be clearly communicated to you. You are responsible for paying all applicable fees associated with your use of the services.</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-semibold">Secure Payment Processing</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Our payment processing complies with PCI DSS standards to ensure your payment data is always secure.</p>
                </div>
                
                <h2 className="text-xl font-semibold mb-4">3. Pricing and Fees</h2>
                <p className="text-muted-foreground mb-4">
                  RizzPay charges a standard fee of 1% per transaction for all payment processing services. This fee structure includes:
                </p>
                <ul className="list-disc pl-5 mb-4 text-muted-foreground">
                  <li className="mb-2">1% of transaction value for all incoming payments</li>
                  <li className="mb-2">1% of transaction value for all outgoing payments or withdrawals</li>
                  <li className="mb-2">No hidden charges or monthly maintenance fees</li>
                  <li className="mb-2">Volume discounts may be negotiated for high-volume merchants</li>
                </ul>
              </TabsContent>
              
              <TabsContent value="privacy">
                <h2 className="text-xl font-semibold mb-4">RizzPay Privacy Policy</h2>
                <p className="text-muted-foreground mb-4">Version: 1.0</p>
                <p className="text-muted-foreground mb-4">Effective Date: May 19, 2025</p>
                
                <div className="border-t border-b py-4 my-6">
                  <h3 className="text-lg font-semibold mb-2">1. Introduction</h3>
                  <p className="text-muted-foreground">
                    This Privacy Policy describes how RizzPay ("we," "our," or "us") collects, uses, discloses, and safeguards the personal and transactional data of merchants, partners, and users interacting with our payment infrastructure.
                  </p>
                </div>
                
                <div className="border-b py-4 mb-6">
                  <h3 className="text-lg font-semibold mb-2">2. Information We Collect</h3>
                  <p className="text-muted-foreground mb-2">
                    We may collect the following categories of information:
                  </p>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li className="mb-2">Personal Identification Details: Name, email address, phone number, and identity documents (PAN, Aadhaar, GSTIN, etc.)</li>
                    <li className="mb-2">Business Information: Merchant business details, registration certificates, and bank account information</li>
                    <li className="mb-2">Transactional Data: Payment history, UPI IDs, transaction values, timestamps, device metadata, and IP address</li>
                    <li className="mb-2">Usage Data: Browser information, device logs, and activity on our dashboard or API endpoints</li>
                  </ul>
                </div>
                
                <div className="border-b py-4 mb-6">
                  <h3 className="text-lg font-semibold mb-2">3. How We Use Your Information</h3>
                  <p className="text-muted-foreground mb-2">
                    We use collected data to:
                  </p>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li className="mb-2">Verify merchant identity and comply with KYC/AML requirements</li>
                    <li className="mb-2">Process, reconcile, and settle payments securely</li>
                    <li className="mb-2">Provide merchant support and operational notifications</li>
                    <li className="mb-2">Detect fraud, enforce compliance, and mitigate risks</li>
                    <li className="mb-2">Improve our platform, analytics, and user experience</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="prohibited">
                <h2 className="text-xl font-semibold mb-4">6. Prohibited Activities</h2>
                <p className="text-muted-foreground mb-4">
                  The following activities are strictly prohibited when using RizzPay services:
                </p>
                <ul className="list-disc pl-5 mb-4 text-muted-foreground">
                  <li className="mb-2">Processing payments for illegal goods or services</li>
                  <li className="mb-2">Money laundering or financing of terrorist activities</li>
                  <li className="mb-2">Fraudulent transactions or misrepresentation of products/services</li>
                  <li className="mb-2">Violating intellectual property rights</li>
                  <li className="mb-2">Processing transactions for high-risk industries without proper disclosure and approval</li>
                </ul>
                
                <div className="my-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <ExternalLink className="h-5 w-5 mr-2 text-primary" />
                    Third-Party Links/Offers
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    RizzPay may contain links to third-party websites or services. These links are provided for your convenience. We do not endorse or assume any responsibility for the content, accuracy, or privacy practices of third-party websites. Use third-party websites at your own risk.
                  </p>
                </div>
                
                <div className="my-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Our Partners
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    We may collaborate with third-party service providers or partners to enhance our services. However, we are not responsible for the acts or omissions of our partners. Any interactions or transactions with our partners are solely between you and the partner.
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              Last updated: May 19, 2025
            </p>
            
            <div className="flex space-x-4">
              <Link to="/refund-policy" className="text-sm text-primary hover:underline">
                Refund Policy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/" className="text-sm text-primary hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
