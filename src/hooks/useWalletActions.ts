
import { useState } from 'react';
import { useTransactionStore } from '@/stores/transactionStore';
import { simulateWalletProcessing } from '@/utils/walletUtils';
import { toast } from 'sonner';

export const useWalletActions = (userEmail: string | null) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const store = useTransactionStore.getState();
  
  // Early return if no user email
  if (!userEmail) {
    return {
      isProcessing,
      walletBalance: 0,
      handleDeposit: () => {},
      handleWithdraw: () => {},
      handleTransfer: () => {}
    };
  }
  
  const walletBalance = store.getWalletBalance(userEmail);
  
  const handleDeposit = async (amount: number, description?: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      toast.info("Processing deposit...");
      
      // Use the utility function to simulate processing
      await simulateWalletProcessing(userEmail, amount, 'deposit', description);
      
      toast.success("Deposit successful", {
        description: `₹${amount.toFixed(2)} has been added to your wallet.`
      });
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error("Deposit failed", {
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleWithdraw = async (amount: number, description?: string) => {
    if (isProcessing) return;
    
    if (amount > walletBalance) {
      toast.error("Insufficient balance", {
        description: "Your wallet balance is insufficient for this withdrawal."
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      toast.info("Processing withdrawal...");
      
      // Use the utility function to simulate processing
      await simulateWalletProcessing(userEmail, amount, 'withdrawal', description);
      
      toast.success("Withdrawal successful", {
        description: `₹${amount.toFixed(2)} has been withdrawn from your wallet.`
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error("Withdrawal failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleTransfer = async (recipient: string, amount: number, description?: string) => {
    if (isProcessing) return;
    
    if (amount > walletBalance) {
      toast.error("Insufficient balance", {
        description: "Your wallet balance is insufficient for this transfer."
      });
      return;
    }
    
    if (!recipient) {
      toast.error("Invalid recipient", {
        description: "Please select a valid recipient for the transfer."
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      toast.info("Processing transfer...");
      
      // Use the utility function to simulate processing for transfers too
      await simulateWalletProcessing(userEmail, amount, 'transfer', description, recipient);
      
      toast.success("Transfer successful", {
        description: `₹${amount.toFixed(2)} has been sent successfully.`
      });
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error("Transfer failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred."
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    walletBalance,
    handleDeposit,
    handleWithdraw,
    handleTransfer
  };
};
