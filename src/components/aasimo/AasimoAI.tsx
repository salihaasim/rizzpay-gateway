
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, RefreshCw, ArrowLeft, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  source?: string;
};

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hello! I'm Aasimo AI, your RizzPay documentation assistant. I can help you find information about RizzPay's payment systems, integration guides, platform features, and processing capacity. Ask me anything about RizzPay!",
    isUser: false,
    timestamp: new Date(),
  },
];

// Knowledge base sources
const documentationSources = {
  payment_readme: "Payment processing details and workflows",
  webhook_readme: "Webhook integration and implementation guides",
  escrow: "Escrow account system explanation",
  server_requirements: "Server infrastructure requirements",
  merchant_onboarding: "Merchant onboarding process",
  payment_capacity: "Payment system capacity and limits",
  research_development: "R&D documentation and roadmap",
  deployment: "Deployment checklists and procedures",
  color_theme: "RizzPay design system and color theme"
};

// Documentation content - in a real app, this would be fetched from a database or API
const documentationContent = {
  payment_flow: `RizzPay processes payments through a sequence of well-defined steps, from initiation to settlement. The diagram below illustrates the flow:
  
  1. Payment Initiation: User enters payment amount and basic information
  2. Payment Method Selection: User selects from available payment methods
  3. Payment Processing: For Card payments: Razorpay SDK handles payment securely, For UPI: QR code is generated for scanning with UPI apps, For NEFT: Bank details are provided for manual transfer
  4. Transaction States: The transaction goes through various processing states
  5. Confirmation and Recording: Transaction is stored in Supabase database
  6. Settlement Process: Funds are settled to merchant account`,
  
  upi_payments: `UPI Payments in RizzPay support:
  - Direct UPI ID payments
  - QR code generation for easy payments
  - Instant notification system
  - Current UPI failure rate of 2.3% could be reduced to under 1% by implementing a smart routing system that dynamically selects the optimal UPI processor based on real-time performance metrics.`,
  
  webhooks: `RizzPay provides a simple webhook integration that allows merchants to accept payments directly from their websites or applications.
  
  Getting Started:
  1. Generate Your Webhook Token from your Rizzpay merchant dashboard in the Webhooks section.
  2. Implement the Integration: Add the Rizzpay payment button or form to your website/application.
  3. Test Your Integration using our sandbox environment.
  
  After payment completion, Rizzpay will redirect the customer to your callback_url with transaction_id and status parameters.`,
  
  escrow_system: `RizzPay's escrow system is a secure holding account that temporarily holds funds during transactions until all conditions are met. This ensures:
  - Protected transactions for all parties
  - Reduced fraud risk
  - Regulatory compliance
  - Transaction transparency
  
  The escrow account is managed through HDFC Bank's API integration for secure fund transfers.`,
  
  merchant_onboarding: `The merchant onboarding process involves:
  1. Registration with business details
  2. Document verification
  3. Bank account linking
  4. API key generation
  5. Webhook configuration
  6. Test transaction processing
  
  Current merchant onboarding flow has a 76% completion rate. By implementing a progressive disclosure pattern and reducing form fields by 30%, we project an improvement to 89% completion.`,
  
  security_measures: `RizzPay implements robust security measures:
  - End-to-end encryption for all transactions
  - Tokenization of sensitive payment information
  - Multi-factor authentication for high-value transactions
  - Real-time fraud detection systems
  - Compliance with PCI-DSS standards
  - Regular security audits
  
  Security analysis indicates that implementing 3D Secure 2.0 with risk-based authentication could reduce fraud by 62% while only adding friction to 7% of legitimate transactions.`,
  
  tech_stack: `RizzPay is built on:
  - Frontend: React, TypeScript, Tailwind CSS, Shadcn UI
  - Backend: Supabase (PostgreSQL database, authentication, serverless functions)
  - State Management: Zustand
  - Data Fetching: TanStack Query
  - Routing: React Router DOM
  - Form Handling: React Hook Form, Zod
  - Notifications: Sonner`,
  
  payment_methods: `RizzPay supports multiple payment methods:
  1. Card Payments
     - Credit and debit card processing
     - Secure tokenization of card details
     - Support for all major card networks
  
  2. UPI Payments
     - Direct UPI ID payments
     - QR code generation for easy payments
     - Instant notification system
  
  3. NEFT/RTGS Bank Transfers
     - Integration with HDFC Bank's NEFT API
     - Secure bank transfer processing
     - Support for all major Indian banks
  
  4. RizzPay Wallet
     - Internal digital wallet system
     - Instant transfers between users
     - Low-fee transactions`,
  
  monitoring_system: `The RizzPay monitoring system provides comprehensive oversight of:
  - System health and performance metrics
  - Payment gateway status and transaction success rates
  - Security events and potential threats
  - API performance and error rates
  - Database connection status
  - Cache efficiency metrics
  - Real-time active user monitoring`,
  
  // Adding payment capacity information from RIZZPAY_PAYMENT_CAPACITY.md
  payment_capacity: `RizzPay payment processing capacity:
  
  Transaction Volume:
  - Peak Transaction Processing: Up to 1,000 transactions per second (TPS)
  - Daily Processing Capacity: Approximately 86.4 million transactions per day
  - Monthly Transaction Volume: Up to 2.6 billion transactions per month
  
  Financial Limits:
  - Per Transaction Limit: ₹10,00,000 (approximately $12,000 USD)
  - Daily Processing Value: Up to ₹5,000 crores (approximately $600 million USD)
  - Monthly Value Limit: ₹150,000 crores (approximately $18 billion USD)
  
  System Performance:
  - Average Payment Initiation: < 200ms
  - Payment Authorization: < 1.5 seconds
  - System Uptime: 99.99% (less than 53 minutes of downtime per year)
  - Transaction Success Rate: > 99.5% for properly formatted requests`,
  
  storage_capacity: `RizzPay storage capacity:
  - Active Transaction Records: 100 million detailed transaction records
  - Archival Storage: Unlimited with tiered storage system
  - Transaction Data Retention: 7 years for completed transactions
  - Receipt/Invoice Storage: Unlimited with CDN support
  - Document Storage: Up to 10GB per merchant account`,
  
  reliability_metrics: `RizzPay reliability metrics:
  - System Uptime: 99.99% (less than 53 minutes of downtime per year)
  - Transaction Success Rate: > 99.5% for properly formatted requests
  - Error Recovery: Automatic retry system for failed transactions
  - Maximum Sustained TPS: 1,200 for 1 hour (with elastic scaling)
  - Recovery Time: < 5 seconds after 200% normal load`,
  
  mobile_performance: `RizzPay mobile processing capacity:
  
  Android Devices:
  - Minimum Requirements: Android 6.0 (Marshmallow) or higher
  - Recommended: Android 9.0 or higher for optimal performance
  - Memory Usage: < 100MB RAM during transaction processing
  
  iOS Devices:
  - Minimum Requirements: iOS 12.0 or higher
  - Recommended: iOS 14.0 or higher for optimal performance
  - Memory Usage: < 80MB RAM during transaction processing`,
  
  compliance_standards: `RizzPay complies with:
  - PCI DSS Level 1: Highest level of payment card industry compliance
  - ISO 27001: Information security management standards
  - RBI Payment Aggregator Guidelines: Full compliance with Reserve Bank of India regulations
  - GDPR & Data Protection Act: Complete compliance with data protection standards`
};

