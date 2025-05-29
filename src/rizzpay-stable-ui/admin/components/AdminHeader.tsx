
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AdminHeaderProps {
  onLogout: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  hideNavigation?: boolean;
  userEmail?: string;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  hiddenOnMobile?: boolean;
  setHiddenOnMobile?: (hidden: boolean) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onLogout,
  setMobileMenuOpen,
  hideNavigation = false,
  userEmail = '',
  collapsed = false,
  setCollapsed,
  hiddenOnMobile = false,
  setHiddenOnMobile
}) => {
  if (hideNavigation) {
    return null;
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions, merchants..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-white">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">
                {userEmail ? userEmail.split('@')[0] : 'Administrator'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {userEmail || 'admin@rizzpay.com'}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
