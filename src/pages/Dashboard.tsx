import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatCards from '@/components/dashboard/DashboardStatCards';
import DashboardAnalyticsSection from '@/components/dashboard/DashboardAnalyticsSection';
import DashboardTransactionsSection from '@/components/dashboard/DashboardTransactionsSection';
import VpaDashboardSection from '@/components/dashboard/VpaDashboardSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p>Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p>Error: {error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <DashboardHeader />
        <DashboardStatCards />

        {/* Add VPA Tab */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vpa">VPA Payments</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardAnalyticsSection />
            <DashboardTransactionsSection />
          </TabsContent>

          <TabsContent value="vpa" className="space-y-6">
            <VpaDashboardSection 
              merchantId="mock-merchant-id"
              businessName="Test Business"
              merchantEmail="merchant@example.com"
            />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <DashboardTransactionsSection />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <DashboardAnalyticsSection />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
