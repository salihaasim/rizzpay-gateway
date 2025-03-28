
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, Download, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useWalletActions } from '@/hooks/useWalletActions';
import { toast } from 'sonner';

interface BulkWithdrawalEntry {
  beneficiaryName: string;
  accountNumber: string;
  ifscCode: string;
  amount: number;
  remarks?: string;
}

interface BulkWithdrawalFormProps {
  userEmail: string | null;
}

const BulkWithdrawalForm: React.FC<BulkWithdrawalFormProps> = ({ userEmail }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [entries, setEntries] = useState<BulkWithdrawalEntry[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  
  const { walletBalance, handleWithdraw } = useWalletActions(userEmail);
  
  const validateEntries = (data: BulkWithdrawalEntry[]): string[] => {
    const newErrors: string[] = [];
    
    // Check if there are any entries
    if (data.length === 0) {
      newErrors.push('Excel file contains no valid entries.');
      return newErrors;
    }
    
    // Calculate total amount
    const totalAmount = data.reduce((sum, entry) => sum + entry.amount, 0);
    
    // Check if wallet has sufficient balance
    if (totalAmount > walletBalance) {
      newErrors.push(`Insufficient wallet balance. Required: ₹${totalAmount.toFixed(2)}, Available: ₹${walletBalance.toFixed(2)}`);
    }
    
    // Validate each entry
    data.forEach((entry, index) => {
      if (!entry.beneficiaryName || entry.beneficiaryName.trim() === '') {
        newErrors.push(`Row ${index + 1}: Beneficiary name is required.`);
      }
      
      if (!entry.accountNumber || !/^\d{9,18}$/.test(entry.accountNumber)) {
        newErrors.push(`Row ${index + 1}: Invalid account number format.`);
      }
      
      if (!entry.ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(entry.ifscCode)) {
        newErrors.push(`Row ${index + 1}: Invalid IFSC code format.`);
      }
      
      if (!entry.amount || entry.amount <= 0) {
        newErrors.push(`Row ${index + 1}: Amount must be greater than zero.`);
      }
    });
    
    return newErrors;
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors([]);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
        
        // Map to expected format
        const parsedEntries: BulkWithdrawalEntry[] = jsonData.map(row => ({
          beneficiaryName: row['Beneficiary Name'] || '',
          accountNumber: row['Account Number']?.toString() || '',
          ifscCode: row['IFSC Code'] || '',
          amount: parseFloat(row['Amount'] || 0),
          remarks: row['Remarks'] || ''
        }));
        
        // Validate
        const validationErrors = validateEntries(parsedEntries);
        setErrors(validationErrors);
        
        if (validationErrors.length === 0) {
          setEntries(parsedEntries);
          toast.success(`Uploaded ${parsedEntries.length} transfers successfully.`);
        }
        
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        setErrors(['Failed to parse Excel file. Please ensure it is a valid .xlsx file with the correct format.']);
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      setErrors(['Error reading file.']);
      setIsUploading(false);
    };
    
    reader.readAsArrayBuffer(file);
    
    // Reset input value so the same file can be uploaded again
    e.target.value = '';
  };
  
  const downloadTemplate = () => {
    // Create sample data
    const sampleData = [
      {
        'Beneficiary Name': 'John Doe',
        'Account Number': '12345678901',
        'IFSC Code': 'HDFC0001234',
        'Amount': 1000,
        'Remarks': 'Salary payment'
      },
      {
        'Beneficiary Name': 'Jane Smith',
        'Account Number': '98765432101',
        'IFSC Code': 'ICIC0005678',
        'Amount': 2500,
        'Remarks': 'Vendor payment'
      }
    ];
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bulk Withdrawals');
    
    // Write to file and download
    XLSX.writeFile(workbook, 'rizzpay_bulk_withdrawal_template.xlsx');
  };
  
  const processWithdrawals = async () => {
    if (entries.length === 0 || errors.length > 0 || !userEmail) return;
    
    setIsProcessing(true);
    
    let successCount = 0;
    let failCount = 0;
    
    try {
      // Process each withdrawal sequentially
      for (const entry of entries) {
        try {
          await handleWithdraw(
            entry.amount,
            entry.remarks || `Payment to ${entry.beneficiaryName}`,
            {
              accountNumber: entry.accountNumber,
              ifscCode: entry.ifscCode,
              beneficiaryName: entry.beneficiaryName,
              method: 'neft'
            }
          );
          successCount++;
        } catch (error) {
          console.error('Error processing withdrawal:', error);
          failCount++;
        }
      }
      
      if (successCount === entries.length) {
        toast.success(`All ${successCount} withdrawals processed successfully.`);
        setEntries([]);
      } else if (successCount > 0) {
        toast.success(`Processed ${successCount} withdrawals successfully. ${failCount} failed.`);
      } else {
        toast.error('Failed to process any withdrawals. Please try again.');
      }
    } catch (error) {
      console.error('Error in batch processing:', error);
      toast.error('An error occurred during processing. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="file-upload" className="block mb-2">Upload Excel File</Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                disabled={isUploading || isProcessing}
                className="cursor-pointer"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={downloadTemplate}
              title="Download RizzPay Template"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="mt-2">
              <p className="font-semibold">Please fix the following errors:</p>
              <ul className="list-disc pl-5 mt-1 text-sm">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {entries.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="text-sm font-medium mb-2">Summary</h3>
            <ul className="text-sm space-y-1">
              <li>Total Entries: {entries.length}</li>
              <li>Total Amount: ₹{entries.reduce((sum, entry) => sum + entry.amount, 0).toFixed(2)}</li>
            </ul>
          </div>
          
          <Button 
            onClick={processWithdrawals} 
            disabled={isProcessing || errors.length > 0}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Processing RizzPay Withdrawals...
              </>
            ) : (
              'Process All Withdrawals'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BulkWithdrawalForm;
