
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { WhitelistInfo } from '@/components/admin/whitelist/WhitelistInfo';
import { WhitelistTabs } from '@/components/admin/whitelist/WhitelistTabs';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { toast } from 'sonner';

const MerchantWhitelist = () => {
  const { currentMerchant } = useMerchantAuth();
  const navigate = useNavigate();
  
  // Check if the current user is an admin
  useEffect(() => {
    if (currentMerchant && currentMerchant.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard', { replace: true });
    }
  }, [currentMerchant, navigate]);

  // Only render if admin
  if (currentMerchant?.role !== 'admin') {
    return null;
  }

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
