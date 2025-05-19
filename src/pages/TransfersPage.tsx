
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet';

const TransfersPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Transfers | RizzPay</title>
      </Helmet>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Transfers</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Money Transfers</CardTitle>
            <CardDescription>
              Manage your money transfers between accounts and to other merchants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your transfer history will appear here. No transfers found yet.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TransfersPage;
