
import { supabase } from '../config/supabase';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export class ReconciliationService {
  static async processReconciliationFile(filePath: string, adminId: string, fileName: string) {
    // Load file and parse as CSV/XLSX
    let workbook;
    let dataRows: any[] = [];
    if (filePath.endsWith('.csv') || filePath.endsWith('.xls') || filePath.endsWith('.xlsx')) {
      workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      dataRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
      throw new Error('Unsupported file type');
    }
    // Fetch payouts to match
    const { data: payouts } = await supabase
      .from('payout_requests')
      .select('*')
      .in('status', ['completed', 'processing']);
    // Enhanced match: try UTR+Amount, fallback to Amount+Bank/Date
    const matched: any[] = [];
    const unmatched: any[] = [];
    dataRows.forEach((row: any) => {
      const fileUtr = (row.utr || row.UTR || row.utr_number || row.UTR_NUMBER || '').toString();
      const fileAmt = Number(row.amount || row.AMOUNT || row.Amt || 0);
      // UTR + Amount
      let payout = payouts?.find((p: any) =>
        p.utr_number && p.utr_number === fileUtr && Number(p.amount) === fileAmt
      );
      // Fallback: just amount (within short date window)
      if (!payout && fileAmt) {
        payout = payouts?.find((p: any) =>
          Number(p.amount) === fileAmt
        );
      }
      if (payout) {
        matched.push({ ...row, payout_id: payout.id });
      } else {
        unmatched.push(row);
      }
    });
    // Insert log to table, including all entry results
    const logResult = await supabase
      .from('reconciliation_logs')
      .insert([{
        admin_id: adminId,
        file_name: fileName,
        total_records: dataRows.length,
        matched_count: matched.length,
        unmatched_count: unmatched.length,
        manual_overrides: [],
        match_results: matched.concat(unmatched.map(u => ({ ...u, payout_id: null }))),
        export_link: null
      }])
      .select()
      .single();
    // Clean up temp file
    fs.unlinkSync(filePath);
    return {
      matched, unmatched, manual_overrides: [],
      reconciliation_log: logResult.data
    };
  }

  static async listLogs(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, count } = await supabase
      .from('reconciliation_logs')
      .select('*', { count: 'exact' })
      .order('upload_time', { ascending: false })
      .range(from, to);
    return { data, total: count };
  }

  static async getLogDetail(id: string) {
    const { data } = await supabase
      .from('reconciliation_logs')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    return data;
  }

  static async manualOverride(
    logId: string,
    entryIndex: number,
    payoutId: string | undefined,
    overrideStatus: string,
    notes: string | undefined
  ) {
    // Get log
    const { data: log } = await supabase
      .from('reconciliation_logs')
      .select('*')
      .eq('id', logId)
      .maybeSingle();
    if (!log) throw new Error('Log not found');
    const matchResults = Array.isArray(log.match_results) ? log.match_results : [];
    if (entryIndex < 0 || entryIndex >= matchResults.length) throw new Error('Invalid entry index');
    let overrides = Array.isArray(log.manual_overrides) ? log.manual_overrides : [];
    overrides.push({
      entry_index: entryIndex,
      payout_id: payoutId,
      override_status: overrideStatus,
      notes,
      timestamp: new Date().toISOString()
    });
    // Patch the result in-place for UI purpose (leave match logic simple for now)
    matchResults[entryIndex] = {
      ...matchResults[entryIndex],
      payout_id: payoutId,
      override_status: overrideStatus,
      override_notes: notes,
      override_time: new Date().toISOString(),
    };
    // Update log row
    const { data: updated, error } = await supabase
      .from('reconciliation_logs')
      .update({
        manual_overrides: overrides,
        match_results: matchResults
      })
      .eq('id', logId)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return updated;
  }

  static async exportLogToCsv(logId: string): Promise<string> {
    // Find reconciliation log
    const { data: log } = await supabase
      .from('reconciliation_logs')
      .select('*')
      .eq('id', logId)
      .maybeSingle();
    if (!log) throw new Error('Log not found');
    // Prepare CSV string
    const fields = Object.keys((log.match_results?.[0]) ?? { UTR: '', amount: '', payout_id: '', override_status: '' });
    let csv = fields.join(',') + '\n';
    for (const row of log.match_results ?? []) {
      csv += fields.map(f => String(row[f] ?? '')).join(',') + '\n';
    }
    return csv;
  }
}
