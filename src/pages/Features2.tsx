
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Database, Server, Shield, Zap, Layers, Code,
  GitBranch, RefreshCcw, Brain, BookOpen,
  Users, Wallet, LineChart, Lock,
  MessageSquare, Puzzle
} from 'lucide-react';

const Features2 = () => {
  const [selectedComponent, setSelectedComponent] = useState('');

  // Cleaner: strictly domestic architecture
  const architectureComponents = [
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: "Supabase Integration",
      description: "PostgreSQL database with real-time capabilities and built-in authentication.",
      details: [
        "1,000 TPS processing capacity",
        "99.99% uptime guarantee",
        "Real-time monitoring and alerts",
        "Automatic scaling and failover"
      ]
    },
    {
      icon: <Server className="h-6 w-6 text-primary" />,
      title: "API Gateway",
      description: "Secure API routing and request handling for domestic payment processing.",
      details: [
        "Load balancing across Indian regions",
        "DDoS protection built-in",
        "API rate limiting and quotas",
        "Custom routing rules"
      ]
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Security Layer",
      description: "End-to-end encryption and multi-factor authentication.",
      details: [
        "PCI DSS Level 1 compliance",
        "256-bit AES encryption",
        "Real-time fraud detection",
        "IP whitelisting capabilities"
      ]
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Transaction Engine",
      description: "High-performance domestic payment processing up to 1,000 TPS.",
      details: [
        "Multi-threaded processing",
        "Automatic retry mechanism",
        "Transaction queuing",
        "Load distribution"
      ]
    }
  ];

  const techStack = [
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "Frontend",
      description: "React + TypeScript, Tailwind CSS, Shadcn UI components",
      details: [
        "Component-driven architecture",
        "Server-side rendering support",
        "Progressive Web App features",
        "Responsive mobile-first design"
      ]
    },
    {
      icon: <GitBranch className="h-6 w-6 text-primary" />,
      title: "State Management",
      description: "Zustand for global state, React Query for server state",
      details: [
        "Optimistic updates",
        "Automatic background refetching",
        "Persistent storage integration",
        "Real-time sync capabilities"
      ]
    },
    {
      icon: <Layers className="h-6 w-6 text-primary" />,
      title: "Backend Services",
      description: "Serverless functions, WebSocket support, Webhook system for domestic transactions",
      details: [
        "Auto-scaling infrastructure",
        "Event-driven architecture",
        "Distributed caching",
        "Message queue system"
      ]
    },
    {
      icon: <RefreshCcw className="h-6 w-6 text-primary" />,
      title: "Integration Layer",
      description: "RESTful APIs, SDK support, developer tools for Indian partners",
      details: [
        "Comprehensive API documentation",
        "Multiple SDK versions",
        "Integration templates",
        "Testing environments"
      ]
    }
  ];

  const paymentFeatures = [
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "Smart Routing",
      description: "Intelligent payment routing for domestic transactions based on success rates and costs",
      details: [
        "Dynamic gateway selection",
        "Cost optimization",
        "Success rate tracking",
        "Automated failover"
      ]
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Documentation",
      description: "Comprehensive developer resources and integration guides",
      details: [
        "API reference docs",
        "Integration tutorials",
        "Code examples",
        "Best practices"
      ]
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "User Management",
      description: "Advanced merchant and customer management system",
      details: [
        "Role-based access control",
        "Multi-user support",
        "Activity logging",
        "Custom permissions"
      ]
    },
    {
      icon: <Wallet className="h-6 w-6 text-primary" />,
      title: "Digital Wallet",
      description: "Built-in wallet system for instant domestic transfers",
      details: [
        "Instant settlements",
        "P2P transfers",
        "Multi-currency support (INR only)",
        "Transaction history"
      ]
    },
    {
      icon: <LineChart className="h-6 w-6 text-primary" />,
      title: "Analytics",
      description: "Real-time analytics and reporting dashboard",
      details: [
        "Transaction analytics",
        "Custom reports",
        "Data visualization",
        "Export capabilities"
      ]
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: "Security Features",
      description: "Advanced security measures and compliance",
      details: [
        "Fraud detection",
        "3D Secure 2.0",
        "Tokenization",
        "Encryption"
      ]
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Support System",
      description: "24/7 technical support and merchant assistance",
      details: [
        "Live chat support",
        "Priority ticketing",
        "Knowledge base",
        "Developer forum"
      ]
    },
    {
      icon: <Puzzle className="h-6 w-6 text-primary" />,
      title: "Integration Tools",
      description: "Plugins and tools for seamless Indian payment integration",
      details: [
        "CMS plugins",
        "Mobile SDKs",
        "Testing tools",
        "Sample applications"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            RizzPay Technical Architecture
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive payment processing infrastructure designed for high performance,
            security, and scalability.
          </p>
        </div>

        <Tabs defaultValue="architecture" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="architecture">System Architecture</TabsTrigger>
            <TabsTrigger value="tech">Technology Stack</TabsTrigger>
            <TabsTrigger value="features">Payment Features</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {architectureComponents.map((component, index) => (
                <Card
                  key={index}
                  className={`border-2 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedComponent === component.title ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedComponent(component.title)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {component.icon}
                      </div>
                      <CardTitle>{component.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{component.description}</p>
                    {selectedComponent === component.title && (
                      <div className="mt-4 p-4 bg-secondary/20 rounded-lg animate-fade-in">
                        <h4 className="font-medium mb-2">Technical Details:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                          {component.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tech" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {techStack.map((tech, index) => (
                <Card
                  key={index}
                  className={`border-2 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedComponent === tech.title ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedComponent(tech.title)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {tech.icon}
                      </div>
                      <CardTitle>{tech.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{tech.description}</p>
                    {selectedComponent === tech.title && (
                      <div className="mt-4 p-4 bg-secondary/20 rounded-lg animate-fade-in">
                        <h4 className="font-medium mb-2">Implementation Details:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                          {tech.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paymentFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className={`border-2 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedComponent === feature.title ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedComponent(feature.title)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {feature.icon}
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    {selectedComponent === feature.title && (
                      <div className="mt-4 p-4 bg-secondary/20 rounded-lg animate-fade-in">
                        <h4 className="font-medium mb-2">Key Features:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                          {feature.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Features
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Features2;

