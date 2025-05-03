
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { QrCode, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/stores/transactionStore';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface UpiTransactionToggleProps {
  showUpiTransactions: boolean;
  setShowUpiTransactions: (value: boolean) => void;
  upiTransactions?: Transaction[];
}

const UpiTransactionToggle: React.FC<UpiTransactionToggleProps> = ({
  showUpiTransactions,
  setShowUpiTransactions,
  upiTransactions = []
}) => {
  const exportToExcel = () => {
    if (upiTransactions.length === 0) {
      toast.error('No UPI transactions available to download');
      return;
    }

    // Format data for Excel
    const data = upiTransactions.map(t => ({
      'Transaction ID': t.id,
      'Date': new Date(t.date).toLocaleString(),
      'Amount': t.amount,
      'Status': t.status.charAt(0).toUpperCase() + t.status.slice(1),
      'UPI ID': t.paymentDetails?.upiId || 'Not provided',
      'UPI Transaction ID': t.paymentDetails?.upiTransactionId || t.paymentDetails?.razorpay_payment_id || 'Not available',
      'Customer Email': t.paymentDetails?.buyerEmail || t.customer || 'Not available',
      'Customer Name': t.paymentDetails?.buyerName || 'Not available',
      'Detailed Status': t.detailedStatus || '',
    }));
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UPI Transactions');
    
    // Get current date for filename
    const date = new Date();
    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    
    // Export to file
    XLSX.writeFile(wb, `RizzPay_UPI_Transactions_${dateString}.xlsx`);
    
    toast.success('UPI transactions downloaded successfully');
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 bg-secondary/30 p-2 rounded-lg">
      <div className="flex items-center space-x-2">
        <QrCode className="h-4 w-4 text-[#9b87f5]" />
        <Label htmlFor="upi-toggle" className="text-sm font-medium cursor-pointer">
          Show Manual UPI Plugin Transactions
        </Label>
        <Switch 
          id="upi-toggle" 
          checked={showUpiTransactions} 
          onCheckedChange={setShowUpiTransactions}
          className="data-[state=checked]:bg-[#9b87f5]"
        />
      </div>
      
      {showUpiTransactions && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10"
          onClick={exportToExcel}
        >
          <FileDown className="h-4 w-4" />
          <span>Export UPI Data</span>
        </Button>
      )}
    </div>
  );
};

export default UpiTransactionToggle;
