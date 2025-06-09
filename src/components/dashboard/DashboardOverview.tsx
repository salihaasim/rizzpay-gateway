
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, CreditCard, IndianRupee } from 'lucide-react';

const DashboardOverview = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹2,45,678",
      change: "+12.5%",
      changeType: "increase",
      icon: IndianRupee,
      description: "vs last month"
    },
    {
      title: "Total Transactions",
      value: "1,234",
      change: "+8.2%", 
      changeType: "increase",
      icon: CreditCard,
      description: "vs last month"
    },
    {
      title: "Active Customers",
      value: "892",
      change: "+15.3%",
      changeType: "increase", 
      icon: Users,
      description: "vs last month"
    },
    {
      title: "Success Rate",
      value: "98.5%",
      change: "+2.1%",
      changeType: "increase",
      icon: TrendingUp,
      description: "vs last month"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your business today.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Badge 
                    variant={stat.changeType === 'increase' ? 'default' : 'secondary'}
                    className="flex items-center space-x-1"
                  >
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    <span>{stat.change}</span>
                  </Badge>
                  <span>{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent transactions and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Payment received from John Doe
                  </p>
                  <p className="text-sm text-muted-foreground">
                    2 minutes ago
                  </p>
                </div>
                <div className="text-sm font-medium">+₹1,200</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Payout processed to HDFC Bank
                  </p>
                  <p className="text-sm text-muted-foreground">
                    5 minutes ago
                  </p>
                </div>
                <div className="text-sm font-medium">-₹5,000</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    UPI payment link created
                  </p>
                  <p className="text-sm text-muted-foreground">
                    10 minutes ago
                  </p>
                </div>
                <div className="text-sm font-medium">₹2,500</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>
              Today's performance at a glance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Today's Revenue</span>
                <span className="text-sm font-medium">₹12,340</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending Payouts</span>
                <span className="text-sm font-medium">₹8,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Links</span>
                <span className="text-sm font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Failed Transactions</span>
                <span className="text-sm font-medium text-red-500">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
