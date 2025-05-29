
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Zap, 
  Globe, 
  CreditCard, 
  Users, 
  BarChart3,
  Lock,
  Smartphone,
  Clock,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';
import { Helmet } from 'react-helmet';

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "End-to-end encryption with PCI DSS compliance",
      badge: "Enterprise"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process payments in under 2 seconds",
      badge: "Performance"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Accept payments from customers worldwide",
      badge: "International"
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Methods",
      description: "UPI, Cards, Net Banking, and Wallets",
      badge: "Versatile"
    },
    {
      icon: Users,
      title: "Multi-Merchant Support",
      description: "Manage multiple businesses from one dashboard",
      badge: "Business"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time insights and detailed reporting",
      badge: "Analytics"
    }
  ];

  const additionalFeatures = [
    {
      icon: Lock,
      title: "Fraud Protection",
      description: "AI-powered fraud detection and prevention"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Perfect experience on all devices"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer assistance"
    },
    {
      icon: CheckCircle,
      title: "99.9% Uptime",
      description: "Reliable service you can count on"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Helmet>
        <title>Features | RizzPay Payment Gateway</title>
        <meta name="description" content="Discover powerful features of RizzPay payment gateway including security, speed, and analytics." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Star className="h-4 w-4 mr-1" />
            Feature Overview
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Powerful Features for Modern Payments
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to accept payments online with confidence and scale your business globally
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Additional Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 border-0">
            <CardContent className="p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="mb-6 opacity-90">
                Join thousands of businesses already using RizzPay to power their payments
              </p>
              <Button size="lg" variant="secondary" className="group">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Features;
