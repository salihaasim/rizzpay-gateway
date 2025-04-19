
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/api/supabase";
import { toast } from "sonner";
import type { IpWhitelistEntry, WebhookWhitelistEntry, WhitelistFormData } from './types';

interface WhitelistFormProps {
  type: 'ip' | 'webhook';
  entry?: IpWhitelistEntry | WebhookWhitelistEntry | null;
  onClose: () => void;
  onSubmit: () => void;
}

export const WhitelistForm = ({ type, entry, onClose, onSubmit }: WhitelistFormProps) => {
  const [formData, setFormData] = useState<WhitelistFormData>({
    merchant_id: entry?.merchant_id || '',
    entry: type === 'ip' ? (entry as IpWhitelistEntry)?.ip_address || '' : 
                          (entry as WebhookWhitelistEntry)?.domain || '',
    status: (entry?.status as 'active' | 'inactive') || 'active'
  });

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

    const table = type === 'ip' ? 'ip_whitelist' : 'webhook_whitelist';
    const field = type === 'ip' ? 'ip_address' : 'domain';

    try {
      const data = {
        merchant_id: formData.merchant_id,
        [field]: formData.entry,
        status: formData.status
      };

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
            <Label>Merchant ID</Label>
            <Input
              value={formData.merchant_id}
              onChange={(e) => setFormData({ ...formData, merchant_id: e.target.value })}
              placeholder="Enter merchant ID"
            />
          </div>

          <div className="space-y-2">
            <Label>{type === 'ip' ? 'IP Address' : 'Domain URL'}</Label>
            <Input
              value={formData.entry}
              onChange={(e) => setFormData({ ...formData, entry: e.target.value })}
              placeholder={type === 'ip' ? 'Enter IPv4 address' : 'Enter domain URL'}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'active' | 'inactive') => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {entry ? 'Save Changes' : 'Add Entry'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
