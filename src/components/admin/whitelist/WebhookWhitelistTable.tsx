
import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Plus, Edit, Trash } from "lucide-react";
import { supabase } from "@/lib/api/supabase";
import { toast } from "sonner";
import type { WebhookWhitelistEntry } from './types';
import { WhitelistForm } from './WhitelistForm';

export const WebhookWhitelistTable = () => {
  const [entries, setEntries] = useState<WebhookWhitelistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<WebhookWhitelistEntry | null>(null);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_whitelist')
        .select(`
          *,
          merchant:merchants(business_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      toast.error('Failed to load webhook domain entries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleAddEdit = (entry?: WebhookWhitelistEntry) => {
    setSelectedEntry(entry || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('webhook_whitelist')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Domain removed from whitelist');
      fetchEntries();
    } catch (error) {
      toast.error('Failed to remove domain');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Webhook Domain Management</h3>
        <Button onClick={() => handleAddEdit()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Domain
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Added On</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.domain}</TableCell>
              <TableCell>{entry.merchant?.business_name || 'Unknown'}</TableCell>
              <TableCell>
                <Badge variant={entry.status === 'active' ? 'default' : 'secondary'}>
                  {entry.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(entry.created_at), 'yyyy-MM-dd HH:mm')}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAddEdit(entry)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showForm && (
        <WhitelistForm
          type="webhook"
          entry={selectedEntry}
          onClose={() => {
            setShowForm(false);
            setSelectedEntry(null);
          }}
          onSubmit={() => {
            setShowForm(false);
            setSelectedEntry(null);
            fetchEntries();
          }}
        />
      )}
    </div>
  );
};
