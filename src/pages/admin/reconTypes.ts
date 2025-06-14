
// Shared types for reconciliation page

export interface PayoutRecord {
  id: string;
  transactionId: string;
  merchant: string;
  amount: number;
  status: string;
  payoutMethod: string;
  beneficiary: string;
  utrNumber?: string;
  createdAt: string;
  updatedAt: string;
  bankStatus?: string;
  reconciliationStatus: string;
}

export interface CsvRecord {
  id: string;
  utrNumber: string;
  amount: number;
  narration: string;
  date: string;
  matched: boolean;
  matchedOrderId?: string;
}

export interface ReconciliationLog {
  id: string;
  fileName: string;
  uploadedAt: string;
  totalRecords: number;
  matchedRecords: number;
  unmatchedRecords: number;
  uploadedBy: string;
}
