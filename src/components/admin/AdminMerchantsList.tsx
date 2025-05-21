
import React from 'react';
import OverviewHeader from './merchants/OverviewHeader';
import MerchantTable from './merchants/MerchantTable';
import MerchantStatistics from './merchants/MerchantStatistics';

const AdminMerchantsList: React.FC = () => {
  return (
    <div className="space-y-6">
      <OverviewHeader />
      <MerchantTable />
      <MerchantStatistics />
    </div>
  );
};

export default AdminMerchantsList;
