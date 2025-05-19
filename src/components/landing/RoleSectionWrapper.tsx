
import React from 'react';
import RoleSelector from '@/components/RoleSelector';

const RoleSectionWrapper = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Role</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're managing a business, processing transactions, or making payments,
            Rizzpay has the right interface for you.
          </p>
        </div>
        
        <RoleSelector />
      </div>
    </section>
  );
};

export default React.memo(RoleSectionWrapper);
