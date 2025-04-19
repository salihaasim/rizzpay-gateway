
import type { Database } from "@/integrations/supabase/types";

export type Merchant = {
  id: string;
  name: string;
  business_name: string;
};

export interface IpWhitelistEntry {
  id: string;
  merchant_id: string;
  ip_address: string;
  status: 'active' | 'inactive';
  created_at: string;
  created_by: string;
  updated_at: string;
  merchant?: {
    business_name: string;
  };
}

export interface WebhookWhitelistEntry {
  id: string;
  merchant_id: string;
  domain: string;
  status: 'active' | 'inactive';
  created_at: string;
  created_by: string;
  updated_at: string;
  merchant?: {
    business_name: string;
  };
}

export interface WhitelistFormData {
  merchant_id: string;
  entry: string;
  status: 'active' | 'inactive';
}
