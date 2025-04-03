
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MerchantWhitelist from '@/pages/MerchantWhitelist';

// This component exists as a wrapper to make the whitelist route accessible
// in case App.tsx isn't automatically updated
const WhitelistRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/whitelist" element={<MerchantWhitelist />} />
    </Routes>
  );
};

export default WhitelistRoutes;
