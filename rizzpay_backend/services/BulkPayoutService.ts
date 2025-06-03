
import { supabase } from '../config/supabase';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

interface BulkPayoutRow {
  beneficiary_name: string;
  account_number?: string;
  ifsc_code?: string;
  upi_id?: string;
  amount: number;
  payout_method: string;
  description?: string;
}

interface BulkValidationResult {
  valid: boolean;
  errors: string[];
  data?: BulkPayoutRow;
}

export class BulkPayoutService {
  static async processBulkFile(
    merchantId: string,
    fileContent: string,
    fileName: string
  ) {
    try {
      console.log(`Processing bulk file: ${fileName} for merchant: ${merchantId}`);

      // Create bulk upload record
      const { data: bulkUpload, error: uploadError } = await supabase
        .from('bulk_upload_files')
        .insert({
          merchant_id: merchantId,
          file_name: fileName,
          file_path: `/uploads/${fileName}`,
          file_size: fileContent.length,
          file_checksum: this.generateChecksum(fileContent),
          processing_status: 'uploaded'
        })
        .select()
        .single();

      if (uploadError) throw uploadError;

      // Parse CSV content
      const rows = await this.parseCsvContent(fileContent);
      
      await supabase
        .from('bulk_upload_files')
        .update({
          total_records: rows.length,
          processing_status: 'validating',
          processing_started_at: new Date().toISOString()
        })
        .eq('id', bulkUpload.id);

      // Validate rows
      const validationResults = await this.validateBulkRows(rows);
      const validRows = validationResults.filter(r => r.valid);
      const invalidRows = validationResults.filter(r => !r.valid);

      // Update validation results
      await supabase
        .from('bulk_upload_files')
        .update({
          successful_records: validRows.length,
          failed_records: invalidRows.length,
          validation_errors: invalidRows.map(r => r.errors) as any,
          processing_status: validRows.length > 0 ? 'processing' : 'failed'
        })
        .eq('id', bulkUpload.id);

      if (validRows.length === 0) {
        throw new Error('No valid rows found in the file');
      }

      // Create individual payout requests
      const payoutRequests = validRows.map(row => ({
        merchant_id: merchantId,
        amount: row.data!.amount,
        currency: 'INR',
        payout_method: row.data!.payout_method,
        beneficiary_name: row.data!.beneficiary_name,
        account_number: row.data!.account_number,
        ifsc_code: row.data!.ifsc_code,
        upi_id: row.data!.upi_id,
        description: row.data!.description || `Bulk payout from ${fileName}`,
        status: 'pending',
        priority: 2, // Bulk payouts have medium priority
        processing_fee: this.calculateProcessingFee(row.data!.amount, row.data!.payout_method),
        retry_count: 0,
        max_retries: 3
      }));

      const { data: createdPayouts, error: payoutError } = await supabase
        .from('payout_requests')
        .insert(payoutRequests)
        .select();

      if (payoutError) throw payoutError;

      // Update bulk upload with completion
      await supabase
        .from('bulk_upload_files')
        .update({
          processing_status: 'completed',
          processing_completed_at: new Date().toISOString(),
          processed_records: createdPayouts.length
        })
        .eq('id', bulkUpload.id);

      return {
        success: true,
        bulk_upload_id: bulkUpload.id,
        total_records: rows.length,
        valid_records: validRows.length,
        invalid_records: invalidRows.length,
        created_payouts: createdPayouts.length,
        validation_errors: invalidRows.length > 0 ? invalidRows.map(r => r.errors) : undefined
      };

    } catch (error) {
      console.error('Error processing bulk file:', error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  private static async parseCsvContent(content: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const rows: any[] = [];
      const stream = Readable.from(content);
      
      stream
        .pipe(csv())
        .on('data', (data) => rows.push(data))
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }

  private static async validateBulkRows(rows: any[]): Promise<BulkValidationResult[]> {
    return rows.map(row => {
      const errors: string[] = [];

      // Required fields validation
      if (!row.beneficiary_name?.trim()) {
        errors.push('Beneficiary name is required');
      }

      if (!row.amount || isNaN(parseFloat(row.amount))) {
        errors.push('Valid amount is required');
      }

      if (!row.payout_method) {
        errors.push('Payout method is required');
      }

      // Method-specific validation
      if (row.payout_method === 'bank_transfer') {
        if (!row.account_number?.trim()) {
          errors.push('Account number is required for bank transfer');
        }
        if (!row.ifsc_code?.trim()) {
          errors.push('IFSC code is required for bank transfer');
        }
      }

      if (row.payout_method === 'upi' && !row.upi_id?.trim()) {
        errors.push('UPI ID is required for UPI transfer');
      }

      // Amount validation
      const amount = parseFloat(row.amount);
      if (amount <= 0) {
        errors.push('Amount must be greater than 0');
      }
      if (amount > 500000) {
        errors.push('Amount cannot exceed ₹5,00,000');
      }

      return {
        valid: errors.length === 0,
        errors,
        data: errors.length === 0 ? {
          beneficiary_name: row.beneficiary_name.trim(),
          account_number: row.account_number?.trim(),
          ifsc_code: row.ifsc_code?.trim()?.toUpperCase(),
          upi_id: row.upi_id?.trim(),
          amount,
          payout_method: row.payout_method,
          description: row.description?.trim()
        } : undefined
      };
    });
  }

  private static calculateProcessingFee(amount: number, method: string): number {
    const baseFees = {
      'bank_transfer': 5,
      'upi': 2
    };

    const percentageFees = {
      'bank_transfer': 0.005,
      'upi': 0.003
    };

    const baseFee = baseFees[method as keyof typeof baseFees] || 5;
    const percentageFee = (percentageFees[method as keyof typeof percentageFees] || 0.005) * amount;

    return Math.max(baseFee, percentageFee);
  }

  private static generateChecksum(content: string): string {
    // Simple checksum - in production, use proper hashing
    return Buffer.from(content).toString('base64').substring(0, 32);
  }

  static async getBulkUploadStatus(uploadId: string) {
    try {
      const { data, error } = await supabase
        .from('bulk_upload_files')
        .select('*')
        .eq('id', uploadId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting bulk upload status:', error);
      return null;
    }
  }
}
