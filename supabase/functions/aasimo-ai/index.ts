
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, userRole } = await req.json()

    // Construct system message based on user role
    const systemMessage = {
      role: 'system',
      content: `You are Aasimo AI, RizzPay's expert assistant. You have access to RizzPay's documentation and can help with: payment processing (up to 1,000 TPS), merchant onboarding, escrow services, UPI payments, bank transfers, compliance, and monitoring. Format responses clearly with Markdown.

Key capabilities you can discuss:
- Payment processing capacity and limits
- Merchant onboarding procedures
- Security measures and compliance
- System monitoring and reliability
- Technical integration guides
- Platform features and updates

Keep responses focused and relevant to RizzPay's payment gateway services.`
    }

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        stream: false,
      }),
    })

    if (!openAiResponse.ok) {
      const error = await openAiResponse.json()
      throw new Error(error.error?.message || 'Failed to get response from OpenAI')
    }

    const data = await openAiResponse.json()
    const aiResponse = data.choices[0].message.content

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in aasimo-ai function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
