
import React, { useState, useMemo } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMediaQuery, mediaQueries } from '@/hooks/use-media-query';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatCards from '@/components/dashboard/DashboardStatCards';
import DashboardAnalyticsSection from '@/components/dashboard/DashboardAnalyticsSection';
import DashboardTransactionsSection from '@/components/dashboard/DashboardTransactionsSection';

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
      <div className="container max-w-7xl mx-auto">
        <DashboardHeader 
          merchantName={merchantName}
          userRole={userRole}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="my-6">
          <DashboardStatCards />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DashboardAnalyticsSection />
          <DashboardTransactionsSection />
        </div>
        
        {/* Recent Pay-Ins Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Pay-Ins</h3>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-3 font-medium text-sm text-gray-600">ID</th>
                  <th className="text-left py-3 px-3 font-medium text-sm text-gray-600">Details</th>
                  <th className="text-left py-3 px-3 font-medium text-sm text-gray-600">Amount</th>
                  <th className="text-left py-3 px-3 font-medium text-sm text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[1, 2, 3].map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <div className="flex items-center">
                        <div className="h-7 w-7 rounded-full bg-gray-200 mr-2"></div>
                        <span className="text-sm">TXN-{Math.floor(Math.random() * 10000)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">Payment from Customer {item}</td>
                    <td className="py-3 px-3 text-sm font-medium">₹{(Math.random() * 10000).toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Successful</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Transaction Mode Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">Transaction Mode</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payments by Time</span>
                <div className="h-2.5 w-32 md:w-48 bg-gray-200 rounded">
                  <div className="h-full w-3/4 bg-blue-500 rounded"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">UPI</span>
                <div className="h-2.5 w-32 md:w-48 bg-gray-200 rounded">
                  <div className="h-full w-1/2 bg-blue-500 rounded"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bank</span>
                <div className="h-2.5 w-32 md:w-48 bg-gray-200 rounded">
                  <div className="h-full w-2/3 bg-blue-500 rounded"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Cards</span>
                <div className="h-2.5 w-32 md:w-48 bg-gray-200 rounded">
                  <div className="h-full w-1/4 bg-blue-500 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
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
