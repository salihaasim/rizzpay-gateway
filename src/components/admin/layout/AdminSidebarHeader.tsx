
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

interface AdminSidebarHeaderProps {
  collapsed: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export function AdminSidebarHeader({ collapsed, setMobileMenuOpen }: AdminSidebarHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <button
        onClick={() => navigate("/")}
        className={cn(
          "flex items-center gap-2 font-bold text-lg text-primary",
          collapsed && "justify-center"
        )}
      >
        {collapsed ? (
          <span className="text-xl">RP</span>
        ) : (
          <>
            <CreditCard className="h-6 w-6" />
            <span className="hidden sm:inline">{siteConfig.name}</span>
            <span className="sm:hidden">RP</span>
          </>
        )}
      </button>
      
      {/* Mobile close button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
