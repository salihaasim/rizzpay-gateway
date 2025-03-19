
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  BarChart2,
  Settings,
  Home,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Dashboard', path: '/dashboard', icon: BarChart2 },
  { name: 'Transactions', path: '/transactions', icon: CreditCard },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 w-full bg-white/80 dark:bg-background/80 backdrop-blur-md z-50 border-b border-border px-8 py-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <Link to="/" className="flex items-center space-x-2">
            <span className="bg-primary text-primary-foreground p-2 rounded-md">
              <CreditCard size={20} />
            </span>
            <span className="font-bold text-xl">Rizzpay</span>
          </Link>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-full transition-all duration-300",
                      isActive ? "bg-secondary text-foreground" : "hover:bg-secondary/50"
                    )}
                  >
                    <item.icon className="mr-2" size={18} />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
            <Button variant="ghost" className="ml-2 rounded-full" size="icon">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 w-full bg-white/80 dark:bg-background/80 backdrop-blur-md z-50 border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <CreditCard size={18} />
            </span>
            <span className="font-bold text-lg">Rizzpay</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-16 bg-background/95 backdrop-blur-sm animate-fade-in">
          <div className="flex flex-col space-y-2 p-4 animate-slide-in">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center p-3 rounded-md",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "hover:bg-secondary/50"
                  )}
                >
                  <item.icon className="mr-3" size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
                <LogOut size={20} className="mr-3" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
