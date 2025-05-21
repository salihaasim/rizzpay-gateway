
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useProfileStore, Merchant } from '@/stores/profileStore';
import { useTransactionStore } from '@/stores/transactionStore';

const MerchantStatistics: React.FC = () => {
  const { merchants } = useProfileStore();
  const { getWalletBalance } = useTransactionStore();
  
  return (
    <div>
      <h2 className="text-xl font-bold mt-8">Wallet Statistics</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex flex-col">
              <p className="text-muted-foreground text-sm">Total Merchants</p>
              <p className="text-3xl font-bold">{merchants.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex flex-col">
              <p className="text-muted-foreground text-sm">Total wallet balance</p>
              <p className="text-3xl font-bold">
                ₹{merchants.reduce((total, merchant) => 
                  total + getWalletBalance(merchant.email), 0).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex flex-col">
              <p className="text-muted-foreground text-sm">Active Companies</p>
              <p className="text-3xl font-bold">
                {new Set(merchants.map(m => m.company)).size}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex flex-col">
              <p className="text-muted-foreground text-sm">Average Balance</p>
              <p className="text-3xl font-bold">
                ₹{merchants.length ? 
                  (merchants.reduce((total, merchant) => 
                    total + getWalletBalance(merchant.email), 0) / merchants.length).toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MerchantStatistics;
