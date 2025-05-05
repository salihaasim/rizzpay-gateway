
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AnalyticsChart from '@/components/AnalyticsChart';
import { useTransactionStore } from '@/stores/transactionStore';
import { ArrowUpRight, ArrowRight, Clock, ArrowDownRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { generateAnalyticsSummary } from '@/utils/analyticsUtils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TechnicalAccessLink from '@/components/TechnicalAccessLink';
import { useMediaQuery, mediaQueries } from '@/hooks/use-media-query';

const DashboardAnalyticsSection = () => {
  const { transactions } = useTransactionStore();
  const isMobile = useMediaQuery(mediaQueries.isMobile);
  
  // Generate analytics summary from transactions
  const analytics = React.useMemo(() => generateAnalyticsSummary(transactions), [transactions]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <AnalyticsChart 
        transactions={transactions} 
        className="lg:col-span-2 dashboard-card"
      />
      
      <Card className="dashboard-card backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="pb-2 bg-gradient-to-r from-background to-secondary/10">
          <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
          <CardDescription>24 hours performance</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-emerald-500/5 rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                <ArrowUpRight className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Incoming</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
              <p className="text-emerald-500 font-semibold">+₹{analytics.revenue.today.toLocaleString('en-IN')}</p>
            </div>
            
            <div className="flex items-center p-3 bg-amber-500/5 rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Avg. Processing</p>
                <p className="text-xs text-muted-foreground">Time</p>
              </div>
              <p className="font-semibold">2.3s</p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="px-3">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Total Balance</div>
                  <div className="text-xl font-semibold">₹{analytics.revenue.monthly.toLocaleString('en-IN')}</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Avg. Transaction</div>
                  <div className="font-medium">₹{analytics.performance.avgTransactionValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />
            
            <div className="flex justify-center">
              <TechnicalAccessLink />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAnalyticsSection;
