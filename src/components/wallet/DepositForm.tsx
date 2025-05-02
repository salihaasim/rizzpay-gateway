
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface DepositFormProps {
  onDeposit: (amount: number, description?: string) => void;
  isProcessing?: boolean;
}

const DepositForm: React.FC<DepositFormProps> = ({ onDeposit, isProcessing = false }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }
    
    onDeposit(parsedAmount, description);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-full">
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm sm:text-base">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base">₹</span>
          <Input 
            id="amount"
            type="number" 
            min="1"
            step="0.01"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="pl-8 text-sm sm:text-base h-10 sm:h-auto"
            disabled={isProcessing}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm sm:text-base">Description (Optional)</Label>
        <Textarea 
          id="description"
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a note to this deposit"
          className="resize-none text-sm sm:text-base" 
          rows={3}
          disabled={isProcessing}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isProcessing || !amount || parseFloat(amount) <= 0}
        className="w-full text-sm sm:text-base h-10 sm:h-auto"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          'Deposit Funds'
        )}
      </Button>
    </form>
  );
};

export default DepositForm;
