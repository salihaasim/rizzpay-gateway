
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  try {
    // 1. Fetch up to 10 highest-priority pending payouts
    const { data: payouts, error } = await supabase
      .from('payout_requests')
      .select('*')
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(10);

    if (error) throw error;

    const results = [];
    for (const payout of payouts ?? []) {
      // Mark as processing
      await supabase
        .from('payout_requests')
        .update({
          status: 'processing',
          processing_started_at: new Date().toISOString(),
        })
        .eq('id', payout.id);

      // --- Simulate bank API call (80% success rate) ---
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      const isSuccess = Math.random() < 0.8;

      if (isSuccess) {
        // Mark as completed
        await supabase
          .from('payout_requests')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            utr_number: `UTR${Math.floor(Math.random() * 1e12)}`,
          })
          .eq('id', payout.id);
        results.push({ id: payout.id, status: 'completed'});
      } else {
        const nextRetry = new Date(Date.now() + Math.pow(2, (payout.retry_count ?? 0)) * 60 * 1000);
        // Mark as failed/retry logic
        let updateObj: any = {
          retry_count: (payout.retry_count ?? 0) + 1,
          failure_reason: "BANK_API_SIMULATION: Temporary error",
          updated_at: new Date().toISOString(),
        };

        if ((payout.retry_count ?? 0) + 1 >= (payout.max_retries ?? 3)) {
          updateObj.status = 'failed';
          updateObj.failed_at = new Date().toISOString();
        } else {
          updateObj.next_retry_at = nextRetry.toISOString();
          updateObj.status = 'pending';
        }

        await supabase
          .from('payout_requests')
          .update(updateObj)
          .eq('id', payout.id);

        results.push({ id: payout.id, status: updateObj.status });
      }
    }

    return new Response(
      JSON.stringify({ message: 'Payout queue processed', results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: `${err}` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
