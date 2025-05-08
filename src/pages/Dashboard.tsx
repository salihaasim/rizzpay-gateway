
import React, { useState, useMemo } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { useMediaQuery, mediaQueries } from '@/hooks/use-media-query';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStatCards from '@/components/dashboard/DashboardStatCards';
import DashboardAnalyticsSection from '@/components/dashboard/DashboardAnalyticsSection';
import DashboardTransactionsSection from '@/components/dashboard/DashboardTransactionsSection';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

const Dashboard = () => {
  const { userRole, userEmail } = useTransactionStore();
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? 'admin' : 'merchant');
  const isMobile = useMediaQuery(mediaQueries.isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile ? true : false);
  
  // Merchant name from email (simplified version)
  const merchantName = useMemo(() => {
    if (!userEmail) return "FUTURE FARMER GROUP";
    return userEmail.split('@')[0].toUpperCase() + ' GROUP';
  }, [userEmail]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f7]">
      <div className="flex flex-1">
        {/* Sidebar */}
        <DashboardSidebar 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
        />
        
        {/* Main content */}
        <div className={`flex-1 min-h-screen transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-0 lg:ml-[280px]"}`}>
          <div className="content-wrapper p-4 sm:p-6">
            <DashboardHeader 
              merchantName={merchantName}
              userRole={userRole}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            
            <DashboardStatCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <DashboardAnalyticsSection />
              <DashboardTransactionsSection />
            </div>
            
            {/* Recent Pay-Ins Section */}
            <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
              <h3 className="text-lg font-semibold mb-4">Recent Pay-Ins</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Details</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((item) => (
                      <tr key={item} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 mr-3"></div>
                            <span>TXN-{Math.floor(Math.random() * 10000)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">Payment from Customer {item}</td>
                        <td className="py-3 px-4">₹{(Math.random() * 10000).toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Successful</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Transaction Mode Section */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="text-lg font-semibold mb-4">Transaction Mode</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Payments by Time</span>
                  <div className="h-2 w-40 bg-gray-200 rounded">
                    <div className="h-full w-3/4 bg-blue-500 rounded"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>UPI</span>
                  <div className="h-2 w-40 bg-gray-200 rounded">
                    <div className="h-full w-1/2 bg-blue-500 rounded"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Bank</span>
                  <div className="h-2 w-40 bg-gray-200 rounded">
                    <div className="h-full w-2/3 bg-blue-500 rounded"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Bank</span>
                  <div className="h-2 w-40 bg-gray-200 rounded">
                    <div className="h-full w-1/4 bg-blue-500 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
