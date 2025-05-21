
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Merchant } from '@/stores/profileStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign 
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import MerchantGamblingSwitch from '../MerchantGamblingSwitch';

interface MerchantWalletDetailsProps {
  merchant: Merchant;
}

const MerchantWalletDetails: React.FC<MerchantWalletDetailsProps> = ({ merchant }) => {
  const { getWalletBalance, transactions } = useTransactionStore();
  const walletBalance = getWalletBalance(merchant.email);
  
  const merchantTransactions = transactions.filter(t => 
    t.customer === merchant.email || t.createdBy === merchant.email
  ).slice(0, 5);
  
  const totalDeposits = transactions
    .filter(t => t.walletTransactionType === 'deposit' && t.customer === merchant.email)
    .reduce((sum, t) => sum + (t.rawAmount || 0), 0);
    
  const totalWithdrawals = transactions
    .filter(t => t.walletTransactionType === 'withdrawal' && t.customer === merchant.email)
    .reduce((sum, t) => sum + (t.rawAmount || 0), 0);
  
  const pendingTransactions = transactions
    .filter(t => 
      (t.customer === merchant.email || t.createdBy === merchant.email) && 
      (t.status === 'pending' || t.status === 'processing')
    ).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">₹{walletBalance.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Deposits</p>
              <p className="text-2xl font-bold">₹{totalDeposits.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
              <ArrowDownRight className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Withdrawals</p>
              <p className="text-2xl font-bold">₹{totalWithdrawals.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Transactions</p>
              <p className="text-2xl font-bold">{pendingTransactions}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-3">Advanced Settings</h3>
        <MerchantGamblingSwitch 
          merchantId={merchant.id} 
          merchantName={merchant.name} 
        />
      </div>
      
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {merchantTransactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchantTransactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.walletTransactionType}</TableCell>
                    <TableCell>
                      <span className={transaction.walletTransactionType === 'deposit' ? 'text-emerald-500' : 'text-rose-500'}>
                        {transaction.amount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.status === 'successful' ? 'secondary' : 'outline'}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">No transactions found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantWalletDetails;
