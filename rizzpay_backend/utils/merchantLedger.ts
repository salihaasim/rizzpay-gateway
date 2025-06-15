
import { supabase } from '../config/supabase';

/**
 * Write a new entry into merchant_ledger.
 * @param {Object} params
 * @param {string} merchantId - Merchant UUID
 * @param {string} entryType - 'credit' | 'debit'
 * @param {number} amount - Amount (positive number)
 * @param {string} source - 'payin', 'payout', 'adjustment', etc.
 * @param {string} transactionId - Related transaction id
 * @param {string} description - Description for audit
 * @param {object} [metadata] - Optional arbitrary JSON
 */
export async function writeMerchantLedgerEntry({
  merchantId,
  entryType,
  amount,
  source,
  transactionId,
  description,
  metadata = {},
}: {
  merchantId: string,
  entryType: 'credit' | 'debit',
  amount: number,
  source: string,
  transactionId?: string,
  description?: string,
  metadata?: Record<string, any>
}) {
  // Get previous balance
  const { data: lastEntry } = await supabase
    .from('merchant_ledger')
    .select('balance_after')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const prevBalance = lastEntry?.balance_after ?? 0;
  const newBalance =
    entryType === 'credit'
      ? prevBalance + amount
      : prevBalance - amount;

  await supabase.from('merchant_ledger').insert({
    merchant_id: merchantId,
    transaction_id: transactionId,
    entry_type: entryType,
    amount,
    source,
    balance_after: newBalance,
    description,
    metadata,
  });
}
