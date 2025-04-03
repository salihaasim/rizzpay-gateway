
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminMerchantsList from '@/components/admin/AdminMerchantsList';
import EscrowAccount from '@/components/admin/EscrowAccount';
import MerchantPricingControl from '@/components/admin/MerchantPricingControl';
import AdminStatCards from './AdminStatCards';
import AdminDashboardCharts from './AdminDashboardCharts';
import AdminPlatformOverview from './AdminPlatformOverview';
import MerchantWhitelist from '@/pages/MerchantWhitelist';

interface AdminSectionContentProps {
  section: string;
}

const AdminSectionContent: React.FC<AdminSectionContentProps> = ({ section }) => {
  // Render content based on the active section
  switch (section) {
    case 'merchants':
      return <AdminMerchantsList />;
    case 'escrow':
      return <EscrowAccount />;
    case 'pricing':
      return <MerchantPricingControl />;
    case 'whitelist':
      return <MerchantWhitelist />;
    case 'transactions':
      return (
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Transaction Management</CardTitle>
            <CardDescription>Monitor and manage payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Transaction management interface will be displayed here.</p>
          </CardContent>
        </Card>
      );
    case 'analytics':
      return (
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Analytics Dashboard</CardTitle>
            <CardDescription>Platform performance metrics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Analytics dashboard will be displayed here.</p>
          </CardContent>
        </Card>
      );
    case 'settings':
      return (
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Admin Settings</CardTitle>
            <CardDescription>Configure platform settings and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Admin settings interface will be displayed here.</p>
          </CardContent>
        </Card>
      );
    default:
      // Dashboard view - show overview with stats and charts
      return (
        <>
          <AdminStatCards />
          <AdminDashboardCharts />
          <AdminPlatformOverview />
        </>
      );
  }
};

export default AdminSectionContent;
