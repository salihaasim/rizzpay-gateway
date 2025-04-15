
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { ArrowLeft, FileText, Shield, Server, Database, Zap, Layers } from 'lucide-react';
import logoSvg from '../assets/logo.svg';

const TechnicalSection = ({ 
  icon, 
  title, 
  children 
}: { 
  icon: React.ReactNode; 
  title: string; 
  children: React.ReactNode 
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-md">
          {icon}
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

const HowItWorksTechnical = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useMerchantAuth();
  
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex items-center gap-2 mr-6">
            <Link to="/" className="font-semibold text-xl text-primary flex items-center gap-1">
              <img src={logoSvg} alt="RizzPay Logo" className="h-6 w-6" />
              <span className="font-bold">RizzPay</span>
            </Link>
          </div>
          
          <div className="flex-1">
            <h1 className="text-lg font-medium">Technical Documentation</h1>
          </div>
          
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">RizzPay Technical Architecture</h1>
          <p className="text-muted-foreground">
            This documentation provides technical details about the RizzPay payment processing system, 
            its architecture, and implementation details.
          </p>
        </div>
        
        <Tabs defaultValue="architecture">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="capacity">Capacity</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="architecture">
            <TechnicalSection icon={<Layers className="h-5 w-5 text-primary" />} title="System Architecture">
              <div className="space-y-4">
                <p>
                  RizzPay uses a microservices architecture with the following components:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Frontend Application (React/TypeScript)</li>
                  <li>API Gateway for routing and request handling</li>
                  <li>Authentication and authorization service</li>
                  <li>Transaction processing service</li>
                  <li>Payment gateway integrations</li>
                  <li>Webhook management service</li>
                  <li>Analytics and reporting engine</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  For detailed architecture diagrams, refer to the system-architecture.md file in the technical-details directory.
                </p>
              </div>
            </TechnicalSection>
            
            <TechnicalSection icon={<Database className="h-5 w-5 text-primary" />} title="Data Flow">
              <div className="space-y-4">
                <p>
                  The data flow in RizzPay follows these key steps:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>User initiates payment through web interface or API</li>
                  <li>Request is validated and transaction record is created</li>
                  <li>Payment is routed to appropriate payment processor</li>
                  <li>Payment status is tracked and updated in real-time</li>
                  <li>Webhooks notify external systems of status changes</li>
                  <li>Transaction data is stored in encrypted form</li>
                  <li>Reporting systems aggregate and analyze transaction data</li>
                </ol>
              </div>
            </TechnicalSection>
          </TabsContent>
          
          <TabsContent value="security">
            <TechnicalSection icon={<Shield className="h-5 w-5 text-primary" />} title="Security Measures">
              <div className="space-y-4">
                <p>
                  RizzPay implements multiple layers of security:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>End-to-end encryption for all sensitive data</li>
                  <li>Multi-factor authentication for merchant accounts</li>
                  <li>Role-based access control (RBAC)</li>
                  <li>Real-time transaction monitoring for fraud detection</li>
                  <li>Rate limiting to prevent brute force attacks</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Compliance with PCI-DSS standards</li>
                </ul>
              </div>
            </TechnicalSection>
          </TabsContent>
          
          <TabsContent value="capacity">
            <TechnicalSection icon={<Zap className="h-5 w-5 text-primary" />} title="Processing Capacity">
              <div className="space-y-4">
                <p>
                  RizzPay is designed for high-volume transaction processing:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Transaction Throughput</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Peak processing: 1,000 TPS</li>
                        <li>Sustained processing: 600 TPS</li>
                        <li>Daily capacity: 86.4 million transactions</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Capacity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Maximum transaction: ₹10,00,000</li>
                        <li>Daily processing: Up to ₹5,000 crores</li>
                        <li>Monthly capacity: ₹150,000 crores</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TechnicalSection>
          </TabsContent>
          
          <TabsContent value="api">
            <TechnicalSection icon={<Server className="h-5 w-5 text-primary" />} title="API Overview">
              <div className="space-y-4">
                <p>
                  RizzPay provides RESTful APIs for integration:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Authentication endpoints (JWT-based)</li>
                  <li>Transaction creation and management</li>
                  <li>Payment method handling</li>
                  <li>Webhook configuration</li>
                  <li>Reporting and analytics</li>
                </ul>
                <p className="mt-4">
                  All API requests require authentication and are rate-limited based on merchant tier.
                  Detailed API documentation is available in the merchant dashboard after login.
                </p>
              </div>
            </TechnicalSection>
          </TabsContent>
          
          <TabsContent value="compliance">
            <TechnicalSection icon={<FileText className="h-5 w-5 text-primary" />} title="Regulatory Compliance">
              <div className="space-y-4">
                <p>
                  RizzPay is designed to comply with Indian financial regulations:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>RBI guidelines for payment aggregators</li>
                  <li>KYC and AML compliance</li>
                  <li>PCI-DSS Level 1 compliance</li>
                  <li>Data localization requirements</li>
                  <li>GDPR and personal data protection</li>
                </ul>
                <p className="mt-4 text-sm text-muted-foreground">
                  Our compliance team regularly reviews and updates our systems to align with changing regulations.
                </p>
              </div>
            </TechnicalSection>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HowItWorksTechnical;
