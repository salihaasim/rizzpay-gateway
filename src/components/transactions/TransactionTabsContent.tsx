
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import TransactionCard from '@/components/TransactionCard';
import { Transaction } from '@/stores/transactionStore';

interface TransactionTabsContentProps {
  transactions: Transaction[];
  filteredTransactions?: Transaction[];
  isUpiView?: boolean;
  onSelectTransaction?: (id: string) => void;
}

const TransactionTabsContent: React.FC<TransactionTabsContentProps> = ({
  transactions,
  filteredTransactions,
  isUpiView,
  onSelectTransaction
}) => {
  const displayTransactions = filteredTransactions || transactions;
  const handleSelect = (id: string) => {
    if (onSelectTransaction) {
      onSelectTransaction(id);
    }
  };

  return (
    <>
      <TabsContent value="all" className="mt-6">
        <div className="space-y-4">
          {displayTransactions.length > 0 ? (
            displayTransactions.map((transaction) => (
              <div key={transaction.id} onClick={() => handleSelect(transaction.id)} className="cursor-pointer">
                <TransactionCard {...transaction} />
              </div>
            ))
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="successful" className="mt-6">
        <div className="space-y-4">
          {displayTransactions.filter(t => t.status === 'successful').map((transaction) => (
            <div key={transaction.id} onClick={() => handleSelect(transaction.id)} className="cursor-pointer">
              <TransactionCard {...transaction} />
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="processing" className="mt-6">
        <div className="space-y-4">
          {displayTransactions.filter(t => t.status === 'processing').map((transaction) => (
            <div key={transaction.id} onClick={() => handleSelect(transaction.id)} className="cursor-pointer">
              <TransactionCard {...transaction} />
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="pending" className="mt-6">
        <div className="space-y-4">
          {displayTransactions.filter(t => t.status === 'pending').map((transaction) => (
            <div key={transaction.id} onClick={() => handleSelect(transaction.id)} className="cursor-pointer">
              <TransactionCard {...transaction} />
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="failed" className="mt-6">
        <div className="space-y-4">
          {displayTransactions.filter(t => t.status === 'failed').map((transaction) => (
            <div key={transaction.id} onClick={() => handleSelect(transaction.id)} className="cursor-pointer">
              <TransactionCard {...transaction} />
            </div>
          ))}
        </div>
      </TabsContent>
    </>
  );
};

export default TransactionTabsContent;
