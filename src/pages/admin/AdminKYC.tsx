
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminKycTable from '@/components/admin/kyc/AdminKycTable';
import { Helmet } from 'react-helmet';

const AdminKYC: React.FC = () => {
  return (
    <AdminLayout>
      <Helmet>
        <title>KYC Management | RizzPay Admin</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">KYC Management</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage merchant KYC document submissions
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>KYC Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminKycTable />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminKYC;
