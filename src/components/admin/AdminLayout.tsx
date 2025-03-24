
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  ShieldCheck, 
  Users, 
  Settings, 
  CreditCard, 
  BarChart3,
  LogOut, 
  ChevronLeft, 
  Menu, 
  Bell,
  User,
  Globe,
  Monitor,
  HelpCircle
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTransactionStore } from '@/stores/transactionStore';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { adminUI, transitions, zIndices } from '@/styles/rizzpay-ui';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import SupabaseStatus from '../SupabaseStatus';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userRole, userEmail, resetUserRole } = useTransactionStore();
  
  // Redirect if not admin
  if (userRole !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    resetUserRole();
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  // Admin navigation items
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
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Desktop sidebar */}
      <aside 
        className={cn(
          "fixed h-full z-20 transition-all duration-300 hidden lg:block",
          collapsed ? "w-20" : "w-[280px]"
        )}
        style={{ 
          width: collapsed ? adminUI.sidebar.collapsedWidth : adminUI.sidebar.width, 
          background: adminUI.sidebar.background 
        }}
      >
        <div className="h-16 border-b border-white/10 flex items-center px-4">
          <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")} style={{ width: '100%' }}>
            {!collapsed && (
              <Link to="/admin" className="font-bold text-xl flex items-center">
                <div className="h-8 w-8 rounded-lg bg-[#9970e2]/10 flex items-center justify-center mr-2">
                  <ShieldCheck className="h-5 w-5 text-[#9970e2]" />
                </div>
                <span className="text-white">RizzAdmin</span>
              </Link>
            )}
            {collapsed && (
              <div className="h-8 w-8 rounded-lg bg-[#9970e2]/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-[#9970e2]" />
              </div>
            )}
            {!collapsed && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setCollapsed(true)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-4rem)] py-4">
          <div className="space-y-2 px-3">
            {navItems.map((item) => (
              <TooltipProvider key={item.href} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center py-3 px-3 rounded-md transition-colors",
                        collapsed ? "justify-center" : "justify-start",
                        isActive(item.href)
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center">
                        <span className={cn("", collapsed ? "" : "mr-3")}>{item.icon}</span>
                        {!collapsed && <span>{item.name}</span>}
                      </div>
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          
          {/* Quick links section for common tasks */}
          {!collapsed && (
            <div className="mt-6 px-3">
              <h3 className="text-white/50 text-xs uppercase font-semibold px-3 mb-2">Quick Actions</h3>
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  className="flex items-center py-2 px-3 rounded-md transition-colors text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Monitor className="h-4 w-4 mr-3" />
                  <span className="text-sm">Merchant View</span>
                </Link>
                <Link
                  to="/"
                  className="flex items-center py-2 px-3 rounded-md transition-colors text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Globe className="h-4 w-4 mr-3" />
                  <span className="text-sm">Main Website</span>
                </Link>
                <Link
                  to="#"
                  className="flex items-center py-2 px-3 rounded-md transition-colors text-white/70 hover:text-white hover:bg-white/10"
                >
                  <HelpCircle className="h-4 w-4 mr-3" />
                  <span className="text-sm">Admin Guide</span>
                </Link>
              </div>
            </div>
          )}
          
          {!collapsed && (
            <div className="mt-8 px-6">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-white/90 text-sm font-medium mb-3">Admin Control Panel</p>
                <p className="text-white/70 text-xs mb-4">You have full access to manage the platform and users.</p>
                <p className="text-white/90 text-xs flex items-center">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Admin privileges
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
        
        {!collapsed && (
          <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarFallback className="bg-[#9970e2] text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{userEmail}</p>
                <p className="text-white/70 text-xs">Administrator</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {collapsed && (
          <div className="absolute bottom-4 left-0 w-full flex justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCollapsed(false)}
              className="text-white/70 hover:text-white hover:bg-white/10 h-10 w-10 rounded-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        )}
      </aside>

      {/* Mobile sidebar trigger */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <main className={cn(
          "flex-1 min-h-screen transition-all duration-300",
          collapsed ? "lg:ml-20" : "lg:ml-[280px]"
        )}>
          <header className="h-16 bg-white border-b flex items-center px-4 sticky top-0 z-10">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <div className="lg:hidden flex items-center">
                  <ShieldCheck className="h-5 w-5 text-[#9970e2] mr-2" />
                  <span className="font-semibold">RizzAdmin</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <SupabaseStatus />
                
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
                      <Link to="/admin/settings" className="cursor-pointer flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Settings</span>
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
          
          <div className="p-6">
            {children}
          </div>
        </main>
        
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
    </div>
  );
};

export default AdminLayout;
