
-- SQL function to get or create API key
CREATE OR REPLACE FUNCTION public.get_or_create_api_key(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_api_key TEXT;
  new_api_key TEXT;
BEGIN
  -- Check if API key already exists for this user
  SELECT api_key INTO existing_api_key 
  FROM merchant_profiles 
  WHERE id = user_id;
  
  -- Return existing API key if found
  IF existing_api_key IS NOT NULL THEN
    RETURN existing_api_key;
  END IF;
  
  -- Generate new API key with 'rizz_' prefix
  new_api_key := 'rizz_' || replace(gen_random_uuid()::text, '-', '');
  
  -- Update the merchant profile with new API key
  UPDATE merchant_profiles 
  SET api_key = new_api_key
  WHERE id = user_id;
  
  -- Return the new API key
  RETURN new_api_key;
END;
$$;