// Improved search function to better match queries about specific metrics and numbers
const searchDocumentation = (query: string) => {
  const searchTerms = query.toLowerCase().split(' ');
  
  // Define key terms that should have higher priority in the search
  const priorityTerms = {
    'transaction': ['payment_capacity', 'payment_flow'],
    'process': ['payment_capacity', 'payment_flow'],
    'per': ['payment_capacity'],
    'day': ['payment_capacity'],
    'daily': ['payment_capacity'],
    'volume': ['payment_capacity'],
    'limit': ['payment_capacity'],
    'amount': ['payment_capacity'],
    'value': ['payment_capacity'],
    'crore': ['payment_capacity'],
    'million': ['payment_capacity'],
    'billion': ['payment_capacity'],
    'capacity': ['payment_capacity', 'storage_capacity'],
    'tps': ['payment_capacity'],
    'second': ['payment_capacity'],
    'uptime': ['payment_capacity', 'reliability_metrics'],
    'reliability': ['reliability_metrics'],
    'success': ['reliability_metrics'],
    'mobile': ['mobile_performance'],
    'android': ['mobile_performance'],
    'ios': ['mobile_performance'],
    'compliance': ['compliance_standards'],
    'webhook': ['webhooks'],
    'escrow': ['escrow_system'],
    'merchant': ['merchant_onboarding'],
    'upi': ['upi_payments', 'payment_methods'],
    'security': ['security_measures'],
    'monitoring': ['monitoring_system']
  };
  
  // Check if query is specifically asking about transaction volumes or capacity
  const isCapacityQuestion = /how (much|many)|capacity|volume|per (day|second)|daily|transaction.*(per|day|capacity|volume|process|handle)/i.test(query);
  
  // If it's a capacity question, prioritize the payment_capacity content
  if (isCapacityQuestion) {
    // For capacity questions, focus on direct answers from payment_capacity
    const relevantInfo = documentationContent.payment_capacity;
    
    // Further filter based on specific aspects of capacity
    if (/day|daily/i.test(query)) {
      const dayMatch = relevantInfo.match(/Daily Processing.*?₹5,000 crores.*?USD\)/s);
      if (dayMatch) return dayMatch[0];
    }
    
    if (/transaction.*second|tps/i.test(query)) {
      const tpsMatch = relevantInfo.match(/Peak Transaction Processing.*?per second/s);
      if (tpsMatch) return tpsMatch[0];
    }
    
    // Default to returning the full capacity information
    return relevantInfo;
  }
  
  // Search through all documentation content with weighted relevance
  const results: {source: string, content: string, relevance: number}[] = [];
  
  Object.entries(documentationContent).forEach(([key, content]) => {
    const lowerContent = content.toLowerCase();
    
    // Calculate relevance score based on term matches
    let relevance = 0;
    
    // Check if any priority terms are in the query
    searchTerms.forEach(term => {
      // Check if this term is a priority term
      if (term.length > 2 && priorityTerms[term as keyof typeof priorityTerms]) {
        // If the current content key is in the priority list for this term, add extra relevance
        if (priorityTerms[term as keyof typeof priorityTerms].includes(key)) {
          relevance += 5;
        }
      }
      
      // Count normal term occurrences
      if (term.length > 2) {
        const matches = (lowerContent.match(new RegExp(term, 'g')) || []).length;
        relevance += matches;
      }
    });
    
    if (relevance > 0) {
      results.push({
        source: key,
        content: content,
        relevance: relevance
      });
    }
  });
  
  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);
  
  // Return the most relevant result, or a default response
  if (results.length > 0) {
    return results[0].content;
  } else {
    return "I couldn't find specific information about that in our documentation. Could you try rephrasing your question or ask about a different aspect of RizzPay?";
  }
};

