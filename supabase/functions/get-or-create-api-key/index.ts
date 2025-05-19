
import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Processing API key request for user ID: ${user.id}`);

    // First check if the user has a merchant profile
    const { data: profileData, error: profileError } = await supabase
      .from('merchant_profiles')
      .select('api_key, is_active, verification_status')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error checking merchant profile:', profileError);
      
      if (profileError.code === 'PGRST116') { // Record not found code
        console.log('No merchant profile found, creating one...');
        
        // Get user email from auth user
        const userEmail = user.email || '';
        
        // Create a merchant profile with an API key
        const newApiKey = `rizz_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`;
        
        const { error: insertError } = await supabase
          .from('merchant_profiles')
          .insert({
            id: user.id,
            api_key: newApiKey,
            business_name: 'Default Business',
            business_type: 'Default',
            contact_email: userEmail,
            contact_phone: '',
            business_address: '',
            pan_number: 'DEFAULT',
            is_active: true,
            verification_status: 'pending'
          });
          
        if (insertError) {
          console.error('Error creating merchant profile:', insertError);
          return new Response(
            JSON.stringify({ error: 'Failed to create merchant profile', details: insertError.message }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
        
        // Also create entry in merchants table for backward compatibility
        const { error: merchantInsertError } = await supabase
          .from('merchants')
          .insert({
            id: user.id,
            name: userEmail.split('@')[0],
            email: userEmail,
            business_name: 'Default Business',
            business_type: 'Default',
            api_key: newApiKey,
            status: 'active'
          });
          
        if (merchantInsertError) {
          console.error('Error creating merchant entry:', merchantInsertError);
          // We don't fail here as the main profile is already created
        }
        
        // Log the activity
        await supabase
          .from('activity_logs')
          .insert({
            user_id: user.id,
            user_email: userEmail,
            activity_type: 'api_key_generated',
            details: { method: 'automatic', reason: 'new_merchant_profile' }
          })
          .catch(e => console.error('Failed to log activity:', e));
        
        return new Response(
          JSON.stringify(newApiKey),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to check merchant profile', details: profileError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Check if account is active
    if (profileData && !profileData.is_active) {
      return new Response(
        JSON.stringify({ error: 'Merchant account is inactive', code: 'INACTIVE_ACCOUNT' }),
        { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // If the profile exists but has no API key, generate one
    if (!profileData.api_key) {
      console.log('Merchant profile found but no API key, generating one...');
      const newApiKey = `rizz_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`;
      
      const { error: updateError } = await supabase
        .from('merchant_profiles')
        .update({ 
          api_key: newApiKey,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (updateError) {
        console.error('Error updating API key:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to generate API key', details: updateError.message }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      
      // Update merchants table for backward compatibility
      await supabase
        .from('merchants')
        .update({ api_key: newApiKey })
        .eq('id', user.id)
        .catch(e => console.error('Failed to update merchants table:', e));
      
      // Log the activity
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          user_email: user.email,
          activity_type: 'api_key_generated',
          details: { method: 'automatic', reason: 'missing_key' }
        })
        .catch(e => console.error('Failed to log activity:', e));
      
      return new Response(
        JSON.stringify(newApiKey),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Return the existing API key
    console.log('Returning existing API key');
    return new Response(
      JSON.stringify(profileData.api_key),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('Error in API key function:', error);
    return new Response(
      JSON.stringify({ error: 'Server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
