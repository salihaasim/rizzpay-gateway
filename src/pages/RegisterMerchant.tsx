
import React from 'react';
import MerchantRegistrationForm from '@/components/merchant/MerchantRegistrationForm';
import Layout from '@/components/Layout';

export default function RegisterMerchant() {
  return (
    <Layout>
      <div className="container max-w-4xl py-10">
        <MerchantRegistrationForm />
      </div>
    </Layout>
  );
}
