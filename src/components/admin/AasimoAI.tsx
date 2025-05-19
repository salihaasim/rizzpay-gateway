
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

// RizzPay documentation assistant AI component
type Message = {
  id: string;
  role: string;
  content: string;
  timestamp: Date;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://mogqmymxnienxqactuym.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZ3FteW14bmllbnhxYWN0dXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MzEwNTgsImV4cCI6MjA1ODEwNzA1OH0.Z2bzbA8aQQha2NhgA0M1F2R56Ewv8npqRgCj2S_70h4";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hello! I'm Aasimo AI, your RizzPay documentation assistant. I can help you find information about RizzPay's payment systems, integration guides, platform features, and processing capacity. Ask me anything about RizzPay!",
    timestamp: new Date(),
  },
];

const AasimoAI = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Format messages for OpenAI API
      const formattedMessages = messages
        .filter(msg => msg.id !== '1') // Skip the initial welcome message
        .concat(userMessage)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Call our edge function
      const { data, error } = await supabase.functions.invoke('aasimo-ai', {
        body: { 
          messages: formattedMessages,
          userRole: 'admin'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Add AI response to chat
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error('Error calling Aasimo AI:', error);
      toast.error('Failed to get a response from Aasimo AI');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    setMessages(initialMessages);
    toast.success('Conversation reset');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-secondary/10 rounded-lg">
      <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-lg">
        <div>
          <h1 className="text-2xl font-bold text-primary">Aasimo AI</h1>
          <p className="text-muted-foreground text-sm">
            RizzPay Documentation Assistant
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={resetConversation} title="Reset conversation">
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

      <Card className="flex-grow p-4 m-4 overflow-auto border rounded-lg shadow-sm">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-secondary text-foreground rounded-tl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
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

      <div className="flex space-x-2 p-4 bg-white rounded-b-lg">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about RizzPay documentation..."
          className="flex-grow resize-none"
          rows={2}
        />
        <Button className="self-end" onClick={handleSendMessage} disabled={isTyping || inputValue.trim() === ''}>
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default AasimoAI;
