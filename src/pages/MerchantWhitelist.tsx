
import AdminLayout from '@/components/admin/AdminLayout';
import { WhitelistInfo } from '@/components/admin/whitelist/WhitelistInfo';
import { WhitelistTabs } from '@/components/admin/whitelist/WhitelistTabs';

const MerchantWhitelist = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Access Control Whitelist</h1>
          <p className="text-muted-foreground mt-1">
            Manage authorized IP addresses and webhook domains for merchant API access
          </p>
        </div>
        
        <WhitelistInfo />
        <WhitelistTabs />
      </div>
    </AdminLayout>
  );
};

export default MerchantWhitelist;
