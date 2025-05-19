
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Separator } from '@/components/ui/separator';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms and Conditions | RizzPay</title>
      </Helmet>
      
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/" className="text-primary hover:underline flex items-center gap-2">
            <span>← Back to Home</span>
          </Link>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-muted-foreground">Version: 1.0</p>
          <p className="text-muted-foreground">Effective Date: May 15, 2025</p>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using RizzPay's services, you agree to be bound by these Terms and Conditions. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">2. Description of Services</h2>
            <p>
              RizzPay provides digital payment processing services that enable merchants to accept payments from 
              their customers through various payment methods including UPI, bank transfers, and other electronic 
              payment systems. Our services include payment processing, transaction management, and settlement services.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">3. Account Registration</h2>
            <p>
              To use RizzPay services, merchants must register for an account and provide accurate, complete, and 
              up-to-date information. You are responsible for maintaining the confidentiality of your account credentials 
              and for all activities that occur under your account.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">4. Fees and Payments</h2>
            <p>
              Merchants agree to pay all fees associated with the services as outlined in their service agreement. 
              RizzPay reserves the right to change its fee structure with appropriate notice. All fees are non-refundable 
              except as required by law or as specifically provided in these terms.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">5. Prohibited Activities</h2>
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
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, RizzPay shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, 
              or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Your use or inability to use the services</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any interruption or cessation of transmission to or from the services</li>
              <li>Any bugs, viruses, or other harmful code that may be transmitted through the service</li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">7. Changes to Terms</h2>
            <p>
              RizzPay reserves the right to modify these Terms and Conditions at any time. We will provide notice of 
              significant changes through our website or via email. Your continued use of our services after such 
              modifications constitutes your acceptance of the revised terms.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to 
              its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive 
              jurisdiction of the courts in Chennai, India.
            </p>
          </section>
          
          <Separator className="my-6" />
          
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
            <p>For questions about these Terms, please contact us at:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Email: rizzpay1@gmail.com</li>
              <li>Phone: +91-9080186106</li>
              <li>Address: RizzPay Headquarters, Chennai, India</li>
            </ul>
          </section>
          
          <Separator className="my-6" />
          
          <p className="text-center font-semibold mt-8">
            By using RizzPay services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
