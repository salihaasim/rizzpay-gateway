
// Supabase Edge Function for handling webhook payment callbacks from external payment processors
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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
    // Parse callback data
    const callbackData = await req.json().catch(() => ({}))
    console.log('Payment callback received:', callbackData)
    
    // Validate essential parameters
    if (!callbackData.transaction_id) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Missing transaction ID' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }
    
    if (!callbackData.status) {
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
      .eq('id', callbackData.transaction_id)
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
    
    // Translate status to internal format
    const paymentStatus = (callbackData.status.toLowerCase() === 'success' || 
                          callbackData.status.toLowerCase() === 'completed' || 
                          callbackData.status.toLowerCase() === 'approved') 
                          ? 'successful' : 'failed'
    
    // Get current timestamp
    const now = new Date().toISOString()
    
    // Prepare payment details update
    const paymentDetails = {
      ...transaction.payment_details,
      paymentProcessor: callbackData.processor || 'external',
      paymentId: callbackData.payment_id || null,
      processorReference: callbackData.reference || null,
      processorResponse: callbackData.processor_response || null,
      processorFee: callbackData.processor_fee || null,
      settlementId: callbackData.settlement_id || null,
      cardData: callbackData.card_data || null
    }
    
    // Prepare processing timeline update
    const processingTimeline = [
      ...(transaction.processing_timeline || []),
      {
        stage: paymentStatus === 'successful' ? 'completed' : 'declined',
        timestamp: now,
        message: paymentStatus === 'successful' 
          ? `Payment confirmed by external processor with ID: ${callbackData.payment_id || 'N/A'}`
          : `Payment declined by external processor: ${callbackData.error || 'Unknown reason'}`
      }
    ]
    
    // Update the transaction
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: paymentStatus,
        processing_state: paymentStatus === 'successful' ? 'completed' : 'declined',
        processing_timeline: processingTimeline,
        payment_details: paymentDetails,
      })
      .eq('id', callbackData.transaction_id)
    
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
              description: `Payment received from ${transaction.customer_name || 'customer'}`,
              metadata: {
                payment_method: transaction.payment_method,
                customer_email: transaction.customer_email
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
                transaction_id: transaction.id
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
        message: 'Payment callback processed successfully',
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
