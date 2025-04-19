
export interface IpWhitelistEntry {
  id: string;
  merchant_id: string;
  ip_address: string;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
}

export interface WebhookWhitelistEntry {
  id: string;
  merchant_id: string;
  domain: string;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
}

export interface WhitelistFormData {
  merchant_id: string;
  entry: string;
  status: 'active' | 'inactive';
}
