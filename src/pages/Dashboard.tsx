
import React, { useState, useMemo } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMediaQuery } from '@/hooks/use-media-query';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatCards from '@/components/dashboard/DashboardStatCards';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { userRole, userEmail } = useTransactionStore();
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? 'admin' : 'merchant');
  
  // Merchant name from email (simplified version)
  const merchantName = useMemo(() => {
    if (!userEmail) return "FUTURE FARMER GROUP";
    return userEmail.split('@')[0].toUpperCase() + ' GROUP';
  }, [userEmail]);

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <DashboardHeader 
          merchantName={merchantName}
          userRole={userRole}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="my-8">
          <DashboardStatCards />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Payment Card - Improved layout and spacing */}
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-primary">
                Quick Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Customer Name</Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Enter customer name"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="customer@email.com"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Required for payment receipt</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium">Amount (₹)</Label>
                  <Input
                    type="number"
                    id="amount"
                    placeholder="0.00"
                    className="w-full"
                  />
                </div>
                
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                  Generate Payment Link
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Additional card for dashboard balance */}
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-primary">
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Available Balance</h4>
                  <p className="text-3xl font-bold">₹24,500.00</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">Today's Transactions</h4>
                    <p className="text-xl font-semibold mt-1">12</p>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">Pending Approvals</h4>
                    <p className="text-xl font-semibold mt-1">3</p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    View Transaction History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
