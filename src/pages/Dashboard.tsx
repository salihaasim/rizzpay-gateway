
import React, { useState, useMemo } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMediaQuery, mediaQueries } from '@/hooks/use-media-query';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatCards from '@/components/dashboard/DashboardStatCards';
import DashboardAnalyticsSection from '@/components/dashboard/DashboardAnalyticsSection';

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
      <div className="container max-w-7xl mx-auto px-4 py-8">
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
          <DashboardAnalyticsSection />
          
          {/* Quick Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Payment</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Customer Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter customer name"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="customer@email.com"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Required for receipt</p>
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount (₹)</label>
                <input
                  type="number"
                  id="amount"
                  placeholder="0.00"
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition-colors">
                Generate Payment Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
