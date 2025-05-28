
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import logoSvg from '../../assets/logo.svg';

const NavbarBrand: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center gap-2 lg:gap-3">
      {location.pathname !== '/' && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack} 
          className="mr-2"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      
      <Link 
        to="/" 
        className="font-semibold text-xl lg:text-2xl text-[#0052FF] flex items-center gap-2"
      >
        <img src={logoSvg} alt="RizzPay Logo" className="h-6 w-6 lg:h-7 lg:w-7" />
        <span className="font-bold">RizzPay</span>
      </Link>
    </div>
  );
};

export default NavbarBrand;
