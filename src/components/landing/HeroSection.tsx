
import React from 'react';
import { Button } from '@/components/ui/button';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, CreditCard, Zap } from 'lucide-react';
import { motion } from '@/components/ui/motion';

const HeroSection = () => {
  const { isAuthenticated } = useMerchantAuth();
  const { userRole } = useTransactionStore();

  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-background z-[-1]" />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[35%] h-[35%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[35%] h-[35%] rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
              <span className="text-xs font-medium">Next-Gen Payment Solution</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Seamless Payments for Everyone
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              Rizzpay provides a secure, fast and reliable payment gateway for businesses and consumers. 
              Integrate UPI, cards, and more with a single platform.
            </p>

            <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Quick Setup</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Low Fees</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>24/7 Support</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link to="/auth">
                <Button size="lg" className="bg-[#0052FF] text-white hover:bg-[#0045DB]">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="#features">
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative bg-white rounded-xl shadow-xl p-6 border border-border/50">
              <div className="absolute -top-4 -right-4 bg-primary/10 text-primary px-4 py-1 rounded-full text-xs font-medium">
                Easy Integration
              </div>
              <h3 className="text-lg font-medium mb-4">PHP Integration Example</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <pre>
{`<?php
// Simple PHP integration with RizzPay
$apiKey = 'YOUR_API_KEY';
$amount = 999.00;
$currency = 'INR';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.rizzpay.com/v1/payment');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'amount' => $amount,
    'currency' => $currency,
    'description' => 'Order #123456',
    'callback_url' => 'https://yourwebsite.com/callback'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$result = json_decode($response, true);
curl_close($ch);

// Redirect to payment page
header('Location: ' . $result['payment_url']);
?>`}
                </pre>
              </div>
              <div className="mt-4 flex justify-between items-center text-sm">
                <div className="flex items-center text-muted-foreground">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Multiple payment methods</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Zap className="h-4 w-4 mr-2" />
                  <span>Fast processing</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);
