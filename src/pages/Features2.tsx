
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Database, Server, Shield, Zap, Layers, Code, GitBranch, RefreshCcw } from 'lucide-react';

const Features2 = () => {
  const [selectedComponent, setSelectedComponent] = useState('');

  const architectureComponents = [
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: "Supabase Integration",
      description: "PostgreSQL database with real-time capabilities and built-in authentication."
    },
    {
      icon: <Server className="h-6 w-6 text-primary" />,
      title: "API Gateway",
      description: "Secure API routing and request handling for payment processing."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Security Layer",
      description: "End-to-end encryption and multi-factor authentication."
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Transaction Engine",
      description: "High-performance payment processing up to 1,000 TPS."
    }
  ];

  const techStack = [
    {
      icon: <Code className="h-6 w-6 text-primary" />,
      title: "Frontend",
      description: "React + TypeScript, Tailwind CSS, Shadcn UI components"
    },
    {
      icon: <GitBranch className="h-6 w-6 text-primary" />,
      title: "State Management",
      description: "Zustand for global state, React Query for server state"
    },
    {
      icon: <Layers className="h-6 w-6 text-primary" />,
      title: "Backend Services",
      description: "Serverless functions, WebSocket support, Webhook system"
    },
    {
      icon: <RefreshCcw className="h-6 w-6 text-primary" />,
      title: "Integration Layer",
      description: "RESTful APIs, SDK support, developer tools"
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="architecture">System Architecture</TabsTrigger>
            <TabsTrigger value="tech">Technology Stack</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {architectureComponents.map((component, index) => (
                <Card
                  key={index}
                  className="border-2 cursor-pointer transition-all hover:border-primary/50"
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
                    <p className="text-muted-foreground">{component.description}</p>
                    {selectedComponent === component.title && (
                      <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-medium mb-2">Technical Details:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          <li>Processing capacity: 1,000 TPS</li>
                          <li>99.99% uptime guarantee</li>
                          <li>Real-time monitoring and alerts</li>
                          <li>Automatic scaling and failover</li>
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
                  className="border-2 cursor-pointer transition-all hover:border-primary/50"
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
                    <p className="text-muted-foreground">{tech.description}</p>
                    {selectedComponent === tech.title && (
                      <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-medium mb-2">Implementation Details:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground">
                          <li>Modern tech stack with TypeScript</li>
                          <li>Component-driven architecture</li>
                          <li>Comprehensive test coverage</li>
                          <li>CI/CD pipeline integration</li>
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
