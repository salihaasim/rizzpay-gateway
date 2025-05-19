
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TransactionHeaderProps {
  exportAllTransactions?: () => void;
  totalAmount?: number | string;
  transactionCount?: number;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({ 
  exportAllTransactions, 
  totalAmount, 
  transactionCount,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Transactions</h1>
        {totalAmount !== undefined && (
          <p className="text-muted-foreground">
            Total value: <span className="font-medium">₹{totalAmount}</span>
            {transactionCount !== undefined && (
              <span> ({transactionCount} transactions)</span>
            )}
          </p>
        )}
        {!totalAmount && (
          <p className="text-muted-foreground">View and manage all your payment transactions</p>
        )}
      </div>
      
      <div className="flex gap-2 mt-4 md:mt-0 items-center">
        {searchTerm !== undefined && setSearchTerm && (
          <div className="relative mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        
        {exportAllTransactions && (
          <Button variant="outline" size="sm" className="flex items-center" onClick={exportAllTransactions}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionHeader;
