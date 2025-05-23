
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, Search, Filter } from 'lucide-react';
import KycDocumentViewer from '@/components/admin/KycDocumentViewer';

interface KycSubmission {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  gst_number: string | null;
  aadhaar_document_path: string | null;
  pan_document_path: string | null;
  gst_document_path: string | null;
  submitted_at: string | null;
  updated_at: string | null;
  merchant_email?: string;
  merchant_name?: string;
}

const AdminKycTable: React.FC = () => {
  const [submissions, setSubmissions] = useState<KycSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<KycSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchKycSubmissions = async () => {
    try {
      setLoading(true);
      
      // First, get all KYC submissions
      const { data: kycData, error: kycError } = await supabase
        .from('kyc_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (kycError) throw kycError;

      // Then get merchant profile data for each submission
      const formattedData: KycSubmission[] = [];
      
      for (const submission of kycData || []) {
        // Try to get merchant profile data using user_id
        const { data: merchantData } = await supabase
          .from('merchant_profiles')
          .select('business_name, contact_email')
          .eq('id', submission.user_id)
          .maybeSingle();

        formattedData.push({
          ...submission,
          status: submission.status as 'pending' | 'approved' | 'rejected',
          merchant_email: merchantData?.contact_email || 'Unknown',
          merchant_name: merchantData?.business_name || 'Unknown'
        });
      }

      setSubmissions(formattedData);
      setFilteredSubmissions(formattedData);
    } catch (error: any) {
      console.error('Error fetching KYC submissions:', error);
      toast.error('Failed to fetch KYC submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycSubmissions();
  }, []);

  useEffect(() => {
    let filtered = submissions;

    if (searchTerm) {
      filtered = filtered.filter(
        submission =>
          submission.merchant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.merchant_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === statusFilter);
    }

    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, statusFilter]);

  const handleStatusChange = async (submissionId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('kyc_submissions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId);

      if (error) throw error;

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, status: newStatus, updated_at: new Date().toISOString() }
            : sub
        )
      );

      toast.success(`KYC ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
    } catch (error: any) {
      console.error('Error updating KYC status:', error);
      toast.error('Failed to update KYC status');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading KYC submissions...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by merchant name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Merchant</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">GST Number</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Submitted</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No KYC submissions found
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-t hover:bg-muted/25">
                    <td className="p-4 font-medium">{submission.merchant_name}</td>
                    <td className="p-4 text-muted-foreground">{submission.merchant_email}</td>
                    <td className="p-4">{submission.gst_number || 'N/A'}</td>
                    <td className="p-4">
                      <Badge variant={getStatusBadgeVariant(submission.status)}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {submission.submitted_at 
                        ? new Date(submission.submitted_at).toLocaleDateString()
                        : 'N/A'
                      }
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <KycDocumentViewer
                          merchantId={submission.user_id}
                          merchantName={submission.merchant_name || 'Unknown'}
                          kycData={{
                            aadhaarCard: submission.aadhaar_document_path,
                            panCard: submission.pan_document_path,
                            gstCertificate: submission.gst_document_path,
                            gstNumber: submission.gst_number
                          }}
                          kycStatus={submission.status}
                          onStatusChange={(status) => handleStatusChange(submission.id, status)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminKycTable;
