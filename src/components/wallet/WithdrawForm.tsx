
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowDownCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const withdrawSchema = z.object({
  amount: z.string()
    .min(1, { message: "Amount is required" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  description: z.string().optional(),
});

type WithdrawFormValues = z.infer<typeof withdrawSchema>;

interface WithdrawFormProps {
  onWithdraw: (amount: number, description?: string) => void;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onWithdraw }) => {
  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: '',
      description: '',
    },
  });

  const handleSubmit = (data: WithdrawFormValues) => {
    onWithdraw(Number(data.amount), data.description);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                  <Input {...field} type="text" placeholder="0.00" className="pl-8" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (optional)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Add a note for this withdrawal" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" size="lg" variant="outline">
          <ArrowDownCircle className="mr-2 h-4 w-4" />
          Withdraw Funds
        </Button>
      </form>
    </Form>
  );
};

export default WithdrawForm;
