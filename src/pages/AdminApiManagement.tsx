
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminApiManagement = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">API Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage API keys, endpoints, and access controls
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <p>API management interface will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminApiManagement;
