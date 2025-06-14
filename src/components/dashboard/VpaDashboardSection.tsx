
import React from 'react';
import VpaManagement from '@/components/merchant/VpaManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, CreditCard } from 'lucide-react';

interface VpaDashboardSectionProps {
  merchantId: string;
  businessName: string;
  merchantEmail: string;
}

const VpaDashboardSection = ({ merchantId, businessName, merchantEmail }: VpaDashboardSectionProps) => {
  return (
    <div className="space-y-6">
      {/* VPA Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">VPA Payments Today</p>
                <p className="text-2xl font-bold">₹0</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">VPA Transactions</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unique Payers</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VPA Management */}
      <VpaManagement 
        merchantId={merchantId}
        businessName={businessName}
        merchantEmail={merchantEmail}
      />

      {/* Recent VPA Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent VPA Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No VPA payments yet</p>
            <p className="text-sm">Payments made to your VPA will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VpaDashboardSection;
