import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, CreditCard, Check, AlertTriangle, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Terms and Conditions</h1>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Print
          </Button>
        </div>
        
        <Card className="mb-6 bg-coinbase/5 border-coinbase/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="bg-coinbase/10 p-3 rounded-full">
                <Shield className="h-6 w-6 text-coinbase" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Secure Payment Processing</h3>
                <p className="text-sm text-muted-foreground">
                  RizzPay provides secure, reliable payment processing services for merchants and customers. 
                  Our platform adheres to the highest security standards in the industry.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="general" className="mb-6">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="prohibited" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Prohibited</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <ScrollArea className="h-[65vh] rounded-md border p-6 bg-card">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-coinbase" />
                    Introduction to Terms & Conditions
                  </h2>
                  <p className="text-muted-foreground">
                    Welcome to RizzPay. These Terms and Conditions govern your use of our website and services. 
                    By accessing or using our website and services, you agree to be bound by these Terms and Conditions. 
                    If you do not agree with any part of these terms, please refrain from using our website and services.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-3 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-coinbase" />
                    Proprietary Rights
                  </h2>
                  <p className="text-muted-foreground">
                    All content, logos, trademarks, and intellectual property displayed on the RizzPay website 
                    are the property of RizzPay or its licensors. You are prohibited from using, copying, 
                    reproducing, modifying, or distributing any of the proprietary content without prior 
                    written permission from RizzPay.
                  </p>
                </section>

                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-3 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-coinbase" />
                    Usage of the Website and Use of Services by the User
                  </h2>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p>You are responsible for providing accurate and up-to-date information during the registration process.</p>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p>You agree not to use the RizzPay website and services for any illegal or unauthorized purposes.</p>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p>You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p>You agree to comply with all applicable laws, regulations, and card association rules while using our services.</p>
                    </div>
                  </div>
                </section>
                
                <Separator />

                <section>
                  <h2 className="text-xl font-semibold mb-3 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-coinbase" />
                    Payment
                  </h2>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p>By using RizzPay, you authorize us to facilitate the processing of payments on your behalf.</p>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p>We may charge fees for the use of our services, which will be clearly communicated to you. You are responsible for paying all applicable fees associated with your use of the services.</p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-coinbase" />
                  Privacy Policy
                </h2>
                <p className="text-muted-foreground">
                  Your use of RizzPay is subject to our Privacy Policy, which outlines how we collect, use, and protect your personal information. 
                  By using our website and services, you agree to our Privacy Policy.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-coinbase" />
                  Third-Party Links/Offers
                </h2>
                <p className="text-muted-foreground">
                  RizzPay may contain links to third-party websites or services. These links are provided for your convenience. 
                  We do not endorse or assume any responsibility for the content, accuracy, or privacy practices of third-party websites. 
                  Use third-party websites at your own risk.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-coinbase" />
                  Our Partners
                </h2>
                <p className="text-muted-foreground">
                  We may collaborate with third-party service providers or partners to enhance our services. 
                  However, we are not responsible for the acts or omissions of our partners. 
                  Any interactions or transactions with our partners are solely between you and the partner.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-coinbase" />
                  Disclaimer of Warranty
                </h2>
                <p className="text-muted-foreground">
                  RizzPay provides its services "as is" and makes no warranties or representations regarding the accuracy, 
                  reliability, or completeness of the information or services provided. We disclaim all warranties, 
                  whether express or implied, including but not limited to warranties of merchantability, 
                  fitness for a particular purpose, and non-infringement.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-coinbase" />
                  Limitation of Liability
                </h2>
                <p className="text-muted-foreground">
                  In no event shall RizzPay be liable for any direct, indirect, incidental, special, consequential, 
                  or punitive damages arising out of or in connection with your use of the website or services. 
                  This limitation applies to any damages caused by errors, omissions, interruptions, delays, viruses, 
                  loss of data, or any other performance failure.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-coinbase" />
                  Indemnity
                </h2>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold harmless RizzPay, its affiliates, partners, employees, 
                  and agents from any claims, liabilities, damages, losses, costs, or expenses (including attorney fees) 
                  arising out of or related to your use of the website or services, violation of these Terms and Conditions, 
                  or infringement of any rights of a third party.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-coinbase" />
                  Prohibited Products and Services
                </h2>
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
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Illegal or fraudulent activities.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Sale or promotion of counterfeit or unauthorized goods.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Adult content or services.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Gambling, betting, or lottery activities.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Weapons, firearms, or ammunition.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Drugs, narcotics, or substances regulated by law.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Hate speech, discriminatory content, or illegal propaganda.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Any activity that violates applicable laws, regulations, or card network rules.</p>
                  </div>
                </div>
              </section>
            </div>
          </ScrollArea>
        </TabsContent>
          
        <TabsContent value="payments">
          <ScrollArea className="h-[65vh] rounded-md border p-6 bg-card">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-coinbase" />
                  Payment
                </h2>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>By using RizzPay, you authorize us to facilitate the processing of payments on your behalf.</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>We may charge fees for the use of our services, which will be clearly communicated to you. You are responsible for paying all applicable fees associated with your use of the services.</p>
                  </div>
                </div>
              </section>
                
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <CreditCard className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Secure Payment Processing</h3>
                      <p className="text-sm text-blue-700">
                        Our payment processing complies with PCI DSS standards to ensure your payment data is always secure.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
                
              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-coinbase" />
                  Third-Party Links/Offers
                </h2>
                <p className="text-muted-foreground">
                  RizzPay may contain links to third-party websites or services. These links are provided for your convenience. 
                  We do not endorse or assume any responsibility for the content, accuracy, or privacy practices of third-party websites. 
                  Use third-party websites at your own risk.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-coinbase" />
                  Our Partners
                </h2>
                <p className="text-muted-foreground">
                  We may collaborate with third-party service providers or partners to enhance our services. 
                  However, we are not responsible for the acts or omissions of our partners. 
                  Any interactions or transactions with our partners are solely between you and the partner.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-coinbase" />
                  Disclaimer of Warranty
                </h2>
                <p className="text-muted-foreground">
                  RizzPay provides its services "as is" and makes no warranties or representations regarding the accuracy, 
                  reliability, or completeness of the information or services provided. We disclaim all warranties, 
                  whether express or implied, including but not limited to warranties of merchantability, 
                  fitness for a particular purpose, and non-infringement.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-coinbase" />
                  Limitation of Liability
                </h2>
                <p className="text-muted-foreground">
                  In no event shall RizzPay be liable for any direct, indirect, incidental, special, consequential, 
                  or punitive damages arising out of or in connection with your use of the website or services. 
                  This limitation applies to any damages caused by errors, omissions, interruptions, delays, viruses, 
                  loss of data, or any other performance failure.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-coinbase" />
                  Indemnity
                </h2>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold harmless RizzPay, its affiliates, partners, employees, 
                  and agents from any claims, liabilities, damages, losses, costs, or expenses (including attorney fees) 
                  arising out of or related to your use of the website or services, violation of these Terms and Conditions, 
                  or infringement of any rights of a third party.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-coinbase" />
                  Prohibited Products and Services
                </h2>
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
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Illegal or fraudulent activities.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Sale or promotion of counterfeit or unauthorized goods.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Adult content or services.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Gambling, betting, or lottery activities.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Weapons, firearms, or ammunition.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Drugs, narcotics, or substances regulated by law.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Hate speech, discriminatory content, or illegal propaganda.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Any activity that violates applicable laws, regulations, or card network rules.</p>
                  </div>
                </div>
              </section>
            </div>
          </ScrollArea>
        </TabsContent>
          
        <TabsContent value="privacy">
          <ScrollArea className="h-[65vh] rounded-md border p-6 bg-card">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-coinbase" />
                  Privacy Policy
                </h2>
                <p className="text-muted-foreground">
                  Your use of RizzPay is subject to our Privacy Policy, which outlines how we collect, use, and protect your personal information. 
                  By using our website and services, you agree to our Privacy Policy.
                </p>
              </section>
                
              <Card className="bg-green-50 border-green-100">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Shield className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Your Data Security Matters</h3>
                      <p className="text-sm text-green-700">
                        We employ industry-standard encryption and security measures to protect your personal and payment information.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
                
              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-coinbase" />
                  Third-Party Links/Offers
                </h2>
                <p className="text-muted-foreground">
                  RizzPay may contain links to third-party websites or services. These links are provided for your convenience. 
                  We do not endorse or assume any responsibility for the content, accuracy, or privacy practices of third-party websites. 
                  Use third-party websites at your own risk.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-coinbase" />
                  Our Partners
                </h2>
                <p className="text-muted-foreground">
                  We may collaborate with third-party service providers or partners to enhance our services. 
                  However, we are not responsible for the acts or omissions of our partners. 
                  Any interactions or transactions with our partners are solely between you and the partner.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-coinbase" />
                  Disclaimer of Warranty
                </h2>
                <p className="text-muted-foreground">
                  RizzPay provides its services "as is" and makes no warranties or representations regarding the accuracy, 
                  reliability, or completeness of the information or services provided. We disclaim all warranties, 
                  whether express or implied, including but not limited to warranties of merchantability, 
                  fitness for a particular purpose, and non-infringement.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-coinbase" />
                  Limitation of Liability
                </h2>
                <p className="text-muted-foreground">
                  In no event shall RizzPay be liable for any direct, indirect, incidental, special, consequential, 
                  or punitive damages arising out of or in connection with your use of the website or services. 
                  This limitation applies to any damages caused by errors, omissions, interruptions, delays, viruses, 
                  loss of data, or any other performance failure.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-coinbase" />
                  Indemnity
                </h2>
                <p className="text-muted-foreground">
                  You agree to indemnify and hold harmless RizzPay, its affiliates, partners, employees, 
                  and agents from any claims, liabilities, damages, losses, costs, or expenses (including attorney fees) 
                  arising out of or related to your use of the website or services, violation of these Terms and Conditions, 
                  or infringement of any rights of a third party.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-coinbase" />
                  Prohibited Products and Services
                </h2>
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
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Illegal or fraudulent activities.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Sale or promotion of counterfeit or unauthorized goods.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Adult content or services.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Gambling, betting, or lottery activities.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Weapons, firearms, or ammunition.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Drugs, narcotics, or substances regulated by law.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Hate speech, discriminatory content, or illegal propaganda.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Any activity that violates applicable laws, regulations, or card network rules.</p>
                  </div>
                </div>
              </section>
            </div>
          </ScrollArea>
        </TabsContent>
          
        <TabsContent value="prohibited">
          <ScrollArea className="h-[65vh] rounded-md border p-6 bg-card">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  Prohibited Products and Services
                </h2>
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
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Illegal or fraudulent activities.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Sale or promotion of counterfeit or unauthorized goods.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Adult content or services.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Gambling, betting, or lottery activities.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Weapons, firearms, or ammunition.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Drugs, narcotics, or substances regulated by law.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Hate speech, discriminatory content, or illegal propaganda.</p>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p>Any activity that violates applicable laws, regulations, or card network rules.</p>
                  </div>
                </div>
              </section>
                
              <Card className="bg-amber-50 border-amber-100">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-amber
