
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, FileText, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PayoutPage = () => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const features = [
    {
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      title: "Bulk Processing",
      description: "Upload CSV/Excel files with up to 1000 payouts"
    },
    {
      icon: <Clock className="h-6 w-6 text-green-500" />,
      title: "Fast Processing",
      description: "Quick processing within 5-10 minutes"
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-500" />,
      title: "Secure & Encrypted",
      description: "Bank-grade security with AES encryption"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Payout</h1>
          <p className="text-muted-foreground">Advanced bulk payout processing</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(125000)}</p>
        </div>
      </div>

      {/* Main CTA Card */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Payout</h2>
                <p className="text-gray-600 mb-4">Process bulk payouts with our advanced features</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>• Bulk upload support</span>
                  <span>• Template downloads</span>
                  <span>• Real-time tracking</span>
                </div>
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={() => navigate('/merchant/advanced-payout')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                {feature.icon}
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Statistics</CardTitle>
          <CardDescription>Your payout performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">₹8.5L</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">1,234</p>
              <p className="text-sm text-muted-foreground">Total Payouts</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">98.5%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">2.5 min</p>
              <p className="text-sm text-muted-foreground">Avg Processing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayoutPage;
