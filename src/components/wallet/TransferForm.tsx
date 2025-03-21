
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Merchant } from '@/stores/profileStore';
import { Loader2 } from 'lucide-react';

interface TransferFormProps {
  merchants: Merchant[];
  onTransfer: (recipient: string, amount: number, description?: string) => void;
  isProcessing?: boolean;
}

const TransferForm: React.FC<TransferFormProps> = ({ 
  merchants, 
  onTransfer,
  isProcessing = false 
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !recipient) {
      return;
    }
    
    onTransfer(recipient, parsedAmount, description);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipient">Recipient</Label>
        <Select 
          value={recipient} 
          onValueChange={setRecipient}
          disabled={isProcessing}
        >
          <SelectTrigger id="recipient">
            <SelectValue placeholder="Select merchant" />
          </SelectTrigger>
          <SelectContent>
            {merchants.map((merchant) => (
              <SelectItem key={merchant.id} value={merchant.email}>
                {merchant.name} ({merchant.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
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
          placeholder="Add a note to this transfer"
          className="resize-none" 
          rows={3}
          disabled={isProcessing}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isProcessing || !recipient || !amount || parseFloat(amount) <= 0}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          'Send Funds'
        )}
      </Button>
    </form>
  );
};

export default TransferForm;
