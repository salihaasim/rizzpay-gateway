
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import KycUploadForm from '@/components/kyc/KycUploadForm';
import KycStatus from '@/components/merchant/KycStatus';
import Layout from '@/components/Layout';
import { Helmet } from 'react-helmet';

const KycPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>KYC Verification | RizzPay</title>
      </Helmet>
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">KYC Verification</h1>
            <p className="text-muted-foreground mt-2">
              Complete your Know Your Customer verification to enable all payment features.
            </p>
          </div>

          {/* KYC Status */}
          <KycStatus />

          <Card>
            <CardHeader>
              <CardTitle>Submit KYC Documents</CardTitle>
              <CardDescription>
                Upload your identity and business documents for verification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KycUploadForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default KycPage;
