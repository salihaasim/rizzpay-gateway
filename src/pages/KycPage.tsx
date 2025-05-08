
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import KycUploadForm from '@/components/kyc/KycUploadForm';
import Layout from '@/components/Layout';

const KycPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">KYC Verification</h1>
            <p className="text-muted-foreground mt-2">
              Complete your Know Your Customer verification by uploading the required documents.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Document Verification</CardTitle>
              <CardDescription>
                Upload your identity and business documents to verify your account.
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
