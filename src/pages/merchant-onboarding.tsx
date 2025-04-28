
import React from 'react';
import MerchantOnboarding from '@/components/merchant/MerchantOnboarding';
import Navbar from '@/components/Navbar';

export default function MerchantOnboardingPage() {
  return (
    <>
      <Navbar />
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10">
        <MerchantOnboarding />
      </div>
    </>
  );
}
