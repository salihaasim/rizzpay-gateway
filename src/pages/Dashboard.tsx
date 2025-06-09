
import React from 'react';
import Layout from '@/components/Layout';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import QuickPaymentSection from '@/components/payment/QuickPaymentSection';

const Dashboard = () => {
  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardOverview />
          </div>
          <div className="lg:col-span-1">
            <QuickPaymentSection />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
