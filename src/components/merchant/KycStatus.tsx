
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { FileCheck, Clock, X, Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

interface KycStatusData {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string | null;
  updated_at: string | null;
  aadhaar_document_path: string | null;
  pan_document_path: string | null;
  gst_document_path: string | null;
  gst_number: string | null;
  notes: string | null;
}

const KycStatus: React.FC = () => {
  const { currentMerchant } = useMerchantAuth();
  const navigate = useNavigate();
  const [kycData, setKycData] = useState<KycStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKycStatus = async () => {
      if (!currentMerchant?.id) return;

      try {
        const { data, error } = await supabase
          .from('kyc_submissions')
          .select('*')
          .eq('user_id', currentMerchant.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setKycData({
            ...data,
            status: data.status as 'pending' | 'approved' | 'rejected'
          });
        }
      } catch (error) {
        console.error('Error fetching KYC status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKycStatus();
  }, [currentMerchant?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FileCheck className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Upload className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Your KYC verification has been approved. You can now use all payment features.';
      case 'pending':
        return 'Your KYC documents are under review. We will notify you once the verification is complete.';
      case 'rejected':
        return 'Your KYC verification was rejected. Please check the notes below and resubmit your documents.';
      default:
        return 'Please submit your KYC documents to start accepting payments.';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading KYC status...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(kycData?.status || 'not_submitted')}
          KYC Verification Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Status</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusBadgeVariant(kycData?.status || 'not_submitted')}>
                {kycData?.status ? 
                  kycData.status.charAt(0).toUpperCase() + kycData.status.slice(1) : 
                  'Not Submitted'
                }
              </Badge>
              {kycData?.updated_at && (
                <span className="text-xs text-muted-foreground">
                  Updated {new Date(kycData.updated_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          {(!kycData || kycData.status === 'rejected') && (
            <Button onClick={() => navigate('/kyc')}>
              {kycData?.status === 'rejected' ? 'Resubmit Documents' : 'Submit KYC'}
            </Button>
          )}
        </div>

        <Alert className={
          kycData?.status === 'approved' ? 'bg-green-50 border-green-200' :
          kycData?.status === 'rejected' ? 'bg-red-50 border-red-200' :
          'bg-blue-50 border-blue-200'
        }>
          <AlertDescription>
            {getStatusMessage(kycData?.status || 'not_submitted')}
          </AlertDescription>
        </Alert>

        {kycData?.notes && kycData.status === 'rejected' && (
          <Alert variant="destructive">
            <AlertDescription>
              <strong>Admin Notes:</strong> {kycData.notes}
            </AlertDescription>
          </Alert>
        )}

        {kycData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-sm font-medium">Documents Submitted</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  {kycData.aadhaar_document_path ? 
                    <FileCheck className="h-4 w-4 text-green-600" /> : 
                    <X className="h-4 w-4 text-red-600" />
                  }
                  <span>Aadhaar Card</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {kycData.pan_document_path ? 
                    <FileCheck className="h-4 w-4 text-green-600" /> : 
                    <X className="h-4 w-4 text-red-600" />
                  }
                  <span>PAN Card</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {kycData.gst_document_path ? 
                    <FileCheck className="h-4 w-4 text-green-600" /> : 
                    <X className="h-4 w-4 text-gray-400" />
                  }
                  <span>GST Certificate {!kycData.gst_document_path && '(Optional)'}</span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium">Submission Details</p>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                {kycData.submitted_at && (
                  <p>Submitted: {new Date(kycData.submitted_at).toLocaleDateString()}</p>
                )}
                {kycData.gst_number && (
                  <p>GST Number: {kycData.gst_number}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KycStatus;
