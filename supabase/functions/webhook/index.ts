
// Supabase Edge Function for handling webhook payments
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Generate unique transaction ID with RP prefix
const generateRizzPayTransactionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `RP${timestamp}${randomPart}`.toUpperCase();
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Handle both GET and POST requests
    let params
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      params = body
    } else if (req.method === 'GET') {
      const url = new URL(req.url)
      params = Object.fromEntries(url.searchParams)
    } else {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Method not allowed' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405
        }
      )
    }

    // Log the request parameters
    console.log('Webhook request received:', params)

    // Validate required parameters
    if (!params.token) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Missing webhook token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400
        }
      )
    }

    if (!params.amount || isNaN(parseFloat(String(params.amount)))) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Invalid amount' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400
        }
      )
    }

    if (!params.customer_name) {
      return new Response(
        JSON.stringify({ status: 'error', message: 'Customer name is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400
        }
      )
    }

    // Verify the webhook token
    const { data: merchantData, error: merchantError } = await supabase
      .from('merchants')
      .select('id, email, name')
      .eq('api_key', params.token)
      .single()

    if (merchantError || !merchantData) {
      console.error('Token validation error:', merchantError)
      return new Response(
        JSON.stringify({ status: 'error', message: 'Invalid webhook token' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401
        }
      )
    }

    // Generate a unique RizzPay transaction ID
    const transactionId = generateRizzPayTransactionId()
    
    // Create a payment URL
    const baseUrl = Deno.env.get('PUBLIC_URL') || req.headers.get('origin') || 'https://yourdomain.com'
    const paymentUrl = `${baseUrl}/payment?id=${transactionId}`
    
    // Add callback URL if provided
    let callbackUrl = params.callback_url || ''
    if (callbackUrl) {
      const separator = callbackUrl.includes('?') ? '&' : '?'
      callbackUrl = `${callbackUrl}${separator}transaction_id=${transactionId}`
    }
    
    // Create transaction record in Supabase
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        id: transactionId,
        merchant_id: merchantData.id,
        amount: parseFloat(String(params.amount)),
        currency: params.currency || 'INR',
        payment_method: 'webhook',
        status: 'pending',
        customer_name: params.customer_name,
        customer_email: params.customer_email || null,
        description: params.description || 'Payment via webhook',
        payment_details: {
          callbackUrl,
          customerPhone: params.customer_phone || null,
          merchantEmail: merchantData.email,
          merchantName: merchantData.name
        },
        processing_state: 'initiated',
        processing_timeline: [{
          stage: 'initiated',
          timestamp: new Date().toISOString(),
          message: 'Payment request received via webhook'
        }]
      })

    if (transactionError) {
      console.error('Transaction creation error:', transactionError)
      return new Response(
        JSON.stringify({ 
          status: 'error', 
          message: 'Failed to create payment request',
          details: transactionError.message
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500
        }
      )
    }

    // Return successful response with payment URL
    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'Payment initiated successfully',
        paymentUrl,
        transactionId
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
        status: 'error', 
        message: 'An error occurred while processing the request',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500
      }
    )
  }
})