const AasimoAI = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeSource, setActiveSource] = useState<string>("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    console.log("Query:", inputValue); // Debug logging

    // Search documentation based on the query
    setTimeout(() => {
      const documentationResponse = searchDocumentation(inputValue);
      console.log("Response source found:", documentationResponse.substring(0, 50) + "..."); // Debug logging
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: documentationResponse,
        isUser: false,
        timestamp: new Date(),
        source: activeSource !== "all" ? activeSource : undefined
      };
      
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    setMessages(initialMessages);
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <div className="flex items-center gap-4 p-4 border-b bg-white">
        <Button variant="ghost" size="icon" onClick={goBack} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-primary">Aasimo AI</h1>
        <p className="text-muted-foreground text-sm hidden md:block">
          RizzPay Documentation Assistant
        </p>
        <Button variant="ghost" size="icon" onClick={resetConversation} className="ml-auto">
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 flex-grow">
        {/* Documentation Navigator - Hidden on mobile */}
        <div className="hidden md:block border-r p-4 bg-white">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Documentation Sources</h3>
            <Select value={activeSource} onValueChange={setActiveSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documentation</SelectItem>
                {Object.entries(documentationSources).map(([key, description]) => (
                  <SelectItem key={key} value={key}>
                    {description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium mb-2">Quick Topics</h3>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm h-auto py-2"
              onClick={() => {
                setInputValue("What is RizzPay's transaction capacity per day?");
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Daily Transaction Capacity
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm h-auto py-2"
              onClick={() => {
                setInputValue("How many transactions per second can RizzPay handle?");
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Transactions Per Second
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm h-auto py-2"
              onClick={() => {
                setInputValue("What is the daily processing value limit?");
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Daily Processing Value
            </Button>
            {Object.keys(documentationContent).slice(0, 5).map(topic => (
              <Button 
                key={topic} 
                variant="ghost" 
                className="w-full justify-start text-sm h-auto py-2"
                onClick={() => {
                  const topicName = topic.replace(/_/g, ' ');
                  setInputValue(`Tell me about ${topicName}`);
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                {topic.replace(/_/g, ' ')}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Chat Interface */}
        <div className="col-span-1 md:col-span-3 flex flex-col p-4">
          <Card className="flex-grow p-4 mb-4 overflow-auto max-h-[calc(100vh-200px)]">
            <div className="flex flex-col space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-secondary text-foreground rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    {message.source && (
                      <p className="text-xs mt-2 font-medium opacity-70">
                        Source: {message.source.replace(/_/g, ' ')}
                      </p>
                    )}
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-secondary text-foreground rounded-tl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </Card>

          <div className="flex space-x-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about RizzPay documentation..."
              className="flex-grow resize-none"
              rows={2}
            />
            <Button className="self-end" onClick={handleSendMessage} disabled={isTyping}>
              <SendIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AasimoAI;
