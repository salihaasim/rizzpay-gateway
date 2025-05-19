
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/lib/api/supabase';
import type { IpWhitelistEntry, WebhookWhitelistEntry, Merchant } from './types';

interface WhitelistFormProps {
  type: 'ip' | 'webhook';
  entry: IpWhitelistEntry | WebhookWhitelistEntry | null;
  onClose: () => void;
  onSubmit: () => void;
  open: boolean;
}

export const WhitelistForm: React.FC<WhitelistFormProps> = ({ 
  type, 
  entry, 
  onClose, 
  onSubmit,
  open
}) => {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('active');
  const [merchantId, setMerchantId] = useState('');
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch merchants on component mount
  useEffect(() => {
    fetchMerchants();
    
    // Pre-populate form fields if editing an existing entry
    if (entry) {
      if (type === 'ip' && 'ip_address' in entry) {
        setValue(entry.ip_address);
      } else if (type === 'webhook' && 'domain' in entry) {
        setValue(entry.domain);
      }
      
      setStatus(entry.status);
      setMerchantId(entry.merchant_id);
    }
  }, [entry, type]);
  
  const fetchMerchants = async () => {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('id, name, business_name')
        .order('name');
      
      if (error) throw error;
      setMerchants(data || []);
      
      // If no merchant is selected and we have merchants, select the first one
      if (!merchantId && data && data.length > 0) {
        setMerchantId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching merchants:', error);
    }
  };
  
  const validateIpAddress = (ip: string): boolean => {
    // Basic IPv4 validation (could be enhanced for IPv6 support)
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(ip)) return false;
    
    const octets = ip.split('.').map(Number);
    return octets.every(octet => octet >= 0 && octet <= 255);
  };
  
  const validateDomain = (domain: string): boolean => {
    // Simple domain validation
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!value) {
      toast.error(`Please enter a ${type === 'ip' ? 'valid IP address' : 'domain'}`);
      return;
    }
    
    if (type === 'ip' && !validateIpAddress(value)) {
      toast.error('Please enter a valid IP address (e.g., 192.168.1.1)');
      return;
    }
    
    if (type === 'webhook' && !validateDomain(value)) {
      toast.error('Please enter a valid domain (e.g., example.com)');
      return;
    }
    
    if (!merchantId) {
      toast.error('Please select a merchant');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const table = type === 'ip' ? 'ip_whitelist' : 'webhook_whitelist';
      const valueField = type === 'ip' ? 'ip_address' : 'domain';
      
      if (entry) {
        // Update existing entry
        const { error } = await supabase
          .from(table)
          .update({
            [valueField]: value,
            status,
            merchant_id: merchantId,
            updated_at: new Date().toISOString()
          })
          .eq('id', entry.id);
        
        if (error) throw error;
        toast.success(`${type === 'ip' ? 'IP address' : 'Domain'} updated successfully`);
      } else {
        // Create new entry
        const { error } = await supabase
          .from(table)
          .insert({
            [valueField]: value,
            status,
            merchant_id: merchantId,
            created_by: await supabase.auth.getUser().then(response => response.data.user?.id)
          });
        
        if (error) throw error;
        toast.success(`${type === 'ip' ? 'IP address' : 'Domain'} added to whitelist`);
      }
      
      // Call onSubmit to refresh the table
      onSubmit();
      onClose();
    } catch (error) {
      console.error(`Error ${entry ? 'updating' : 'creating'} whitelist entry:`, error);
      toast.error(`Failed to ${entry ? 'update' : 'add'} ${type === 'ip' ? 'IP address' : 'domain'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {entry ? 'Edit' : 'Add'} {type === 'ip' ? 'IP Address' : 'Webhook Domain'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value">
              {type === 'ip' ? 'IP Address' : 'Domain Name'}
            </Label>
            <Input
              id="value"
              placeholder={type === 'ip' ? '192.168.1.1' : 'example.com'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="merchant">Merchant</Label>
            <Select value={merchantId} onValueChange={setMerchantId}>
              <SelectTrigger id="merchant">
                <SelectValue placeholder="Select a merchant" />
              </SelectTrigger>
              <SelectContent>
                {merchants.map((merchant) => (
                  <SelectItem key={merchant.id} value={merchant.id}>
                    {merchant.business_name || merchant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : entry ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
