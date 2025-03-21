
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface WithdrawFormProps {
  onWithdraw: (amount: number, description?: string) => void;
  isProcessing?: boolean;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onWithdraw, isProcessing = false }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }
    
    onWithdraw(parsedAmount, description);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
          <Input 
            id="amount"
            type="number" 
            min="1"
            step="0.01"
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="pl-8"
            disabled={isProcessing}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea 
          id="description"
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a note to this withdrawal"
          className="resize-none" 
          rows={3}
          disabled={isProcessing}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isProcessing || !amount || parseFloat(amount) <= 0}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          'Withdraw Funds'
        )}
      </Button>
    </form>
  );
};

export default WithdrawForm;
