
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminMonitoring = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Monitor system health and performance metrics
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p>System monitoring dashboard will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminMonitoring;
