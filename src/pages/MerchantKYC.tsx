
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react'; // Changed from FileUpload to Upload
import { toast } from 'sonner';
import { useTransactionStore } from '@/stores/transactionStore';
import Layout from '@/components/Layout';

const MerchantKYC: React.FC = () => {
  const { userEmail } = useTransactionStore();
  const [activeTab, setActiveTab] = useState('documents');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gstNumber: '',
    panNumber: '',
    aadhaarNumber: '',
    businessAddress: '',
    businessRegistrationNumber: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileUpload = (documentType: string) => {
    // In a real implementation, this would trigger a file upload
    toast.info(`${documentType} upload initiated`, {
      description: "This is a placeholder for file upload functionality."
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("KYC documents submitted successfully", {
        description: "Your documents have been submitted for verification. This process typically takes 1-2 business days."
      });
      setLoading(false);
    }, 1500);
  };
  
  if (!userEmail) {
    return (
      <Layout>
        <Card className="mx-auto max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please login to access merchant KYC verification.
            </p>
          </CardContent>
        </Card>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Merchant KYC Verification</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="documents">Document Upload</TabsTrigger>
            <TabsTrigger value="verification">Verification Status</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Upload KYC Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input 
                        id="gstNumber" 
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleInputChange}
                        placeholder="22AAAAA0000A1Z5"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Number</Label>
                      <Input 
                        id="panNumber" 
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleInputChange}
                        placeholder="ABCDE1234F"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                      <Input 
                        id="aadhaarNumber" 
                        name="aadhaarNumber"
                        value={formData.aadhaarNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessRegistrationNumber">Business Registration Number</Label>
                      <Input 
                        id="businessRegistrationNumber" 
                        name="businessRegistrationNumber"
                        value={formData.businessRegistrationNumber}
                        onChange={handleInputChange}
                        placeholder="CIN/LLPIN/Registration Number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address</Label>
                    <Input 
                      id="businessAddress" 
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      placeholder="Full business address"
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3 mt-8">
                    <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                      <h3 className="font-medium mb-2">GST Certificate</h3>
                      <Button 
                        type="button" 
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => handleFileUpload('GST Certificate')}
                      >
                        <Upload className="h-4 w-4 mr-2" /> Upload
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                      <h3 className="font-medium mb-2">PAN Card</h3>
                      <Button 
                        type="button" 
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => handleFileUpload('PAN Card')}
                      >
                        <Upload className="h-4 w-4 mr-2" /> Upload
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                      <h3 className="font-medium mb-2">Aadhaar Card</h3>
                      <Button 
                        type="button" 
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => handleFileUpload('Aadhaar Card')}
                      >
                        <Upload className="h-4 w-4 mr-2" /> Upload
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 text-center">
                    <Button type="submit" className="w-full max-w-xs" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit for Verification'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-md p-6 text-center">
                  <h3 className="text-xl font-medium mb-2">Pending Verification</h3>
                  <p className="text-muted-foreground">
                    Your KYC documents have not been submitted yet or are in the verification process.
                  </p>
                  <div className="mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Verification History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No verification history available.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MerchantKYC;
