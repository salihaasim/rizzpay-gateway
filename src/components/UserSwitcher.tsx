import React, { useState, useEffect } from 'react';
import { useProfileStore, Merchant } from '@/stores/profileStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { User, LogOut, UserPlus, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import UserRegistrationForm from './UserRegistrationForm';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { v4 as uuidv4 } from 'uuid';

const UserSwitcher = () => {
  const { userEmail, setUserRole } = useTransactionStore();
  const { merchants, addMerchant } = useProfileStore();
  const { logout: merchantLogout } = useMerchantAuth();
  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const navigate = useNavigate();
  
  // Mock login functionality
  const handleUserSwitch = (email: string) => {
    // Initialize wallet for the user if it doesn't exist
    useTransactionStore.getState().initializeWallet(email);
    
    // Set user role as merchant
    setUserRole('merchant', email);
    
    // Close the dropdown
    setOpen(false);
    
    // Show success toast
    toast.success(`Switched to ${email}`);
    
    // Redirect to dashboard
    navigate('/dashboard');
  };
  
  const handleLogout = () => {
    // Call both logout methods to ensure complete logout
    setUserRole(null, null);
    merchantLogout(); // Add this to ensure proper merchant logout
    
    setOpen(false);
    
    // Redirect to home page
    navigate('/', { replace: true });
    
    toast.success('Logged out successfully');
  };
  
  const handleRegisterUser = (userData: { name: string; email: string; phone: string; company: string }) => {
    // Create new merchant with all required properties
    const newMerchant: Merchant = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      company: userData.company,
      createdAt: new Date().toISOString(),
      kycStatus: 'pending',
      kycData: {
        aadhaarCard: null,
        panCard: null,
        gstCertificate: null,
        gstNumber: null
      }
    };
    
    // Add the new merchant
    addMerchant(newMerchant);
    
    // Initialize wallet for the new user
    useTransactionStore.getState().initializeWallet(userData.email);
    
    // Switch to the new user
    handleUserSwitch(userData.email);
    
    // Close dialog
    setRegisterOpen(false);
    
    // Success message
    toast.success('New user registered successfully!');
  };
  
  // Get current user details
  const currentMerchant = userEmail ? merchants.find(m => m.email === userEmail) : null;
  
  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-start md:w-auto md:px-3 gap-2">
            <User className="h-4 w-4" />
            <span className="truncate max-w-[150px]">
              {currentMerchant?.name || userEmail || 'Sign In'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="font-normal text-xs text-muted-foreground">Signed in as</div>
            <div className="font-semibold truncate">{userEmail || 'Not signed in'}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {merchants.length > 0 && (
            <>
              <DropdownMenuLabel>Switch User</DropdownMenuLabel>
              {merchants.map(merchant => (
                <DropdownMenuItem 
                  key={merchant.id} 
                  onClick={() => handleUserSwitch(merchant.email)}
                  disabled={merchant.email === userEmail}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span className="truncate">{merchant.name}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuItem 
            onClick={() => {
              setOpen(false);
              setRegisterOpen(true);
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Register New User
          </DropdownMenuItem>
          
          {userEmail ? (
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => navigate('/login')}>
              <User className="mr-2 h-4 w-4" />
              Sign In
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Register New User</DialogTitle>
          </DialogHeader>
          <UserRegistrationForm onRegister={handleRegisterUser} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserSwitcher;
