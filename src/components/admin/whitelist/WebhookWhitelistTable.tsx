
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Edit2, RefreshCw, Globe } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/api/supabase';
import { WhitelistForm } from './WhitelistForm';
import type { WebhookWhitelistEntry, Merchant } from './types';

export const WebhookWhitelistTable = () => {
  const [entries, setEntries] = useState<WebhookWhitelistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<WebhookWhitelistEntry | null>(null);
  const [merchants, setMerchants] = useState<Record<string, Merchant>>({});
  const [showForm, setShowForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<WebhookWhitelistEntry | null>(null);

  // Fetch webhook whitelist entries and merchants
  useEffect(() => {
    fetchWebhookWhitelistEntries();
    fetchMerchants();
  }, []);

  const fetchWebhookWhitelistEntries = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('webhook_whitelist')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      toast.error('Failed to load webhook whitelist entries');
      console.error('Error fetching webhook whitelist entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMerchants = async () => {
    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('id, name, business_name');

      if (error) throw error;

      const merchantsMap: Record<string, Merchant> = {};
      (data || []).forEach((merchant: Merchant) => {
        merchantsMap[merchant.id] = merchant;
      });

      setMerchants(merchantsMap);
    } catch (error) {
      console.error('Error fetching merchants:', error);
    }
  };

  const handleAdd = () => {
    setSelectedEntry(null);
    setShowForm(true);
  };

  const handleEdit = (entry: WebhookWhitelistEntry) => {
    setSelectedEntry(entry);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedEntry(null);
  };

  const handleFormSubmit = async () => {
    handleCloseForm();
    await fetchWebhookWhitelistEntries();
  };

  const handleDelete = (entry: WebhookWhitelistEntry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;

    try {
      const { error } = await supabase
        .from('webhook_whitelist')
        .delete()
        .eq('id', entryToDelete.id);

      if (error) throw error;
      
      toast.success('Domain removed from webhook whitelist');
      fetchWebhookWhitelistEntries();
    } catch (error) {
      toast.error('Failed to delete entry');
      console.error('Error deleting webhook whitelist entry:', error);
    } finally {
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  const getMerchantName = (merchantId: string) => {
    const merchant = merchants[merchantId];
    if (!merchant) return 'Unknown merchant';
    return merchant.business_name || merchant.name || 'Unnamed merchant';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Webhook Domains</h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={fetchWebhookWhitelistEntries}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            size="sm"
            onClick={handleAdd}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Domain
          </Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Domain</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Loading entries...
                </TableCell>
              </TableRow>
            ) : entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No domains in webhook whitelist
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    {entry.domain}
                  </TableCell>
                  <TableCell>{getMerchantName(entry.merchant_id)}</TableCell>
                  <TableCell>
                    <Badge variant={entry.status === 'active' ? 'outline' : 'secondary'}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(entry)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form dialog - Fixed missing 'open' prop */}
      {showForm && (
        <WhitelistForm
          type="webhook"
          entry={selectedEntry}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          open={showForm}
        />
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Removal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this domain from the webhook whitelist?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
