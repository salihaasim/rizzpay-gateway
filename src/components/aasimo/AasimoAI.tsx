
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
    text: "Hello! I'm Aasimo AI, your RizzPay documentation assistant. I can help you find information about RizzPay's payment systems, integration guides, and platform features. Ask me anything about RizzPay!",
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
};

// Function to search documentation based on user query
const searchDocumentation = (query: string) => {
  const searchTerms = query.toLowerCase().split(' ');
  
  // Search through all documentation content
  const results: {source: string, content: string, relevance: number}[] = [];
  
  Object.entries(documentationContent).forEach(([key, content]) => {
    const lowerContent = content.toLowerCase();
    
    // Calculate relevance score based on term matches
    let relevance = 0;
    searchTerms.forEach(term => {
      if (term.length > 2) { // Ignore very short terms
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

    // Search documentation based on the query
    setTimeout(() => {
      const documentationResponse = searchDocumentation(inputValue);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: documentationResponse,
        isUser: false,
        timestamp: new Date(),
        source: activeSource !== "all" ? activeSource : undefined
      };
      
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsTyping(false);
    }, 1000);
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
            {Object.keys(documentationContent).map(topic => (
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
