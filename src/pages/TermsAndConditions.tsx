
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-10 mx-auto max-w-4xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <Separator className="mb-6" />
        
        <ScrollArea className="h-[70vh] rounded-md border p-6 bg-card">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Introduction to Terms & Conditions</h2>
              <p className="text-muted-foreground">
                Welcome to RizzPay. These Terms and Conditions govern your use of our website and services. 
                By accessing or using our website and services, you agree to be bound by these Terms and Conditions. 
                If you do not agree with any part of these terms, please refrain from using our website and services.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">Proprietary Rights</h2>
              <p className="text-muted-foreground">
                All content, logos, trademarks, and intellectual property displayed on the RizzPay website 
                are the property of RizzPay or its licensors. You are prohibited from using, copying, 
                reproducing, modifying, or distributing any of the proprietary content without prior 
                written permission from RizzPay.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">Usage of the Website and Use of Services by the User</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>a. You are responsible for providing accurate and up-to-date information during the registration process.</p>
                <p>b. You agree not to use the RizzPay website and services for any illegal or unauthorized purposes.</p>
                <p>c. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                <p>d. You agree to comply with all applicable laws, regulations, and card association rules while using our services.</p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">Payment</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>a. By using RizzPay, you authorize us to facilitate the processing of payments on your behalf.</p>
                <p>b. We may charge fees for the use of our services, which will be clearly communicated to you. You are responsible for paying all applicable fees associated with your use of the services.</p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">Privacy Policy</h2>
              <p className="text-muted-foreground">
                Your use of RizzPay is subject to our Privacy Policy, which outlines how we collect, use, and protect your personal information. 
                By using our website and services, you agree to our Privacy Policy.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">Third-Party Links/Offers</h2>
              <p className="text-muted-foreground">
                RizzPay may contain links to third-party websites or services. These links are provided for your convenience. 
                We do not endorse or assume any responsibility for the content, accuracy, or privacy practices of third-party websites. 
                Use third-party websites at your own risk.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">Our Partners</h2>
              <p className="text-muted-foreground">
                We may collaborate with third-party service providers or partners to enhance our services. 
                However, we are not responsible for the acts or omissions of our partners. 
                Any interactions or transactions with our partners are solely between you and the partner.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">Disclaimer of Warranty</h2>
              <p className="text-muted-foreground">
                RizzPay provides its services "as is" and makes no warranties or representations regarding the accuracy, 
                reliability, or completeness of the information or services provided. We disclaim all warranties, 
                whether express or implied, including but not limited to warranties of merchantability, 
                fitness for a particular purpose, and non-infringement.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
              <p className="text-muted-foreground">
                In no event shall RizzPay be liable for any direct, indirect, incidental, special, consequential, 
                or punitive damages arising out of or in connection with your use of the website or services. 
                This limitation applies to any damages caused by errors, omissions, interruptions, delays, viruses, 
                loss of data, or any other performance failure.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">Indemnity</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless RizzPay, its affiliates, partners, employees, 
                and agents from any claims, liabilities, damages, losses, costs, or expenses (including attorney fees) 
                arising out of or related to your use of the website or services, violation of these Terms and Conditions, 
                or infringement of any rights of a third party.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-3">Prohibited Products and Services</h2>
              <p className="text-muted-foreground mb-2">
                The use of RizzPay's services for certain products or services may be prohibited or restricted by law, 
                card network rules, or RizzPay's policies. Users are responsible for ensuring that their use of the 
                payment gateway services complies with all applicable laws and regulations. RizzPay reserves the right 
                to refuse or restrict services for any product or service that violates these restrictions.
              </p>
              <p className="text-muted-foreground mb-2">
                Users agree not to use RizzPay's services for the following prohibited activities:
              </p>
              <div className="space-y-1 text-muted-foreground">
                <p>a. Illegal or fraudulent activities.</p>
                <p>b. Sale or promotion of counterfeit or unauthorized goods.</p>
                <p>c. Adult content or services.</p>
                <p>d. Gambling, betting, or lottery activities.</p>
                <p>e. Weapons, firearms, or ammunition.</p>
                <p>f. Drugs, narcotics, or substances regulated by law.</p>
                <p>g. Hate speech, discriminatory content, or illegal propaganda.</p>
                <p>h. Any activity that violates applicable laws, regulations, or card network rules.</p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TermsAndConditions;
