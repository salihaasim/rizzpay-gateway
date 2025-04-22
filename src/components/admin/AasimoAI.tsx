
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
    text: "Hello! I'm Aasimo AI, your RizzPay documentation assistant. I can help you find information about RizzPay's payment systems, integration guides, platform features, and processing capacity. Ask me anything about RizzPay!",
    isUser: false,
    timestamp: new Date(),
  },
];

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

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // We'll implement the actual ChatGPT integration here
    setTimeout(() => {
      // Placeholder response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand you're asking about RizzPay. Let me help you with that.",
        isUser: false,
        timestamp: new Date(),
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
    navigate('/admin');
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

      <Card className="flex-grow p-4 m-4 overflow-auto">
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

      <div className="flex space-x-2 p-4">
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
  );
};

export default AasimoAI;
