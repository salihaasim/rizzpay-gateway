
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface TransactionHeaderProps {
  exportAllTransactions: () => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({ exportAllTransactions }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Transactions</h1>
        <p className="text-muted-foreground">View and manage all your payment transactions</p>
      </div>
      
      <div className="flex gap-2 mt-4 md:mt-0">
        <Button variant="outline" size="sm" className="flex items-center" onClick={exportAllTransactions}>
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>
    </div>
  );
};

export default TransactionHeader;
