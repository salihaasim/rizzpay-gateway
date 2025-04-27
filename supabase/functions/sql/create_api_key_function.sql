
-- SQL function to get or create API key with improved validation and security
CREATE OR REPLACE FUNCTION public.get_or_create_api_key(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_api_key TEXT;
  new_api_key TEXT;
  profile_exists BOOLEAN;
  merchant_status TEXT;
BEGIN
  -- Check if merchant profile exists
  SELECT EXISTS(
    SELECT 1 FROM merchant_profiles WHERE id = user_id
  ) INTO profile_exists;
  
  -- If profile doesn't exist, return null (edge function will handle creation)
  IF NOT profile_exists THEN
    RETURN NULL;
  END IF;

  -- Check if merchant is active
  SELECT is_active INTO merchant_status 
  FROM merchant_profiles 
  WHERE id = user_id;
  
  IF NOT merchant_status THEN
    RETURN 'INACTIVE_ACCOUNT';
  END IF;

  -- Check if API key already exists for this user
  SELECT api_key INTO existing_api_key 
  FROM merchant_profiles 
  WHERE id = user_id;
  
  -- Return existing API key if found
  IF existing_api_key IS NOT NULL THEN
    RETURN existing_api_key;
  END IF;
  
  -- Generate new API key with 'rizz_' prefix and improved randomness
  new_api_key := 'rizz_' || replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
  
  -- Update the merchant profile with new API key
  UPDATE merchant_profiles 
  SET api_key = new_api_key,
      updated_at = now()
  WHERE id = user_id;
  
  -- Return the new API key
  RETURN new_api_key;
END;
$$;
