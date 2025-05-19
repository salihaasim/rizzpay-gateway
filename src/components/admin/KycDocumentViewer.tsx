
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileIcon, CheckCircle, XCircle } from 'lucide-react';

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const handleApprove = () => {
    if (onStatusChange) {
      onStatusChange('approved');
    }
    setIsOpen(false);
  };

  const handleReject = () => {
    if (onStatusChange) {
      onStatusChange('rejected');
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileIcon className="h-4 w-4 mr-2" />
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
          
          <Tabs defaultValue="aadhaar">
            <TabsList className="w-full">
              <TabsTrigger value="aadhaar" className="flex-1">Aadhaar Card</TabsTrigger>
              <TabsTrigger value="pan" className="flex-1">PAN Card</TabsTrigger>
              {kycData.gstCertificate && (
                <TabsTrigger value="gst" className="flex-1">GST Certificate</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="aadhaar" className="mt-4">
              {kycData.aadhaarCard ? (
                <div className="border rounded-lg overflow-hidden">
                  {kycData.aadhaarCard.startsWith('data:application/pdf') ? (
                    <div className="h-96 flex items-center justify-center bg-secondary/20">
                      <iframe 
                        src={kycData.aadhaarCard} 
                        className="w-full h-full" 
                        title="Aadhaar Card PDF"
                      />
                    </div>
                  ) : (
                    <img 
                      src={kycData.aadhaarCard} 
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
            
            <TabsContent value="pan" className="mt-4">
              {kycData.panCard ? (
                <div className="border rounded-lg overflow-hidden">
                  {kycData.panCard.startsWith('data:application/pdf') ? (
                    <div className="h-96 flex items-center justify-center bg-secondary/20">
                      <iframe 
                        src={kycData.panCard} 
                        className="w-full h-full" 
                        title="PAN Card PDF"
                      />
                    </div>
                  ) : (
                    <img 
                      src={kycData.panCard} 
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
              <TabsContent value="gst" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  {kycData.gstCertificate.startsWith('data:application/pdf') ? (
                    <div className="h-96 flex items-center justify-center bg-secondary/20">
                      <iframe 
                        src={kycData.gstCertificate} 
                        className="w-full h-full" 
                        title="GST Certificate PDF"
                      />
                    </div>
                  ) : (
                    <img 
                      src={kycData.gstCertificate} 
                      alt="GST Certificate" 
                      className="max-w-full h-auto object-contain mx-auto"
                    />
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        {kycStatus === 'pending' && onStatusChange && (
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={handleReject} className="flex items-center">
              <XCircle className="mr-2 h-4 w-4" />
              Reject KYC
            </Button>
            <Button onClick={handleApprove} className="flex items-center">
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
