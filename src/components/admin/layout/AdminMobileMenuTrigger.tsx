
import React from 'react';
import { ShieldCheck, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from '@/components/ui/sheet';

interface AdminMobileMenuTriggerProps {
  setMobileMenuOpen: (open: boolean) => void;
}

const AdminMobileMenuTrigger: React.FC<AdminMobileMenuTriggerProps> = ({ setMobileMenuOpen }) => {
  return (
    <div className="lg:hidden flex items-center fixed top-4 left-4 z-20">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
      </Sheet>
      <div className="lg:hidden flex items-center">
        <ShieldCheck className="h-5 w-5 text-[#9970e2] mr-2" />
        <span className="font-semibold">RizzAdmin</span>
      </div>
    </div>
  );
};

export default AdminMobileMenuTrigger;
