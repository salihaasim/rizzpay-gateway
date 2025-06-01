
// Supabase Edge Function for handling webhook payment callbacks from external payment processors
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hdfc-signature, x-sbm-signature, x-icici-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Bank-specific configurations
const BANK_CONFIGS = {
  'hdfc-bank': {
    bankName: 'HDFC Bank',
    signatureHeader: 'x-hdfc-signature',
    statusMapping: {
      'SUCCESS': 'successful',
      'FAILED': 'failed',
      'PENDING': 'pending'
    }
  },
  'sbm-bank': {
    bankName: 'SBM Bank',
    signatureHeader: 'x-sbm-signature',
    statusMapping: {
      'COMPLETED': 'successful',
      'DECLINED': 'failed',
      'PROCESSING': 'pending'
    }
  },
  'icici-bank': {
    bankName: 'ICICI Bank',
    signatureHeader: 'x-icici-signature',
    statusMapping: {
      'APPROVED': 'successful',
      'REJECTED': 'failed',
      'INITIATED': 'pending'
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ status: 'error', message: 'Method not allowed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      }
    )
  }

  try {
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const bankSlug = pathParts[pathParts.length - 2] // Get bank slug from URL path
    
    // Parse callback data
    const callbackData = await req.json().catch(() => ({}))
    console.log(`${bankSlug} webhook received:`, callbackData)
    
    // Get bank configuration
    const bankConfig = BANK_CONFIGS[bankSlug]
    if (!bankConfig) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Unsupported bank' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Extract headers for signature validation
    const headers = {}
    req.headers.forEach((value, key) => {
      headers[key] = value
    })
    
    // Validate essential parameters
    const transactionId = callbackData.transaction_id || callbackData.txnId || callbackData.orderId
    if (!transactionId) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Missing transaction ID' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }
    
    const rawStatus = callbackData.status || callbackData.txnStatus
    if (!rawStatus) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Missing payment status' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }
    
    // Get the transaction from the database
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()
    
    if (fetchError || !transaction) {
      console.error('Transaction fetch error:', fetchError)
      return new Response(
        JSON.stringify({ status: 'error', message: 'Transaction not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404
        }
      )
    }
    
    // Map bank status to internal status
    const paymentStatus = bankConfig.statusMapping[rawStatus] || 'pending'
    
    // Get current timestamp
    const now = new Date().toISOString()
    
    // Prepare payment details update
    const paymentDetails = {
      ...transaction.payment_details,
      bankName: bankConfig.bankName,
      paymentId: callbackData.payment_id || callbackData.bankRefNo,
      processorReference: callbackData.reference || callbackData.rrn,
      processorResponse: callbackData,
      processorFee: callbackData.fee || null,
      settlementId: callbackData.settlement_id || null,
      webhookReceived: true,
      webhookTimestamp: now
    }
    
    // Prepare processing timeline update
    const processingTimeline = [
      ...(transaction.processing_timeline || []),
      {
        stage: paymentStatus === 'successful' ? 'completed' : 
               paymentStatus === 'failed' ? 'declined' : 'processing',
        timestamp: now,
        message: `${bankConfig.bankName} webhook: ${rawStatus}`,
        details: {
          bankResponse: callbackData,
          paymentId: callbackData.payment_id || callbackData.bankRefNo
        }
      }
    ]
    
    // Update the transaction
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: paymentStatus,
        processing_state: paymentStatus === 'successful' ? 'completed' : 
                         paymentStatus === 'failed' ? 'declined' : 'processing',
        processing_timeline: processingTimeline,
        payment_details: paymentDetails,
      })
      .eq('id', transactionId)
    
    if (updateError) {
      console.error('Transaction update error:', updateError)
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Failed to update transaction',
          details: updateError.message
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }
    
    // If payment was successful, add to merchant's wallet
    if (paymentStatus === 'successful') {
      try {
        // Get merchant details
        const { data: merchant } = await supabase
          .from('merchant_profiles')
          .select('id, contact_email')
          .eq('id', transaction.merchant_id)
          .single()
        
        if (merchant && merchant.contact_email) {
          console.log(`Adding ${transaction.amount} to merchant ${merchant.contact_email}'s wallet`)
          
          // Create wallet transaction entry
          await supabase
            .from('wallet_transactions')
            .insert({
              user_id: merchant.id,
              amount: transaction.amount,
              currency: transaction.currency || 'INR',
              transaction_type: 'credit',
              source: 'payment',
              reference_id: transaction.id,
              status: 'completed',
              description: `Payment received from ${transaction.customer_name || 'customer'} via ${bankConfig.bankName}`,
              metadata: {
                payment_method: transaction.payment_method,
                customer_email: transaction.customer_email,
                bank_name: bankConfig.bankName
              }
            })
            .catch(err => {
              console.error('Error creating wallet transaction:', err);
            });
            
          // Log this activity
          await supabase
            .from('activity_logs')
            .insert({
              user_id: merchant.id,
              user_email: merchant.contact_email,
              activity_type: 'payment_received',
              details: {
                amount: transaction.amount,
                currency: transaction.currency || 'INR',
                payment_method: transaction.payment_method,
                transaction_id: transaction.id,
                bank_name: bankConfig.bankName
              }
            })
            .catch(e => console.error('Failed to log activity:', e));
        }
      } catch (walletError) {
        console.error('Error processing wallet update:', walletError)
        // We don't fail the whole transaction if wallet processing fails
      }
    }
    
    // Return successful response
    return new Response(
      JSON.stringify({
        status: 'success',
        message: `${bankConfig.bankName} webhook processed successfully`,
        transaction_id: transaction.id,
        payment_status: paymentStatus
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
    
  } catch (error) {
    console.error('Callback processing error:', error)
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'An error occurred while processing the callback',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
