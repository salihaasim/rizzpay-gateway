import React, { useState, useRef, useEffect } from 'react';
import { motion } from '@/components/ui/motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/landing/Footer';
import PaymentFlowAnimation from '@/components/technical/PaymentFlowAnimation';
import { 
  Database, CreditCard, ArrowDownUp, Wallet, 
  ShieldCheck, RefreshCw, Server, BadgeIndianRupee, Layers, 
  Lock, LineChart, PanelRight, DollarSign
} from 'lucide-react';

const HowItWorksTechnical = () => {
  const [activeSection, setActiveSection] = useState('overview');
  
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <LandingNavbar />
      
      <div className="container px-4 mx-auto py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            RizzPay: How Our Technology Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A deep dive into our technical architecture, payment processing flows, and security measures
          </p>
        </motion.div>
        
        {/* Interactive 3D Animation Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Interactive Payment Flow Visualization</h2>
          <PaymentFlowAnimation />
          <div className="mt-4 text-center">
            <p className="text-muted-foreground">
              Explore our payment processing flow in this interactive 3D visualization. 
              Click on different elements to see how payments move through the RizzPay system.
            </p>
          </div>
        </motion.div>
        
        {/* Interactive Tabs for Different Technical Aspects */}
        <Tabs defaultValue="architecture" className="mb-16">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="payment-flow">Payment Flow</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="ledger">Merchant Ledger</TabsTrigger>
            <TabsTrigger value="capacity">System Capacity</TabsTrigger>
          </TabsList>
          
          {/* Keep existing code for tab contents */}
          <TabsContent value="architecture">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Layers className="h-5 w-5 mr-2 text-primary" />
                      Technical Architecture
                    </CardTitle>
                    <CardDescription>
                      The RizzPay platform is built on a modern, scalable stack
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">Frontend</h4>
                        <p className="text-sm text-muted-foreground">
                          React, TypeScript, Tailwind CSS, and Shadcn UI for a responsive and 
                          intuitive user experience across all devices.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">Backend</h4>
                        <p className="text-sm text-muted-foreground">
                          Supabase (PostgreSQL database, serverless functions, authentication),
                          with Edge Functions for critical payment operations.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">State Management</h4>
                        <p className="text-sm text-muted-foreground">
                          Zustand for lightweight global state, TanStack Query for efficient 
                          server-state management and caching.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <div>
                <motion.div
                  className="relative bg-gradient-to-tr from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm h-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-xl font-medium mb-6">System Architecture Diagram</h3>
                  
                  <div className="flex flex-col space-y-8">
                    {/* Client Layer */}
                    <motion.div 
                      className="border border-primary/30 bg-white p-4 rounded-lg shadow-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h4 className="font-medium mb-2 text-primary">Client Layer</h4>
                      <div className="flex items-center justify-center space-x-4">
                        <div className="text-center p-2">
                          <div className="bg-primary/10 p-3 rounded-full inline-block mb-2">
                            <PanelRight className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-xs">Merchant Dashboard</p>
                        </div>
                        <div className="text-center p-2">
                          <div className="bg-primary/10 p-3 rounded-full inline-block mb-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-xs">Payment Page</p>
                        </div>
                        <div className="text-center p-2">
                          <div className="bg-primary/10 p-3 rounded-full inline-block mb-2">
                            <BadgeIndianRupee className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-xs">UPI Interface</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* API Layer */}
                    <motion.div 
                      className="border border-blue-300/30 bg-white p-4 rounded-lg shadow-sm relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="absolute left-1/2 -top-8 transform -translate-x-1/2">
                        <div className="w-px h-6 bg-gray-300"></div>
                        <div className="w-3 h-3 bg-gray-300 rounded-full -mt-1 -ml-1"></div>
                      </div>
                      
                      <h4 className="font-medium mb-2 text-blue-600">API & Processing Layer</h4>
                      <div className="flex items-center justify-center space-x-4">
                        <div className="text-center p-2">
                          <div className="bg-blue-500/10 p-3 rounded-full inline-block mb-2">
                            <Server className="h-5 w-5 text-blue-500" />
                          </div>
                          <p className="text-xs">API Gateway</p>
                        </div>
                        <div className="text-center p-2">
                          <div className="bg-blue-500/10 p-3 rounded-full inline-block mb-2">
                            <Lock className="h-5 w-5 text-blue-500" />
                          </div>
                          <p className="text-xs">Auth Service</p>
                        </div>
                        <div className="text-center p-2">
                          <div className="bg-blue-500/10 p-3 rounded-full inline-block mb-2">
                            <ArrowDownUp className="h-5 w-5 text-blue-500" />
                          </div>
                          <p className="text-xs">Transaction Engine</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Data Layer */}
                    <motion.div 
                      className="border border-indigo-300/30 bg-white p-4 rounded-lg shadow-sm relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <div className="absolute left-1/2 -top-8 transform -translate-x-1/2">
                        <div className="w-px h-6 bg-gray-300"></div>
                        <div className="w-3 h-3 bg-gray-300 rounded-full -mt-1 -ml-1"></div>
                      </div>
                      
                      <h4 className="font-medium mb-2 text-indigo-600">Data Layer</h4>
                      <div className="flex items-center justify-center space-x-4">
                        <div className="text-center p-2">
                          <div className="bg-indigo-500/10 p-3 rounded-full inline-block mb-2">
                            <Database className="h-5 w-5 text-indigo-500" />
                          </div>
                          <p className="text-xs">PostgreSQL Database</p>
                        </div>
                        <div className="text-center p-2">
                          <div className="bg-indigo-500/10 p-3 rounded-full inline-block mb-2">
                            <Wallet className="h-5 w-5 text-indigo-500" />
                          </div>
                          <p className="text-xs">Ledger Store</p>
                        </div>
                        <div className="text-center p-2">
                          <div className="bg-indigo-500/10 p-3 rounded-full inline-block mb-2">
                            <LineChart className="h-5 w-5 text-indigo-500" />
                          </div>
                          <p className="text-xs">Analytics Engine</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </TabsContent>
          
          {/* Keep existing content for other tabs */}
          <TabsContent value="payment-flow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ArrowDownUp className="h-5 w-5 mr-2 text-primary" />
                      Payment Processing Flow
                    </CardTitle>
                    <CardDescription>
                      How transactions move through the RizzPay system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">Payment Initiation</h4>
                        <p className="text-sm text-muted-foreground">
                          Merchants initiate transactions through our API, web dashboard, or by 
                          generating static QR codes. All payment details are encrypted and securely 
                          transmitted to our processing layer.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">Multiple Payment Methods</h4>
                        <p className="text-sm text-muted-foreground">
                          RizzPay supports UPI payments, card transactions, netbanking, and wallet transfers.
                          Each method is routed through specialized processing pipelines optimized for speed
                          and reliability.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">Settlement Process</h4>
                        <p className="text-sm text-muted-foreground">
                          After successful authorization, funds are settled into the merchant's wallet.
                          Our NEFT integration with HDFC Bank enables fast withdrawals to bank accounts 
                          with minimal fees.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <div>
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-sm h-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-xl font-medium mb-8">Transaction Flow Visualization</h3>
                  
                  <div className="space-y-8 relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-16 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {/* Step 1 */}
                    <motion.div 
                      className="flex items-start relative" 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center z-10 mr-6">
                        <span className="text-green-600 font-medium">1</span>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg flex-1">
                        <h4 className="font-medium text-green-700 mb-2">Payment Initiation</h4>
                        <p className="text-sm text-green-800">
                          Customer selects payment method (UPI/Card/Bank) and initiates transaction
                        </p>
                      </div>
                    </motion.div>
                    
                    {/* Step 2 */}
                    <motion.div 
                      className="flex items-start relative" 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center z-10 mr-6">
                        <span className="text-blue-600 font-medium">2</span>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg flex-1">
                        <h4 className="font-medium text-blue-700 mb-2">Gateway Processing</h4>
                        <p className="text-sm text-blue-800">
                          Request is encrypted and routed through our payment gateway to the appropriate processor
                        </p>
                      </div>
                    </motion.div>
                    
                    {/* Step 3 */}
                    <motion.div 
                      className="flex items-start relative" 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center z-10 mr-6">
                        <span className="text-purple-600 font-medium">3</span>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg flex-1">
                        <h4 className="font-medium text-purple-700 mb-2">Authorization</h4>
                        <p className="text-sm text-purple-800">
                          Payment is authorized by the issuing bank or UPI provider, with real-time fraud checks
                        </p>
                      </div>
                    </motion.div>
                    
                    {/* Step 4 */}
                    <motion.div 
                      className="flex items-start relative" 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center z-10 mr-6">
                        <span className="text-amber-600 font-medium">4</span>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg flex-1">
                        <h4 className="font-medium text-amber-700 mb-2">Settlement</h4>
                        <p className="text-sm text-amber-800">
                          Funds are credited to merchant wallet with transaction details recorded in ledger
                        </p>
                      </div>
                    </motion.div>
                    
                    {/* Step 5 */}
                    <motion.div 
                      className="flex items-start relative" 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center z-10 mr-6">
                        <span className="text-teal-600 font-medium">5</span>
                      </div>
                      <div className="bg-teal-50 p-4 rounded-lg flex-1">
                        <h4 className="font-medium text-teal-700 mb-2">Notification</h4>
                        <p className="text-sm text-teal-800">
                          All parties receive real-time notifications and receipts for transaction confirmation
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                      Security Measures
                    </CardTitle>
                    <CardDescription>
                      How RizzPay keeps transactions and merchant data secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">End-to-End Encryption</h4>
                        <p className="text-sm text-muted-foreground">
                          All data is encrypted in transit using TLS 1.3 and at rest using AES-256
                          encryption, ensuring sensitive payment information remains secure.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">Multi-factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          Merchant accounts are protected with multi-factor authentication,
                          with biometric options available for mobile users.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">Fraud Detection</h4>
                        <p className="text-sm text-muted-foreground">
                          Real-time transaction monitoring with AI-powered anomaly detection
                          helps identify and prevent fraudulent activities.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">Regulatory Compliance</h4>
                        <p className="text-sm text-muted-foreground">
                          RizzPay maintains compliance with PCI-DSS standards and RBI regulations
                          for payment processing in India.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <div>
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-sm h-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-xl font-medium mb-6">Security Architecture</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Lock className="h-4 w-4 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-blue-800">Data Protection Layers</h4>
                      </div>
                      <p className="text-sm text-blue-700">
                        Multiple encryption layers protect data at every point in the transaction flow
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-green-50 p-4 rounded-lg border border-green-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <ShieldCheck className="h-4 w-4 text-green-600" />
                        </div>
                        <h4 className="font-medium text-green-800">Tokenization</h4>
                      </div>
                      <p className="text-sm text-green-700">
                        Sensitive data is replaced with unique tokens for secure processing
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-amber-50 p-4 rounded-lg border border-amber-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <RefreshCw className="h-4 w-4 text-amber-600" />
                        </div>
                        <h4 className="font-medium text-amber-800">Real-time Monitoring</h4>
                      </div>
                      <p className="text-sm text-amber-700">
                        Continuous system monitoring for suspicious activities
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="col-span-2 bg-purple-50 p-4 rounded-lg border border-purple-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0 }}
                    >
                      <h4 className="font-medium text-purple-800 mb-2">Security Certifications</h4>
                      <div className="flex space-x-4 justify-around">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                            <span className="font-bold text-primary">PCI</span>
                          </div>
                          <p className="text-xs text-purple-700">PCI-DSS</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                            <span className="font-bold text-primary">ISO</span>
                          </div>
                          <p className="text-xs text-purple-700">ISO 27001</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                            <span className="font-bold text-primary">RBI</span>
                          </div>
                          <p className="text-xs text-purple-700">RBI Compliant</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ledger">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-primary" />
                      Merchant Ledger System
                    </CardTitle>
                    <CardDescription>
                      How merchant transactions are recorded and reconciled
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">Double-Entry Accounting</h4>
                        <p className="text-sm text-muted-foreground">
                          RizzPay uses a double-entry accounting system to ensure all transactions 
                          are properly balanced and can be audited. Each transaction affects at 
                          least two accounts - a debit to one and a credit to another.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">Real-time Balances</h4>
                        <p className="text-sm text-muted-foreground">
                          Merchant wallet balances are updated in real-time as transactions occur,
                          providing instant visibility into available funds and pending settlements.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">Reconciliation Engine</h4>
                        <p className="text-sm text-muted-foreground">
                          Our automated reconciliation system matches incoming payments with merchant 
                          accounts, ensuring accurate and timely settlement with detailed transaction logs.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <div>
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-sm h-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-xl font-medium mb-6">Ledger Architecture</h3>
                  
                  <div className="space-y-6">
                    <motion.div 
                      className="border border-gray-200 rounded-lg overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="bg-gray-50 p-3 border-b border-gray-200">
                        <h4 className="font-medium">Transaction Record Structure</h4>
                      </div>
                      <div className="p-4">
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Transaction ID:</div>
                            <div className="text-muted-foreground">Unique identifier for each transaction</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Timestamp:</div>
                            <div className="text-muted-foreground">Precise date and time of transaction</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Amount:</div>
                            <div className="text-muted-foreground">Transaction value with currency</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Source Account:</div>
                            <div className="text-muted-foreground">Origin of funds</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Destination Account:</div>
                            <div className="text-muted-foreground">Recipient of funds</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Transaction Type:</div>
                            <div className="text-muted-foreground">Payment, transfer, withdrawal, etc.</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Status:</div>
                            <div className="text-muted-foreground">Current state of transaction</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Metadata:</div>
                            <div className="text-muted-foreground">Additional transaction details</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-medium mb-2 text-blue-800">Transaction Immutability</h4>
                        <p className="text-sm text-blue-700">
                          Once recorded, transactions cannot be modified, ensuring audit integrity
                        </p>
                      </div>
                      
                      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                        <h4 className="font-medium mb-2 text-emerald-800">Automatic Reconciliation</h4>
                        <p className="text-sm text-emerald-700">
                          System automatically matches payments with merchant accounts
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-amber-50 p-4 rounded-lg border border-amber-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h4 className="font-medium mb-2 text-amber-800">Settlement Schedule</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-amber-700">UPI Payments:</span>
                          <span className="font-medium text-amber-900">Instant Settlement</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-700">Card Payments:</span>
                          <span className="font-medium text-amber-900">T+1 Settlement</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-700">Bank Transfers:</span>
                          <span className="font-medium text-amber-900">T+1 Settlement</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-700">Wallet Transfers:</span>
                          <span className="font-medium text-amber-900">Instant Settlement</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="capacity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Server className="h-5 w-5 mr-2 text-primary" />
                      System Capacity
                    </CardTitle>
                    <CardDescription>
                      RizzPay's robust infrastructure can handle enterprise-level transaction volumes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-medium mb-2">Transaction Processing</h4>
                        <p className="text-sm text-muted-foreground">
                          Our system is capable of processing up to 1,000 transactions per second (TPS),
                          enabling 86.4 million transactions per day and 2.6 billion per month.
                        </p
