
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminTransactionLog = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Transaction Log</h1>
          <p className="text-muted-foreground mt-1">
            Detailed transaction logs and audit trail
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Transaction log details will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactionLog;
