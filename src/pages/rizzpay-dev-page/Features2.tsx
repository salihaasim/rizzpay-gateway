
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Zap, 
  Shield, 
  BarChart3, 
  CreditCard, 
  Globe,
  Users,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Layers
} from 'lucide-react';
import { Helmet } from 'react-helmet';

const Features2 = () => {
  const coreFeatures = [
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Optimized for mobile payments with responsive design",
      details: ["Touch-friendly interface", "Fast mobile checkout", "Progressive Web App"]
    },
    {
      icon: Zap,
      title: "Instant Settlements",
      description: "Get your money faster with instant settlement options",
      details: ["Real-time transfers", "24/7 processing", "No waiting periods"]
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Multi-layered security with fraud prevention",
      details: ["SSL encryption", "2FA authentication", "Risk monitoring"]
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Comprehensive insights to grow your business",
      details: ["Revenue tracking", "Customer insights", "Performance metrics"]
    }
  ];

  const integrationFeatures = [
    {
      title: "Easy Integration",
      description: "Get started in minutes with our simple APIs",
      icon: Layers
    },
    {
      title: "Global Payments",
      description: "Accept payments from customers worldwide",
      icon: Globe
    },
    {
      title: "Multi-User Access",
      description: "Team collaboration with role-based permissions",
      icon: Users
    },
    {
      title: "24/7 Monitoring",
      description: "Continuous monitoring for optimal performance",
      icon: Clock
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Advanced Features | RizzPay Payment Solutions</title>
        <meta name="description" content="Explore advanced features and capabilities of RizzPay payment gateway." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Star className="h-4 w-4 mr-1" />
            Advanced Features
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Next-Generation Payment Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how RizzPay's advanced features can transform your payment experience and boost your business growth
          </p>
        </div>

        {/* Core Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Core Capabilities</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                        <IconComponent className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Integration Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Integration & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrationFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="text-2xl text-center">Why Choose RizzPay?</CardTitle>
              <CardDescription className="text-blue-100 text-center">
                Compare our features with traditional payment solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime Guarantee</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">&lt;2s</div>
                  <div className="text-sm text-gray-600">Transaction Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Customer Support</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Experience the Future of Payments</h3>
              <p className="text-gray-600 mb-6">
                Join over 10,000+ businesses that trust RizzPay for their payment processing needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Features2;
