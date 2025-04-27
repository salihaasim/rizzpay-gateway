
import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { getOrCreateApiKey } from "../utils/merchant-api-key.ts";
import { corsHeaders } from "../utils/cors.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Extract the user from the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Generate or retrieve API key
    const apiKey = await getOrCreateApiKey(user.id);

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Failed to generate API key' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Return the API key
    return new Response(
      JSON.stringify(apiKey),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error in API key function:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});

// Helper for Supabase client
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
