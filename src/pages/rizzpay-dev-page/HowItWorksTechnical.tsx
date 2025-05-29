
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Code, 
  Database, 
  Shield, 
  Zap, 
  ArrowRight, 
  CheckCircle,
  Globe,
  Smartphone,
  Server,
  Lock
} from 'lucide-react';
import { Helmet } from 'react-helmet';

const HowItWorksTechnical = () => {
  const technicalSteps = [
    {
      step: "1",
      title: "API Integration",
      description: "Simple REST API integration with comprehensive documentation",
      icon: Code,
      details: [
        "RESTful API endpoints",
        "Webhook notifications",
        "SDK support for multiple languages",
        "Sandbox environment for testing"
      ]
    },
    {
      step: "2",
      title: "Secure Processing",
      description: "Bank-grade security with end-to-end encryption",
      icon: Shield,
      details: [
        "PCI DSS Level 1 compliance",
        "256-bit SSL encryption",
        "Tokenization of sensitive data",
        "Fraud detection algorithms"
      ]
    },
    {
      step: "3",
      title: "Real-time Settlement",
      description: "Instant fund transfer with automated reconciliation",
      icon: Zap,
      details: [
        "Instant settlement options",
        "Automated reconciliation",
        "Multi-currency support",
        "Real-time status updates"
      ]
    },
    {
      step: "4",
      title: "Data Management",
      description: "Comprehensive transaction data and analytics",
      icon: Database,
      details: [
        "Transaction history",
        "Advanced analytics",
        "Custom reporting",
        "Data export capabilities"
      ]
    }
  ];

  const architectureComponents = [
    {
      title: "Load Balancer",
      description: "Distributes traffic across multiple servers",
      icon: Server
    },
    {
      title: "API Gateway",
      description: "Manages API requests and authentication",
      icon: Globe
    },
    {
      title: "Security Layer",
      description: "Encryption and fraud detection",
      icon: Lock
    },
    {
      title: "Mobile SDK",
      description: "Native mobile app integration",
      icon: Smartphone
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Technical Implementation | RizzPay</title>
        <meta name="description" content="Learn about RizzPay's technical architecture and implementation details." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Code className="h-4 w-4 mr-1" />
            Technical Deep Dive
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            How RizzPay Works Under the Hood
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the technical architecture and implementation details that power our payment platform
          </p>
        </div>

        {/* Technical Flow */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Technical Implementation Flow</h2>
          <div className="space-y-8">
            {technicalSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex flex-col lg:flex-row items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {step.step}
                    </div>
                  </div>
                  <Card className="flex-1 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{step.title}</CardTitle>
                          <CardDescription>{step.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  {index < technicalSteps.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center w-8">
                      <ArrowRight className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Architecture Components */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">System Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {architectureComponents.map((component, index) => {
              const IconComponent = component.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{component.title}</h3>
                    <p className="text-gray-600 text-sm">{component.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Code Example */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quick Integration Example</CardTitle>
              <CardDescription>Get started with just a few lines of code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-6 text-green-400 font-mono text-sm overflow-x-auto">
                <div className="mb-4 text-gray-500">// Initialize RizzPay SDK</div>
                <div className="mb-2">import RizzPay from &apos;rizzpay-sdk&apos;;</div>
                <div className="mb-4">const rizzpay = new RizzPay(&apos;your-api-key&apos;);</div>
                
                <div className="mb-4 text-gray-500">// Create payment</div>
                <div className="mb-2">const payment = await rizzpay.createPayment(&#123;</div>
                <div className="mb-2 ml-4">amount: 1000,</div>
                <div className="mb-2 ml-4">currency: &apos;INR&apos;,</div>
                <div className="mb-2 ml-4">customer: &#123; email: &apos;user@example.com&apos; &#125;</div>
                <div className="mb-4">&#125;);</div>
                
                <div className="mb-4 text-gray-500">// Handle success</div>
                <div>console.log(&apos;Payment successful:&apos;, payment.id);</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Performance Metrics</CardTitle>
              <CardDescription className="text-blue-100 text-center">
                Industry-leading performance standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">99.99%</div>
                  <div className="text-blue-100">Uptime SLA</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">&lt;200ms</div>
                  <div className="text-blue-100">API Response</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">10K+</div>
                  <div className="text-blue-100">TPS Capacity</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-blue-100">Monitoring</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Integrate?</h3>
              <p className="text-gray-600 mb-6">
                Get started with our comprehensive documentation and sandbox environment
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  View Documentation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Try Sandbox
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksTechnical;
