
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import RoleSectionWrapper from '@/components/landing/RoleSectionWrapper';
import QuickPaymentSection from '@/components/landing/QuickPaymentSection';
import Footer from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <RoleSectionWrapper />
      <QuickPaymentSection />
      <Footer />
    </div>
  );
};

export default Index;
