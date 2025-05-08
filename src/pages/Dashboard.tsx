
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Merchant name from email (simplified version)
  const merchantName = useMemo(() => {
    if (!userEmail) return "Merchant";
    return userEmail.split('@')[0].charAt(0).toUpperCase() + userEmail.split('@')[0].slice(1);
  }, [userEmail]);

  return (
    <div className="min-h-screen bg-background flex">
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
          
          <DashboardAnalyticsSection />
          
          <DashboardTransactionsSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
