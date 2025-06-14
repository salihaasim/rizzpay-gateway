
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  QrCode, 
  Copy, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download
} from 'lucide-react';
import { VpaManagementService } from '@/services/VpaManagementService';
import { toast } from 'sonner';

interface VpaManagementProps {
  merchantId: string;
  businessName: string;
  merchantEmail: string;
}

const VpaManagement = ({ merchantId, businessName, merchantEmail }: VpaManagementProps) => {
  const [vpaData, setVpaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadVpaData();
  }, [merchantId]);

  const loadVpaData = async () => {
    try {
      const data = await VpaManagementService.getMerchantVpa(merchantId);
      setVpaData(data);
    } catch (error) {
      console.error('Failed to load VPA data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateVpa = async () => {
    setGenerating(true);
    try {
      const result = await VpaManagementService.generateMerchantVpa({
        merchantId,
        businessName,
        merchantEmail
      });
      
      setVpaData({
        merchant_vpa: result.vpaAddress,
        vpa_status: result.status,
        qr_code_url: result.qrCodeUrl
      });
      
      toast.success('VPA generated successfully!');
    } catch (error) {
      console.error('VPA generation failed:', error);
      toast.error('Failed to generate VPA. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const copyVpa = () => {
    if (vpaData?.merchant_vpa) {
      navigator.clipboard.writeText(vpaData.merchant_vpa);
      toast.success('VPA copied to clipboard!');
    }
  };

  const downloadQr = () => {
    if (vpaData?.qr_code_url) {
      const link = document.createElement('a');
      link.href = vpaData.qr_code_url;
      link.download = `${businessName}_VPA_QR.png`;
      link.click();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'deactivated':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Deactivated</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5" />
          Virtual Payment Address (VPA)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!vpaData?.merchant_vpa ? (
          <div className="text-center space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No VPA assigned yet. Generate your unique VPA to start accepting payments.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={generateVpa} 
              disabled={generating}
              className="w-full"
            >
              {generating ? 'Generating VPA...' : 'Generate VPA'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* VPA Address Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Your VPA Address</label>
                {getStatusBadge(vpaData.vpa_status)}
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <code className="flex-1 text-sm font-mono">{vpaData.merchant_vpa}</code>
                <Button variant="outline" size="sm" onClick={copyVpa}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* QR Code Section */}
            {vpaData.qr_code_url && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Payment QR Code</h3>
                  <Button variant="outline" size="sm" onClick={downloadQr}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex justify-center">
                  <img 
                    src={vpaData.qr_code_url} 
                    alt="VPA QR Code"
                    className="w-48 h-48 border rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Customers can scan this QR code to pay directly to your VPA
                </p>
              </div>
            )}

            <Separator />

            {/* Instructions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">How to use your VPA:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Share your VPA address with customers for direct payments</li>
                <li>• Display the QR code at your business location</li>
                <li>• All payments will automatically credit to your RizzPay wallet</li>
                <li>• Set up auto-settlements to transfer funds to your bank account</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VpaManagement;
