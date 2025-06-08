
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const KycPage = () => {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    dateOfBirth: '',
    pan: '',
    aadhaar: '',
    address: ''
  });

  const [businessInfo, setBusinessInfo] = useState({
    businessName: '',
    businessType: '',
    gst: '',
    cin: '',
    businessAddress: ''
  });

  const [documents, setDocuments] = useState({
    panCard: null,
    aadhaarCard: null,
    businessRegistration: null,
    gstCertificate: null
  });

  const kycStatus = {
    personal: 'completed',
    business: 'pending',
    documents: 'in-review',
    overall: 'in-progress'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'in-review':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePersonalInfoSubmit = () => {
    if (!personalInfo.fullName || !personalInfo.pan || !personalInfo.aadhaar) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Personal information saved successfully');
  };

  const handleBusinessInfoSubmit = () => {
    if (!businessInfo.businessName || !businessInfo.businessType) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Business information saved successfully');
  };

  const handleFileUpload = (type: string, file: File) => {
    setDocuments({ ...documents, [type]: file });
    toast.success(`${type} uploaded successfully`);
  };

  return (
    <Layout>
      <div className="container max-w-screen-xl mx-auto p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">KYC Verification</h1>
          <p className="text-sm text-muted-foreground">Complete your KYC verification to access all features</p>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(kycStatus.overall)}
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Personal Info</p>
                    <p className="text-sm text-muted-foreground">Basic details</p>
                  </div>
                  <Badge className={getStatusColor(kycStatus.personal)}>
                    {kycStatus.personal}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Business Info</p>
                    <p className="text-sm text-muted-foreground">Company details</p>
                  </div>
                  <Badge className={getStatusColor(kycStatus.business)}>
                    {kycStatus.business}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Documents</p>
                    <p className="text-sm text-muted-foreground">ID proofs</p>
                  </div>
                  <Badge className={getStatusColor(kycStatus.documents)}>
                    {kycStatus.documents}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Business Info
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Provide your personal details for verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={personalInfo.fullName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number *</Label>
                    <Input
                      id="pan"
                      placeholder="ABCDE1234F"
                      value={personalInfo.pan}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, pan: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                    <Input
                      id="aadhaar"
                      placeholder="1234 5678 9012"
                      value={personalInfo.aadhaar}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, aadhaar: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Complete address"
                    value={personalInfo.address}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                  />
                </div>
                <Button onClick={handlePersonalInfoSubmit} className="bg-[#0052FF]">
                  Save Personal Information
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Provide your business details for verification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={businessInfo.businessName}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <select
                      className="w-full p-2 border border-input rounded-md"
                      value={businessInfo.businessType}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, businessType: e.target.value })}
                    >
                      <option value="">Select business type</option>
                      <option value="sole-proprietorship">Sole Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="private-limited">Private Limited</option>
                      <option value="public-limited">Public Limited</option>
                      <option value="llp">LLP</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gst">GST Number</Label>
                    <Input
                      id="gst"
                      placeholder="22AAAAA0000A1Z5"
                      value={businessInfo.gst}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, gst: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cin">CIN Number</Label>
                    <Input
                      id="cin"
                      placeholder="U12345AB2021PTC123456"
                      value={businessInfo.cin}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, cin: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input
                    id="businessAddress"
                    placeholder="Complete business address"
                    value={businessInfo.businessAddress}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, businessAddress: e.target.value })}
                  />
                </div>
                <Button onClick={handleBusinessInfoSubmit} className="bg-[#0052FF]">
                  Save Business Information
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Documents</CardTitle>
                  <CardDescription>Upload your identity documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>PAN Card</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">Click to upload PAN card</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileUpload('panCard', e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Aadhaar Card</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">Click to upload Aadhaar card</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileUpload('aadhaarCard', e.target.files[0])}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Documents</CardTitle>
                  <CardDescription>Upload your business documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Business Registration</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">Click to upload registration document</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileUpload('businessRegistration', e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>GST Certificate (Optional)</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">Click to upload GST certificate</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileUpload('gstCertificate', e.target.files[0])}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default KycPage;
