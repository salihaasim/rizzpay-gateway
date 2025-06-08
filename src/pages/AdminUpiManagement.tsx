
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminUpiManagement = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">UPI Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage UPI configurations and payment settings
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>UPI Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p>UPI management interface will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUpiManagement;
