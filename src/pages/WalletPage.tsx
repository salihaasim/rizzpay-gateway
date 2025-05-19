
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionStore } from '@/stores/transactions';
import { Filter, Info, Wallet as WalletIcon, ArrowUpDown, ArrowDown, CreditCard, Layers } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Wallet from '@/components/Wallet';
import { useMobile } from '@/hooks/use-mobile';
import TransactionDetails from '@/components/TransactionDetails';
import WalletSummary from '@/components/wallet/WalletSummary';
import WalletFees from '@/components/wallet/WalletFees';
import WalletHowItWorks from '@/components/wallet/WalletHowItWorks';
import TransactionList from '@/components/wallet/TransactionList';
import { useFilteredTransactions } from '@/hooks/useFilteredTransactions';
import Layout from '@/components/Layout';

// Create a WalletSidebar component for the wallet page
const WalletSidebar = ({ activeItem, onItemClick }: { activeItem: string, onItemClick: (item: string) => void }) => {
  const items = [
    { id: 'overview', label: 'Overview', icon: <WalletIcon className="h-4 w-4 mr-2" /> },
    { id: 'transactions', label: 'Transactions', icon: <Layers className="h-4 w-4 mr-2" /> },
    { id: 'deposit', label: 'Deposit', icon: <ArrowDown className="h-4 w-4 mr-2" /> },
    { id: 'withdraw', label: 'Withdraw', icon: <ArrowUpDown className="h-4 w-4 mr-2" /> },
    { id: 'cards', label: 'Cards', icon: <CreditCard className="h-4 w-4 mr-2" /> }
  ];
  
  return (
    <div className="w-full lg:w-64 bg-card border-r border-border/50">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium flex items-center">
          <WalletIcon className="h-5 w-5 mr-2" />
          Wallet
        </h3>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {items.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onItemClick(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors ${
                  activeItem === item.id ? 'bg-muted font-medium text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const WalletPage = () => {
  const { transactions, userEmail } = useTransactionStore();
  const [transactionFilter, setTransactionFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('transactions');
  const [activeSidebarItem, setActiveSidebarItem] = useState<string>('overview');
  const isMobile = useMobile();
  
  // Get wallet-related transactions
  const walletTransactions = useMemo(() => {
    if (!userEmail) return [];
    return transactions.filter(t => 
      t.walletTransactionType && (t.customer === userEmail || t.createdBy === userEmail)
    );
  }, [transactions, userEmail]);
  
  // Get filtered transactions based on filter
  const filteredTransactions = useFilteredTransactions(
    walletTransactions,
    transactionFilter,
    ''
  );
  
  const handleViewTransaction = (id: string) => {
    setSelectedTransaction(id);
  };
  
  const handleCloseTransactionDetails = () => {
    setSelectedTransaction(null);
  };
  
  const getTransactionById = (id: string | null) => {
    if (!id) return null;
    return transactions.find(t => t.id === id) || null;
  };

  const handleSidebarItemClick = (item: string) => {
    setActiveSidebarItem(item);
    if (item === 'transactions') {
      setActiveTab('transactions');
    }
  };
  
  return (
    <Layout>
      <div className="bg-background min-h-screen">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar - only visible on larger screens */}
          <div className="hidden lg:block">
            <WalletSidebar activeItem={activeSidebarItem} onItemClick={handleSidebarItemClick} />
          </div>
          
          {/* Main content */}
          <div className="flex-1 p-4 lg:p-6">
            {/* Mobile sidebar/tabs */}
            <div className="block lg:hidden mb-4">
              <Tabs value={activeSidebarItem} onValueChange={setActiveSidebarItem}>
                <TabsList className="w-full grid grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="deposit">Deposit</TabsTrigger>
                  <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                  <TabsTrigger value="cards">Cards</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Content based on active sidebar item */}
            {activeSidebarItem === 'overview' && (
              <>
                <div className="mb-4">
                  <h1 className="text-2xl font-bold">Wallet</h1>
                  <p className="text-muted-foreground">Manage your funds securely</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Wallet />
                    
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Transactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <TransactionList 
                          transactions={filteredTransactions.slice(0, 5)} 
                          onViewDetails={handleViewTransaction}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-6">
                    {userEmail && (
                      <Card>
                        <WalletSummary walletTransactions={walletTransactions} userEmail={userEmail} />
                      </Card>
                    )}
                    
                    <Card>
                      <WalletFees />
                    </Card>
                    
                    <Card className="hidden lg:block">
                      <WalletHowItWorks />
                    </Card>
                  </div>
                </div>
              </>
            )}
            
            {activeSidebarItem === 'transactions' && (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Transaction History</h1>
                    <p className="text-muted-foreground">View your wallet transaction history</p>
                  </div>
                  
                  <div className="flex items-center">
                    {!isMobile && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground mr-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Filter your transactions by type
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    
                    <Select 
                      value={transactionFilter} 
                      onValueChange={setTransactionFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter transactions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Transactions</SelectItem>
                        <SelectItem value="deposit">Deposits</SelectItem>
                        <SelectItem value="withdrawal">Withdrawals</SelectItem>
                        <SelectItem value="transfer">Transfers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                      <div className="px-6 pt-6 border-b">
                        <TabsList>
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="successful">Successful</TabsTrigger>
                          <TabsTrigger value="processing">Processing</TabsTrigger>
                          <TabsTrigger value="pending">Pending</TabsTrigger>
                          <TabsTrigger value="failed">Failed</TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <div className="p-6">
                        <TransactionList 
                          transactions={filteredTransactions} 
                          onViewDetails={handleViewTransaction}
                        />
                      </div>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            )}
            
            {activeSidebarItem === 'deposit' && (
              <div className="p-6">
                <h1 className="text-2xl font-bold">Deposit Funds</h1>
                <p className="text-muted-foreground mb-6">Add money to your wallet</p>
                {/* Deposit functionality would go here */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <p>Deposit functionality coming soon</p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeSidebarItem === 'withdraw' && (
              <div className="p-6">
                <h1 className="text-2xl font-bold">Withdraw Funds</h1>
                <p className="text-muted-foreground mb-6">Withdraw money from your wallet</p>
                {/* Withdraw functionality would go here */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <p>Withdrawal functionality coming soon</p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeSidebarItem === 'cards' && (
              <div className="p-6">
                <h1 className="text-2xl font-bold">Virtual Cards</h1>
                <p className="text-muted-foreground mb-6">Manage your virtual cards</p>
                {/* Cards functionality would go here */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <p>Virtual cards functionality coming soon</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
        
        {/* Transaction Details Dialog */}
        <Dialog 
          open={selectedTransaction !== null} 
          onOpenChange={(open) => !open && handleCloseTransactionDetails()}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
            {selectedTransaction && getTransactionById(selectedTransaction) && (
              <TransactionDetails 
                transaction={getTransactionById(selectedTransaction)!}
                onClose={handleCloseTransactionDetails}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default WalletPage;
