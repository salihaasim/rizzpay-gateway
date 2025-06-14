
import { supabase } from '../config/supabase';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export interface ReconciliationResult {
  matched: Array<any>;
  unmatched: Array<any>;
  manual_overrides: Array<any>;
}

export class ReconciliationService {
  static async processReconciliationFile(filePath: string, adminId: string, fileName: string): Promise<ReconciliationResult> {
    // Load file and parse as CSV/XLSX
    let workbook;
    let dataRows: any[] = [];

    // Support both .csv and .xlsx
    if (filePath.endsWith('.csv') || filePath.endsWith('.xls') || filePath.endsWith('.xlsx')) {
      workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      dataRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
      throw new Error('Unsupported file type');
    }

    // Try to match to payouts (using UTR/account/amount, etc.)
    const { data: payouts } = await supabase
      .from('payout_requests')
      .select('*')
      .in('status', ['completed', 'processing']);

    // Simple auto-match: exact match on amount & UTR
    const matched: any[] = [];
    const unmatched: any[] = [];
    dataRows.forEach((row: any) => {
      // Typical columns: UTR/ref, amount, date. Adjust as needed.
      const fileUtr = (row.utr || row.UTR || row.utr_number || row.UTR_NUMBER || '').toString();
      const fileAmt = Number(row.amount || row.AMOUNT || row.Amt || 0);

      const payout = payouts?.find((p: any) =>
        (p.utr_number && p.utr_number === fileUtr) &&
        Number(p.amount) === fileAmt
      );
      if (payout) {
        matched.push({ ...row, payout_id: payout.id });
      } else {
        unmatched.push(row);
      }
    });

    // Store log in reconciliation_logs table
    const { data: log } = await supabase
      .from('reconciliation_logs')
      .insert([{
        admin_id: adminId,
        file_name: fileName,
        total_records: dataRows.length,
        matched_count: matched.length,
        unmatched_count: unmatched.length,
        manual_overrides: [],
        match_results: matched.concat(unmatched.map(u => ({ ...u, payout_id: null }))),
        export_link: null // can be updated if exporting
      }])
      .select()
      .single();

    // Clean up temp file
    fs.unlinkSync(filePath);

    return {
      matched,
      unmatched,
      manual_overrides: [],
    };
  }
}
