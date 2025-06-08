
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Activity } from 'lucide-react';

const ActivityLogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const activities = [
    {
      id: 1,
      action: 'Login',
      description: 'User logged into account',
      timestamp: '2024-01-15 10:30:00',
      ip: '192.168.1.1',
      status: 'success'
    },
    {
      id: 2,
      action: 'Transaction Created',
      description: 'New payment transaction initiated',
      timestamp: '2024-01-15 10:25:00',
      ip: '192.168.1.1',
      status: 'success'
    },
    {
      id: 3,
      action: 'Profile Updated',
      description: 'User profile information updated',
      timestamp: '2024-01-15 09:15:00',
      ip: '192.168.1.1',
      status: 'success'
    },
    {
      id: 4,
      action: 'Failed Login',
      description: 'Invalid login attempt',
      timestamp: '2024-01-14 18:45:00',
      ip: '192.168.1.2',
      status: 'failed'
    },
    {
      id: 5,
      action: 'API Key Generated',
      description: 'New API key generated for integration',
      timestamp: '2024-01-14 16:20:00',
      ip: '192.168.1.1',
      status: 'success'
    }
  ];

  const filteredActivities = activities.filter(activity =>
    activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Activity Log</h1>
            <p className="text-sm text-muted-foreground">Monitor account activity and security events</p>
          </div>
          
          <div className="flex items-center mt-4 sm:mt-0 w-full sm:w-auto gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search activities..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              {filteredActivities.length} activities found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-muted-foreground">{activity.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {activity.timestamp} • IP: {activity.ip}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ActivityLogPage;
