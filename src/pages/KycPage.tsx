
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import KycUploadForm from '@/components/kyc/KycUploadForm';
import { CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';

const KycPage = () => {
  const { currentMerchant } = useMerchantAuth();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const kycStatus = currentMerchant?.kycStatus || 'not_started';
  const kycLevel = currentMerchant?.kycLevel || 'basic';

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">KYC Verification</h1>
          <p className="text-sm text-muted-foreground">
            Complete your Know Your Customer verification to unlock all features
          </p>
        </div>

        {/* KYC Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(kycStatus)}
                  KYC Verification Status
                </CardTitle>
                <CardDescription>
                  Current verification level and status of your account
                </CardDescription>
              </div>
              <Badge className={getStatusColor(kycStatus)}>
                {kycStatus.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Verification Level</h4>
                <Badge variant="outline" className="text-sm">
                  {kycLevel.charAt(0).toUpperCase() + kycLevel.slice(1)} Level
                </Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Current Limits</h4>
                <div className="text-sm text-muted-foreground">
                  {kycLevel === 'basic' ? (
                    <ul className="space-y-1">
                      <li>• Transaction limit: ₹10,000/day</li>
                      <li>• Monthly limit: ₹50,000</li>
                      <li>• Limited withdrawal options</li>
                    </ul>
                  ) : kycLevel === 'verified' ? (
                    <ul className="space-y-1">
                      <li>• Transaction limit: ₹1,00,000/day</li>
                      <li>• Monthly limit: ₹20,00,000</li>
                      <li>• All withdrawal options</li>
                      <li>• Priority support</li>
                    </ul>
                  ) : (
                    <ul className="space-y-1">
                      <li>• Complete KYC to unlock limits</li>
                      <li>• Access to all features</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Benefits */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Benefits of KYC Verification</CardTitle>
            <CardDescription>Unlock these features after completing your verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Higher Transaction Limits</h4>
                  <p className="text-sm text-muted-foreground">
                    Increase your daily and monthly transaction limits significantly
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Fast Withdrawals</h4>
                  <p className="text-sm text-muted-foreground">
                    Instant withdrawals to your verified bank accounts
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Priority Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Get dedicated support and faster query resolution
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Documents Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
            <CardDescription>Documents needed for KYC verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Aadhaar Card</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Valid Aadhaar card for identity verification
                </p>
                <Badge variant="outline" className="mt-2">Required</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium">PAN Card</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  PAN card for tax identification
                </p>
                <Badge variant="outline" className="mt-2">Required</Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <h4 className="font-medium">GST Certificate</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  GST registration certificate for business verification
                </p>
                <Badge className="bg-red-100 text-red-800 mt-2">Mandatory</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Upload KYC Documents</CardTitle>
            <CardDescription>
              Please upload clear, readable copies of your documents. All fields marked with * are mandatory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KycUploadForm />
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Documents should be clear and readable</p>
              <p>• File size should not exceed 5MB per document</p>
              <p>• Supported formats: JPG, PNG, PDF</p>
              <p>• GST certificate is mandatory for all business accounts</p>
              <p>• Verification process typically takes 1-2 business days</p>
              <p>• You'll receive email notifications about status updates</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default KycPage;
