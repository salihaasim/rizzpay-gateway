
import React from 'react';
import { ShieldCheck, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';

interface AdminMobileMenuTriggerProps {
  setMobileMenuOpen: (open: boolean) => void;
}

const AdminMobileMenuTrigger: React.FC<AdminMobileMenuTriggerProps> = ({ setMobileMenuOpen }) => {
  const [open, setOpen] = React.useState(false);
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    setMobileMenuOpen(isOpen);
  };

  return (
    <div className="lg:hidden flex items-center fixed top-4 left-4 z-20">
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="p-4">
            <div className="flex items-center mb-6">
              <ShieldCheck className="h-5 w-5 text-[#9970e2] mr-2" />
              <span className="font-semibold">RizzAdmin</span>
            </div>
            <nav className="space-y-1">
              <Link to="/admin" className="flex items-center py-2 px-3 text-sm font-medium rounded-md hover:bg-secondary/50">
                Dashboard
              </Link>
              <Link to="/admin/merchants" className="flex items-center py-2 px-3 text-sm font-medium rounded-md hover:bg-secondary/50">
                Merchants
              </Link>
              <Link to="/admin/transactions" className="flex items-center py-2 px-3 text-sm font-medium rounded-md hover:bg-secondary/50">
                Transactions
              </Link>
              <Link to="/admin/whitelist" className="flex items-center py-2 px-3 text-sm font-medium rounded-md hover:bg-secondary/50">
                Whitelist
              </Link>
              <Link to="/admin/settings" className="flex items-center py-2 px-3 text-sm font-medium rounded-md hover:bg-secondary/50">
                Settings
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      <div className="lg:hidden flex items-center">
        <ShieldCheck className="h-5 w-5 text-[#9970e2] mr-2" />
        <span className="font-semibold">RizzAdmin</span>
      </div>
    </div>
  );
};

export default AdminMobileMenuTrigger;
