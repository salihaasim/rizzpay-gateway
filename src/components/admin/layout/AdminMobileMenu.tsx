
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Globe, 
  Monitor,
  LogOut,
  Home,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import SupabaseStatus from '@/components/SupabaseStatus';
import { 
  Sheet,
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';

interface AdminMobileMenuProps {
  userEmail: string | null;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
  isActive: (path: string) => boolean;
}

const AdminMobileMenu: React.FC<AdminMobileMenuProps> = ({ 
  userEmail, 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  handleLogout,
  isActive
}) => {
  // Navigation items for admin
  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Merchants',
      href: '/admin/merchants',
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'Transactions',
      href: '/admin/transactions',
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userEmail) return 'A';
    return userEmail.substring(0, 2).toUpperCase();
  };

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          <div className="h-16 border-b flex items-center px-4 bg-[#1a1d2d]">
            <Link to="/admin" className="font-bold text-xl flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <div className="h-8 w-8 rounded-lg bg-[#9970e2]/10 flex items-center justify-center mr-2">
                <ShieldCheck className="h-5 w-5 text-[#9970e2]" />
              </div>
              <span className="text-white">
                RizzAdmin
              </span>
            </Link>
          </div>
          
          <ScrollArea className="flex-1 py-4 bg-[#1a1d2d]">
            <div className="space-y-1 px-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center py-3 px-3 rounded-md transition-colors",
                    isActive(item.href)
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
            
            <div className="mt-6 px-3">
              <h3 className="text-white/50 text-xs uppercase font-semibold px-3 mb-2">Quick Actions</h3>
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-2 px-3 rounded-md transition-colors text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Monitor className="h-4 w-4 mr-3" />
                  <span className="text-sm">Merchant View</span>
                </Link>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-2 px-3 rounded-md transition-colors text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Globe className="h-4 w-4 mr-3" />
                  <span className="text-sm">Main Website</span>
                </Link>
                <Link
                  to="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center py-2 px-3 rounded-md transition-colors text-white/70 hover:text-white hover:bg-white/10"
                >
                  <HelpCircle className="h-4 w-4 mr-3" />
                  <span className="text-sm">Admin Guide</span>
                </Link>
              </div>
            </div>
          </ScrollArea>
          
          <div className="border-t p-4 bg-[#1a1d2d] border-white/10">
            <div className="bg-white/10 rounded-md p-3 mb-4">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback className="bg-[#9970e2] text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-white font-medium leading-none mb-1">
                    <span className="flex items-center">
                      <ShieldCheck className="h-3 w-3 mr-1 text-[#9970e2]" />
                      Admin Account
                    </span>
                  </p>
                  {userEmail && (
                    <p className="text-xs text-white/70 truncate max-w-[170px]">
                      {userEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/50">Server Status</span>
              <SupabaseStatus />
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }} 
              className="w-full justify-center bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileMenu;
