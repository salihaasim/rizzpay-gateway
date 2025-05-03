
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileUp, CheckCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface KycDocumentViewerProps {
  merchantId: string;
  merchantName: string;
  kycData: {
    aadhaarCard: string | null;
    panCard: string | null;
    gstCertificate: string | null;
    gstNumber: string | null;
  };
  kycStatus: 'pending' | 'approved' | 'rejected';
  onStatusChange?: (status: 'approved' | 'rejected') => void;
}

const KycDocumentViewer: React.FC<KycDocumentViewerProps> = ({
  merchantId,
  merchantName,
  kycData,
  kycStatus,
  onStatusChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const handleDialogOpen = async () => {
    // Load document URLs when dialog opens
    if (merchantId && isOpen) {
      try {
        const urls: Record<string, string> = {};
        
        for (const [key, path] of Object.entries(kycData)) {
          if (!path) continue;
          
          // Skip non-document fields
          if (key === 'gstNumber') continue;
          
          const { data, error } = await supabase.storage
            .from('kyc_documents')
            .createSignedUrl(path, 300); // 5 minutes expiry
            
          if (error) throw error;
          
          if (data?.signedUrl) {
            urls[key] = data.signedUrl;
          }
        }
        
        setDocumentUrls(urls);
      } catch (error) {
        console.error('Error loading document URLs:', error);
        toast.error('Failed to load document URLs');
      }
    }
  };

  const handleApprove = async () => {
    if (!merchantId || !onStatusChange) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('kyc_submissions')
        .update({ 
          status: 'approved',
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', merchantId);
        
      if (error) throw error;
      
      toast.success('KYC submission approved successfully');
      onStatusChange('approved');
    } catch (error: any) {
      console.error('Error approving KYC:', error);
      toast.error(error.message || 'Failed to approve KYC submission');
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handleReject = async () => {
    if (!merchantId || !onStatusChange) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('kyc_submissions')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString() 
        })
        .eq('user_id', merchantId);
        
      if (error) throw error;
      
      toast.success('KYC submission rejected');
      onStatusChange('rejected');
    } catch (error: any) {
      console.error('Error rejecting KYC:', error);
      toast.error(error.message || 'Failed to reject KYC submission');
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileUp className="h-4 w-4 mr-2" />
          View KYC Docs
          <Badge className="ml-2" variant={getStatusBadgeVariant(kycStatus)}>
            {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>KYC Documents: {merchantName}</DialogTitle>
          <DialogDescription>
            Review merchant KYC documents and approve or reject verification
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Merchant ID: {merchantId}</p>
              {kycData.gstNumber && (
                <p className="text-sm text-muted-foreground mt-1">GST Number: {kycData.gstNumber}</p>
              )}
            </div>
            <Badge variant={getStatusBadgeVariant(kycStatus)} className="text-sm">
              Status: {kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}
            </Badge>
          </div>
          
          <Tabs defaultValue="aadhaarCard">
            <TabsList className="w-full">
              <TabsTrigger value="aadhaarCard" className="flex-1">Aadhaar Card</TabsTrigger>
              <TabsTrigger value="panCard" className="flex-1">PAN Card</TabsTrigger>
              {kycData.gstCertificate && (
                <TabsTrigger value="gstCertificate" className="flex-1">GST Certificate</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="aadhaarCard" className="mt-4">
              {documentUrls.aadhaarCard ? (
                <div className="border rounded-lg overflow-hidden">
                  {documentUrls.aadhaarCard.endsWith('.pdf') ? (
                    <div className="h-96 flex items-center justify-center bg-secondary/20">
                      <iframe 
                        src={documentUrls.aadhaarCard} 
                        className="w-full h-full" 
                        title="Aadhaar Card PDF"
                      />
                    </div>
                  ) : (
                    <img 
                      src={documentUrls.aadhaarCard} 
                      alt="Aadhaar Card" 
                      className="max-w-full h-auto object-contain mx-auto"
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-secondary/20 rounded-lg">
                  <p className="text-muted-foreground">No Aadhaar Card document uploaded</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="panCard" className="mt-4">
              {documentUrls.panCard ? (
                <div className="border rounded-lg overflow-hidden">
                  {documentUrls.panCard.endsWith('.pdf') ? (
                    <div className="h-96 flex items-center justify-center bg-secondary/20">
                      <iframe 
                        src={documentUrls.panCard} 
                        className="w-full h-full" 
                        title="PAN Card PDF"
                      />
                    </div>
                  ) : (
                    <img 
                      src={documentUrls.panCard} 
                      alt="PAN Card" 
                      className="max-w-full h-auto object-contain mx-auto"
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-secondary/20 rounded-lg">
                  <p className="text-muted-foreground">No PAN Card document uploaded</p>
                </div>
              )}
            </TabsContent>
            
            {kycData.gstCertificate && (
              <TabsContent value="gstCertificate" className="mt-4">
                {documentUrls.gstCertificate ? (
                  <div className="border rounded-lg overflow-hidden">
                    {documentUrls.gstCertificate.endsWith('.pdf') ? (
                      <div className="h-96 flex items-center justify-center bg-secondary/20">
                        <iframe 
                          src={documentUrls.gstCertificate} 
                          className="w-full h-full" 
                          title="GST Certificate PDF"
                        />
                      </div>
                    ) : (
                      <img 
                        src={documentUrls.gstCertificate} 
                        alt="GST Certificate" 
                        className="max-w-full h-auto object-contain mx-auto"
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-secondary/20 rounded-lg">
                    <p className="text-muted-foreground">No GST Certificate document uploaded</p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        {kycStatus === 'pending' && onStatusChange && (
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={handleReject} 
              className="flex items-center"
              disabled={isLoading}
            >
              <X className="mr-2 h-4 w-4" />
              Reject KYC
            </Button>
            <Button 
              onClick={handleApprove} 
              className="flex items-center"
              disabled={isLoading}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve KYC
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default KycDocumentViewer;
