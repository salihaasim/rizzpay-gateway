
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hello! I'm Aasimo AI, your RizzPay assistant. I can help you with advanced insights for optimizing your payment gateway. Ask me complex questions about payment processing, security, or feature development!",
    isUser: false,
    timestamp: new Date(),
  },
];

// More comprehensive and specialized response set
const responses = [
  "Based on your current transaction patterns, implementing a dynamic fraud detection system with machine learning could reduce false positives by approximately 35% while maintaining security standards.",
  "Our analysis suggests that optimizing your payment processing queue with a priority-based system could improve transaction throughput by 28% during peak hours without additional infrastructure costs.",
  "The current UPI failure rate of 2.3% could be reduced to under 1% by implementing a smart routing system that dynamically selects the optimal UPI processor based on real-time performance metrics.",
  "Integrating a tokenization system for recurring payments could reduce cart abandonment by 17% according to our merchant data analysis while improving overall security posture.",
  "Your merchant onboarding flow currently has a 76% completion rate. By implementing a progressive disclosure pattern and reducing form fields by 30%, we project an improvement to 89% completion.",
  "Security analysis indicates that implementing 3D Secure 2.0 with risk-based authentication could reduce fraud by 62% while only adding friction to 7% of legitimate transactions.",
  "Based on current market trends, offering unified QR codes that support multiple UPI apps could increase in-store payment conversion by 23% for your retail merchants.",
  "Our data suggests implementing an intelligent retry mechanism for failed transactions with customized timing algorithms could recover approximately 18% of initially failed payments.",
  "Implementing a smart chargeback prediction system using transaction metadata could help merchants preemptively address 41% of potential disputes before they occur.",
  "Analysis of your current settlement process indicates that optimizing the reconciliation algorithm could reduce settlement time by 40% and error rates by 67%.",
  "Implementing an AI-driven anomaly detection system could identify unusual transaction patterns 15 minutes earlier than current systems, potentially preventing 78% of fraudulent transaction attempts.",
  "Our research indicates that a machine learning-based risk scoring model tailored to your transaction data could improve fraud detection accuracy by 37% while reducing false positives by 29%.",
  "For high-volume merchants, implementing a batched processing option with intelligent scheduling could reduce processing fees by up to 12% annually without impacting customer experience.",
  "Adding dynamic receipt generation with personalized merchant branding could increase customer trust scores by 27% according to our sentiment analysis of post-transaction feedback.",
  "Implementing a real-time tax calculation and compliance system could save your merchants approximately 5.2 hours per week in administrative overhead while ensuring regulatory compliance.",
];

// Function to get more intelligent responses based on user input
const getIntelligentResponse = (userMessage: string) => {
  // Simple keyword matching for more targeted responses
  if (userMessage.toLowerCase().includes('fraud') || userMessage.toLowerCase().includes('security')) {
    return responses[0] || responses[10] || responses[11];
  } else if (userMessage.toLowerCase().includes('performance') || userMessage.toLowerCase().includes('speed')) {
    return responses[1] || responses[7];
  } else if (userMessage.toLowerCase().includes('upi') || userMessage.toLowerCase().includes('qr')) {
    return responses[2] || responses[6];
  } else if (userMessage.toLowerCase().includes('merchant') || userMessage.toLowerCase().includes('onboarding')) {
    return responses[4] || responses[13];
  } else if (userMessage.toLowerCase().includes('settlement') || userMessage.toLowerCase().includes('reconciliation')) {
    return responses[9];
  } else {
    // Return a random response for other queries
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }
};

const AasimoAI = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

    // Simulate AI thinking and responding with more intelligence
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getIntelligentResponse(inputValue),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsTyping(false);
    }, 1500);
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
    <div className="flex flex-col min-h-screen bg-secondary/20 p-4">
      <div className="flex items-center mb-4 space-x-2">
        <Button variant="ghost" size="icon" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-primary">Aasimo AI</h1>
        <Button variant="ghost" size="icon" onClick={resetConversation}>
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

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
                <p className="text-sm">{message.text}</p>
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
          placeholder="Ask me complex questions about RizzPay..."
          className="flex-grow resize-none"
          rows={2}
        />
        <Button className="self-end" onClick={handleSendMessage} disabled={isTyping}>
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default AasimoAI;
