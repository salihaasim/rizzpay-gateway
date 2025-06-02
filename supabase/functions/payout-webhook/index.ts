
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-bank-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface PayoutWebhookPayload {
  payout_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  utr_number?: string
  bank_reference_id?: string
  failure_reason?: string
  processing_fee?: number
  bank_charges?: number
  timestamp: string
  bank_response?: any
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      }
    )
  }

  try {
    const payload: PayoutWebhookPayload = await req.json()
    console.log('Payout webhook received:', payload)

    // Validate required fields
    if (!payload.payout_id || !payload.status) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: payout_id or status' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Get current payout request
    const { data: existingPayout, error: fetchError } = await supabase
      .from('payout_requests')
      .select('*')
      .eq('id', payload.payout_id)
      .single()

    if (fetchError || !existingPayout) {
      console.error('Payout not found:', fetchError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Payout request not found: ${payload.payout_id}` 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      )
    }

    // Prepare update data
    const updateData: any = {
      status: payload.status,
      updated_at: new Date().toISOString()
    }

    if (payload.utr_number) updateData.utr_number = payload.utr_number
    if (payload.bank_reference_id) updateData.bank_reference_id = payload.bank_reference_id
    if (payload.failure_reason) updateData.failure_reason = payload.failure_reason

    // Set completion/failure timestamps
    if (payload.status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    } else if (payload.status === 'failed') {
      updateData.failed_at = new Date().toISOString()
    } else if (payload.status === 'processing') {
      updateData.processing_started_at = new Date().toISOString()
    }

    // Update payout request
    const { error: updateError } = await supabase
      .from('payout_requests')
      .update(updateData)
      .eq('id', payload.payout_id)

    if (updateError) {
      console.error('Error updating payout:', updateError)
      throw updateError
    }

    // Log webhook activity
    await supabase
      .from('payout_webhooks')
      .insert({
        payout_request_id: payload.payout_id,
        webhook_type: 'status_update',
        payload: payload,
        response_code: 200,
        delivered: true
      })

    // Create ledger entry if completed
    if (payload.status === 'completed') {
      const currentBalance = await getMerchantBalance(existingPayout.merchant_id)
      
      await supabase
        .from('payout_ledger')
        .insert({
          payout_request_id: existingPayout.id,
          merchant_id: existingPayout.merchant_id,
          transaction_type: 'debit',
          amount: existingPayout.amount,
          balance_before: currentBalance,
          balance_after: currentBalance - existingPayout.amount,
          description: `Payout completed - ${existingPayout.payout_method}`,
          reference_id: payload.utr_number || payload.bank_reference_id
        })
    }

    console.log(`Payout ${payload.payout_id} status updated to ${payload.status}`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payout status updated successfully',
        payout_id: payload.payout_id,
        processed_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

async function getMerchantBalance(merchantId: string): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('get_merchant_wallet_balance', {
      merchant_uuid: merchantId
    })
    
    if (error) throw error
    return data || 0
  } catch (error) {
    console.error('Error getting merchant balance:', error)
    return 0
  }
}
