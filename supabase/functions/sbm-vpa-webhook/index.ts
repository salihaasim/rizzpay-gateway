
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    const payload = await req.json();
    console.log('SBM VPA Webhook received:', payload);

    // Validate webhook signature (implement based on SBM Bank specs)
    const signature = req.headers.get('x-sbm-signature');
    if (!validateWebhookSignature(payload, signature)) {
      return new Response('Invalid signature', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    // Process the VPA payment
    const webhookData = {
      vpaAddress: payload.payeeVpa,
      amount: parseFloat(payload.amount),
      senderVpa: payload.payerVpa,
      transactionRef: payload.transactionId,
      bankReference: payload.rrn,
      timestamp: payload.timestamp,
      status: payload.status === 'SUCCESS' ? 'success' : 'failed'
    };

    // Log the incoming payment
    const { data: logData, error: logError } = await supabaseClient
      .from('vpa_payment_logs')
      .insert({
        vpa_address: webhookData.vpaAddress,
        transaction_ref: webhookData.transactionRef,
        amount: webhookData.amount,
        sender_vpa: webhookData.senderVpa,
        bank_reference: webhookData.bankReference,
        webhook_payload: payload,
        processing_status: 'received'
      })
      .select()
      .single();

    if (logError) throw logError;

    // Find merchant by VPA
    const { data: vpaMapping, error: vpaError } = await supabaseClient
      .from('vpa_mappings')
      .select(`
        merchant_id,
        merchant_profiles!inner(*)
      `)
      .eq('vpa_address', webhookData.vpaAddress)
      .eq('status', 'active')
      .maybeSingle();

    if (vpaError || !vpaMapping) {
      await supabaseClient
        .from('vpa_payment_logs')
        .update({ processing_status: 'failed' })
        .eq('id', logData.id);
      
      throw new Error(`No active merchant found for VPA: ${webhookData.vpaAddress}`);
    }

    // Update log with merchant info
    await supabaseClient
      .from('vpa_payment_logs')
      .update({
        merchant_id: vpaMapping.merchant_id,
        processing_status: 'processing'
      })
      .eq('id', logData.id);

    if (webhookData.status === 'success') {
      // Create transaction record
      const transactionId = `VPA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { error: txnError } = await supabaseClient
        .from('transactions')
        .insert({
          id: transactionId,
          merchant_id: vpaMapping.merchant_id,
          amount: webhookData.amount,
          currency: 'INR',
          payment_method: 'UPI_VPA',
          status: 'successful',
          assigned_vpa: webhookData.vpaAddress,
          vpa_payment_ref: webhookData.transactionRef,
          payment_source: 'vpa',
          customer_name: 'UPI Customer',
          description: `VPA Payment via ${webhookData.senderVpa}`,
          payment_details: {
            senderVpa: webhookData.senderVpa,
            bankReference: webhookData.bankReference,
            paymentMode: 'VPA'
          }
        });

      if (txnError) throw txnError;

      // Update log as processed
      await supabaseClient
        .from('vpa_payment_logs')
        .update({
          matched_transaction_id: transactionId,
          processing_status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', logData.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          transactionId,
          message: 'Payment processed successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      await supabaseClient
        .from('vpa_payment_logs')
        .update({ processing_status: 'failed' })
        .eq('id', logData.id);

      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Payment failed at bank level' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function validateWebhookSignature(payload: any, signature: string | null): boolean {
  // Implement SBM Bank webhook signature validation
  // This is a placeholder - implement based on SBM Bank documentation
  console.log('Validating webhook signature:', { payload, signature });
  return true; // For now, always return true
}
