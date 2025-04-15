
import React from 'react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import RoleSectionWrapper from '@/components/landing/RoleSectionWrapper';
import Footer from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <RoleSectionWrapper />
      <Footer />
    </div>
  );
};

export default Index;
