
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
    text: "Hello! I'm Aasimo AI, your RizzPay assistant. I can help you with ideas and suggestions for optimizing your payment gateway. How can I assist you today?",
    isUser: false,
    timestamp: new Date(),
  },
];

const responses = [
  "You could implement a loyalty points system for repeat customers. This would encourage more transactions through your payment gateway.",
  "Consider adding a feature that allows merchants to create customized payment links with their branding. This can improve conversion rates.",
  "UPI AutoPay for recurring payments could be a valuable feature for subscription-based businesses in the Indian market.",
  "Adding a detailed analytics dashboard with payment success rates by payment method could help merchants optimize their checkout process.",
  "You might want to consider implementing a feature that allows merchants to offer EMI options for higher-value purchases.",
  "A mobile app specifically designed for merchants to track their transactions on the go could increase platform engagement.",
  "Implementing OTP-based authentication for high-value transactions could enhance security and reduce fraud.",
  "Consider adding a merchant verification system to build trust with customers who are making payments.",
  "Automated reconciliation tools could save merchants significant time in accounting processes.",
  "Adding support for QR code payments in physical stores could expand your payment gateway's versatility.",
  "A simple API documentation page with code samples would make integration easier for developers.",
  "Consider implementing a chatbot to help customers through the payment process or answer FAQs about payment issues.",
  "A feature to automatically retry failed transactions could improve overall payment success rates.",
  "Implementing a system to detect and prevent double charges would enhance customer trust.",
  "Adding detailed transaction receipt options with customization for merchants could enhance the post-purchase experience.",
];

const getRandomResponse = () => {
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
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

    // Simulate AI thinking and responding
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getRandomResponse(),
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
          placeholder="Type your message here..."
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
