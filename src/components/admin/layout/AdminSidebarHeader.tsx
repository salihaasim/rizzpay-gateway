
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
          "flex flex-col items-center gap-2 font-bold text-lg text-primary focus:outline-none",
          collapsed && "justify-center"
        )}
        style={{ minWidth: collapsed ? '48px' : 'auto' }}
      >
        <img
          src={require('@/assets/rizzpay-admin-logo.png')}
          alt="RizzPay Admin Logo"
          className={collapsed ? "h-8 w-8 mx-auto mb-1" : "h-10 w-10 inline mb-2"}
          style={{ objectFit: 'contain', borderRadius: 8, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
        />
        {collapsed ? (
          <span className="text-xl">RP</span>
        ) : (
          <span>
            <span className="hidden sm:inline">{siteConfig.name}</span>
            <span className="sm:hidden">RP</span>
          </span>
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
