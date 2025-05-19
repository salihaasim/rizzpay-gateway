import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

export const generateApiKey = async (userId: string): Promise<string | null> => {
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Generate a uuid for API key
    const apiKey = `rizz_${uuidv4().replace(/-/g, '')}`;
    
    // Update the merchant_profiles table with the API key
    const { error } = await supabase
      .from('merchant_profiles')
      .update({ api_key: apiKey })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating API key:', error);
      return null;
    }
    
    return apiKey;
  } catch (err) {
    console.error('Error in generateApiKey:', err);
    return null;
  }
};

export const getOrCreateApiKey = async (userId: string): Promise<string | null> => {
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if user already has an API key
    const { data, error } = await supabase
      .from('merchant_profiles')
      .select('api_key')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching API key:', error);
      return null;
    }
    
    // If API key exists, return it
    if (data && data.api_key) {
      return data.api_key;
    }
    
    // Otherwise generate a new one
    return await generateApiKey(userId);
  } catch (err) {
    console.error('Error in getOrCreateApiKey:', err);
    return null;
  }
};
