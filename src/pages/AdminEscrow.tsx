
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminEscrow = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Escrow Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage escrow accounts and transaction holds
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Escrow Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Escrow management system will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminEscrow;
