
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useMediaQuery, mediaQueries } from '@/hooks/use-media-query';
import { useTransactionStore, Transaction } from '@/stores/transactionStore';
import PaymentFlow from '@/components/PaymentFlow';
import RecentTransactionsList from './RecentTransactionsList';

const DashboardTransactionsSection = () => {
  const { transactions } = useTransactionStore();
  const isMobile = useMediaQuery(mediaQueries.isMobile);
  
  // Get recent transactions
  const recentTxns = React.useMemo(() => {
    return [...transactions].slice(0, 4);
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className={`${isMobile ? '' : 'lg:col-span-3'} space-y-6`}>
        <div className="flex justify-between items-center">
          <h2 className="section-heading">Recent Transactions</h2>
          <Link to="/transactions">
            <Button variant="outline" size="sm" className="gap-1 hover:bg-primary/10 hover:text-primary">
              View All 
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <RecentTransactionsList transactions={recentTxns} />
      </div>
      
      <div className={`${isMobile ? 'mt-6' : 'lg:col-span-2'}`}>
        <h2 className="section-heading">Quick Payment</h2>
        <Card className="dashboard-card backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-4">
            <PaymentFlow />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardTransactionsSection;
