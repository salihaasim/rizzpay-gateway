
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface AdminSidebarUserSectionProps {
  userEmail?: string;
  collapsed: boolean;
  handleLogout?: () => void;
}

export function AdminSidebarUserSection({ userEmail, collapsed, handleLogout }: AdminSidebarUserSectionProps) {
  return (
    <div className="border-t border-gray-200 p-4">
      {!collapsed && userEmail && (
        <>
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-white text-sm">
                {userEmail.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userEmail.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <Separator className="mb-3" />
        </>
      )}
      
      <Button 
        variant="ghost" 
        size="sm"
        onClick={handleLogout}
        className={cn(
          "w-full text-gray-600 hover:text-red-600 hover:bg-red-50 justify-start",
          collapsed && "justify-center px-2"
        )}
        title={collapsed ? "Logout" : undefined}
      >
        <LogOut className="h-4 w-4" />
        {!collapsed && <span className="ml-2">Logout</span>}
      </Button>
    </div>
  );
}
