
import React, { useState, useEffect } from 'react';
import UserSwitcher from './UserSwitcher';
import NavigationItems from './navbar/NavigationItems';
import MobileMenu from './navbar/MobileMenu';
import ResponsiveControls from './navbar/ResponsiveControls';
import NavbarBrand from './navbar/NavbarBrand';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state to true after initial render for animations
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleNavVisibility = () => {
    setNavHidden(!navHidden);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 max-w-screen-2xl items-center px-4 lg:px-6 mx-auto">
        <NavbarBrand />
        
        <NavigationItems mounted={mounted} navHidden={navHidden} />
        
        <div className="flex items-center gap-2 ml-auto">
          <ResponsiveControls 
            navHidden={navHidden} 
            toggleNavVisibility={toggleNavVisibility} 
          />
          
          <UserSwitcher />
          
          <MobileMenu open={open} setOpen={setOpen} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
