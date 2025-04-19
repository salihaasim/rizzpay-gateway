
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/api/supabase";
import { toast } from "sonner";
import type { IpWhitelistEntry, WebhookWhitelistEntry, WhitelistFormData, Merchant } from './types';

interface WhitelistFormProps {
  type: 'ip' | 'webhook';
  entry?: IpWhitelistEntry | WebhookWhitelistEntry | null;
  onClose: () => void;
  onSubmit: () => void;
}

export const WhitelistForm = ({ type, entry, onClose, onSubmit }: WhitelistFormProps) => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<WhitelistFormData>({
    merchant_id: entry?.merchant_id || '',
    entry: type === 'ip' ? (entry as IpWhitelistEntry)?.ip_address || '' : 
                          (entry as WebhookWhitelistEntry)?.domain || '',
    status: (entry?.status as 'active' | 'inactive') || 'active'
  });

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('merchants')
        .select('id, name, business_name')
        .order('business_name');

      if (error) throw error;
      setMerchants(data || []);
    } catch (error) {
      toast.error('Failed to load merchants');
      console.error('Error fetching merchants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateInput = () => {
    if (!formData.merchant_id.trim()) {
      toast.error('Please select a merchant');
      return false;
    }

    if (type === 'ip') {
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(formData.entry)) {
        toast.error('Please enter a valid IPv4 address');
        return false;
      }
    } else {
      // Simple domain validation - could be enhanced
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (!urlRegex.test(formData.entry)) {
        toast.error('Please enter a valid domain URL');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;

    try {
      setIsLoading(true);
      const table = type === 'ip' ? 'ip_whitelist' : 'webhook_whitelist';
      const field = type === 'ip' ? 'ip_address' : 'domain';

      const data = {
        merchant_id: formData.merchant_id,
        [field]: formData.entry,
        status: formData.status,
        updated_at: new Date().toISOString()
      };

      // Add created_by field for new entries
      if (!entry) {
        // @ts-ignore - We know auth.getUser() returns user data
        data.created_by = (await supabase.auth.getUser()).data.user?.id;
      }

      if (entry) {
        const { error } = await supabase
          .from(table)
          .update(data)
          .eq('id', entry.id);

        if (error) throw error;
        toast.success(`${type === 'ip' ? 'IP address' : 'Domain'} updated successfully`);
      } else {
        const { error } = await supabase
          .from(table)
          .insert([data]);

        if (error) throw error;
        toast.success(`${type === 'ip' ? 'IP address' : 'Domain'} added to whitelist`);
      }

      onSubmit();
    } catch (error) {
      toast.error('Failed to save changes');
      console.error('Error saving whitelist entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {entry ? 'Edit' : 'Add'} {type === 'ip' ? 'IP Address' : 'Webhook Domain'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Merchant</Label>
            <Select
              value={formData.merchant_id}
              onValueChange={(value) => setFormData({ ...formData, merchant_id: value })}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select merchant" />
              </SelectTrigger>
              <SelectContent>
                {merchants.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No merchants available
                  </div>
                ) : (
                  merchants.map((merchant) => (
                    <SelectItem key={merchant.id} value={merchant.id}>
                      {merchant.business_name || merchant.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{type === 'ip' ? 'IP Address' : 'Domain URL'}</Label>
            <Input
              value={formData.entry}
              onChange={(e) => setFormData({ ...formData, entry: e.target.value })}
              placeholder={type === 'ip' ? 'Enter IPv4 address (e.g. 192.168.1.1)' : 'Enter domain URL (e.g. example.com)'}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'active' | 'inactive') => 
                setFormData({ ...formData, status: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                Processing...
              </>
            ) : entry ? 'Save Changes' : 'Add Entry'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
