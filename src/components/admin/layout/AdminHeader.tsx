
import React from 'react';
import { Bell, Settings, Monitor, LogOut, Users, Wallet, FileText, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SupabaseStatus from '@/components/SupabaseStatus';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminHeaderProps {
  userEmail: string | null;
  handleLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ userEmail, handleLogout }) => {
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userEmail) return 'A';
    return userEmail.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b flex items-center px-4 sticky top-0 z-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {/* Empty div to maintain spacing for desktop */}
          <div className="hidden lg:block"></div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3">
          <SupabaseStatus />
          
          {/* Mobile-optimized buttons with responsive spacing */}
          <div className="hidden md:flex space-x-2">
            <Link to="/admin/merchants">
              <Button variant="outline" size="sm" className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Manage Merchants</span>
              </Button>
            </Link>
            
            <Link to="/admin/escrow">
              <Button variant="outline" size="sm" className="flex items-center">
                <Wallet className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Escrow</span>
              </Button>
            </Link>
          </div>

          {/* Aasimo AI Button */}
          <Link to="/admin/aasimo">
            <Button variant="default" size="sm" className="flex items-center bg-[#9970e2] hover:bg-[#8b5cf6]">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Aasimo AI</span>
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 flex items-center justify-center text-[10px] text-white">3</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#9970e2] text-white text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userEmail}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Administrator
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/merchants" className="cursor-pointer flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Manage Merchants</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/escrow" className="cursor-pointer flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Escrow Account</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/pricing" className="cursor-pointer flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Merchant Pricing</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/settings" className="cursor-pointer flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Admin Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/admin/aasimo" className="cursor-pointer flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Aasimo AI</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="cursor-pointer flex items-center">
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>Merchant View</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-rose-500 focus:text-rose-500" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
