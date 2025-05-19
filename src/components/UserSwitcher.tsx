
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTransactionStore } from '@/stores/transactionStore';

interface UserSwitcherProps {
  onSelectUser: (email: string, role: string) => void;
  selectedUser: { email: string; role: string };
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ onSelectUser, selectedUser }) => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setUserEmail, setUserRole } = useTransactionStore();

  // Demo users for testing
  const demoUsers = [
    { email: 'merchant@rizzpay.com', role: 'merchant' },
    { email: 'admin@rizzpay.com', role: 'admin' },
    { email: 'user@example.com', role: 'user' },
  ];

  const handleSelectUser = (email: string, role: string) => {
    onSelectUser(email, role);
    
    // Update user in store
    setUserEmail(email);
    setUserRole(role);
    
    // Close popover and dialog
    setOpen(false);
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Button 
        onClick={() => setDialogOpen(true)} 
        variant="outline" 
        className="relative h-8 w-full justify-between md:w-40"
      >
        <User className="mr-2 h-4 w-4" />
        <span className="truncate">{selectedUser.email}</span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Switch User</DialogTitle>
        </DialogHeader>
        
        <div className="p-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedUser.email}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search users..." />
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup>
                  {demoUsers.map((user) => (
                    <CommandItem
                      key={user.email}
                      onSelect={() => handleSelectUser(user.email, user.role)}
                      className="text-sm"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {user.email}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedUser.email === user.email
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          
          <div className="mt-4">
            <div className="rounded-md bg-secondary p-2 text-xs text-muted-foreground">
              <p>Selected role: <strong>{selectedUser.role}</strong></p>
              <p className="mt-1">This is a demo user switcher for testing different roles.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserSwitcher;
