
export interface IpWhitelistEntry {
  id: string;
  merchant_id: string;
  ip_address: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface WebhookWhitelistEntry {
  id: string;
  merchant_id: string;
  domain: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface WhitelistFormData {
  merchant_id: string;
  entry: string;
  status: 'active' | 'inactive';
}

export interface Merchant {
  id: string;
  name: string;
  business_name: string;
}
