
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, BarChart3 } from 'lucide-react';

const AdminDashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
      <Card className="border border-border/50 shadow-sm xl:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Transaction Overview</CardTitle>
          <CardDescription>
            Month-to-date transaction performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Activity className="h-16 w-16 text-muted-foreground/30" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Payment Methods</CardTitle>
          <CardDescription>
            Distribution by payment type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground/30" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardCharts;
