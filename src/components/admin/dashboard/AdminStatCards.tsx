
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp,
  Users, 
  DollarSign,
  CreditCard,
  Percent 
} from 'lucide-react';
import { useProfileStore } from '@/stores/profileStore';

const AdminStatCards = () => {
  const { merchants } = useProfileStore();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <Card className="border border-border/50 shadow-sm">
        <CardContent className="pt-6 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Merchants</p>
              <h3 className="text-3xl font-bold mt-1">{merchants.length}</h3>
              <p className="text-xs text-emerald-500 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                12.5% this month
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#9970e2]/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-[#9970e2]" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-border/50 shadow-sm">
        <CardContent className="pt-6 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <h3 className="text-3xl font-bold mt-1">₹1.2M</h3>
              <p className="text-xs text-emerald-500 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                8.2% this month
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-border/50 shadow-sm">
        <CardContent className="pt-6 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Transactions</p>
              <h3 className="text-3xl font-bold mt-1">5,698</h3>
              <p className="text-xs text-emerald-500 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                15.3% this month
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-border/50 shadow-sm">
        <CardContent className="pt-6 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Success Rate</p>
              <h3 className="text-3xl font-bold mt-1">98.2%</h3>
              <p className="text-xs text-emerald-500 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                2.3% this month
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Percent className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatCards;
