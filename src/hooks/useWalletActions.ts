
import { useState } from 'react';
import { useTransactionStore } from '@/stores/transactions';
import { simulateWalletProcessing } from '@/utils/walletUtils';
import { toast } from 'sonner';
import { handleWalletToBankTransfer } from '@/utils/hdfcBankApi';
import { PaymentMethod } from '@/stores/transactions/types';

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
      await simulateWalletProcessing(userEmail, amount, 'deposit', 'wallet' as PaymentMethod);
      
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
  
  const handleWithdraw = async (
    amount: number, 
    description?: string, 
    bankDetails?: {
      accountNumber: string;
      ifscCode: string;
      beneficiaryName: string;
      method: string;
    }
  ) => {
    if (isProcessing) return;
    
    if (amount > walletBalance) {
      toast.error("Insufficient balance", {
        description: "Your wallet balance is insufficient for this withdrawal."
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Special handling for NEFT withdrawals
      if (bankDetails && bankDetails.method === 'neft') {
        toast.info("Processing NEFT transfer...");
        
        // Call HDFC Bank API integration
        const transactionId = await handleWalletToBankTransfer(
          bankDetails.accountNumber,
          bankDetails.ifscCode,
          bankDetails.beneficiaryName,
          amount,
          userEmail
        );
        
        if (!transactionId) {
          throw new Error("Bank transfer failed");
        }
        
        // Update description with bank details
        const enhancedDescription = `${description || 'NEFT Transfer'} | To: ${bankDetails.beneficiaryName} | A/C: ${bankDetails.accountNumber.substring(0, 4)}XXXX${bankDetails.accountNumber.substring(bankDetails.accountNumber.length - 4)} | IFSC: ${bankDetails.ifscCode}`;
        
        // Process the wallet withdrawal
        await simulateWalletProcessing(userEmail, amount, 'withdrawal', 'neft' as PaymentMethod);
        
        toast.success("NEFT transfer initiated", {
          description: `₹${amount.toFixed(2)} is being transferred to your bank account.`
        });
      } else {
        // Regular wallet withdrawal
        toast.info("Processing withdrawal...");
        
        // Use the utility function to simulate processing
        await simulateWalletProcessing(userEmail, amount, 'withdrawal', 'wallet' as PaymentMethod);
        
        toast.success("Withdrawal successful", {
          description: `₹${amount.toFixed(2)} has been withdrawn from your wallet.`
        });
      }
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
      
      // Use the store's transferFunds function
      const transferId = store.transferFunds(userEmail, recipient, amount, description);
      
      if (!transferId) {
        throw new Error("Transfer failed");
      }
      
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
