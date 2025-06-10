
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calculator, Percent, IndianRupee, TrendingUp, Settings, Save } from 'lucide-react';
import { toast } from 'sonner';
import MerchantPricingControl from '@/components/admin/MerchantPricingControl';
import { Helmet } from 'react-helmet';

const AdminPricing: React.FC = () => {
  const [globalPricing, setGlobalPricing] = useState({
    payoutFeePercentage: 0.5,
    payinFeePercentage: 1.0,
    fixedTransactionFee: 5,
    monthlySubscriptionFee: 499
  });

  const [revenueCalculator, setRevenueCalculator] = useState({
    transactionVolume: '',
    payoutVolume: '',
    merchantCount: '',
    calculatedRevenue: 0
  });

  const handlePricingUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGlobalPricing(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleCalculatorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRevenueCalculator(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateRevenue = () => {
    const transactionVolume = parseFloat(revenueCalculator.transactionVolume) || 0;
    const payoutVolume = parseFloat(revenueCalculator.payoutVolume) || 0;
    const merchantCount = parseFloat(revenueCalculator.merchantCount) || 0;

    const payinRevenue = (transactionVolume * globalPricing.payinFeePercentage) / 100;
    const payoutRevenue = (payoutVolume * globalPricing.payoutFeePercentage) / 100;
    const subscriptionRevenue = merchantCount * globalPricing.monthlySubscriptionFee;
    const totalRevenue = payinRevenue + payoutRevenue + subscriptionRevenue;

    setRevenueCalculator(prev => ({
      ...prev,
      calculatedRevenue: totalRevenue
    }));

    toast.success('Revenue calculated successfully');
  };

  const saveGlobalPricing = () => {
    // In a real app, this would save to backend
    toast.success('Global pricing settings saved successfully');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Helmet>
          <title>Pricing Management | RizzPay Admin</title>
        </Helmet>
        
        <div>
          <h1 className="text-2xl font-bold">Pricing Management</h1>
          <p className="text-muted-foreground mt-1">
            Control application-wide pricing and calculate revenue projections
          </p>
        </div>

        <Tabs defaultValue="global-pricing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="global-pricing">Global Pricing</TabsTrigger>
            <TabsTrigger value="merchant-pricing">Merchant Pricing</TabsTrigger>
            <TabsTrigger value="revenue-calculator">Revenue Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="global-pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Global Pricing Configuration
                </CardTitle>
                <CardDescription>
                  Set default pricing that applies to all new merchants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="payoutFeePercentage">Payout Fee Percentage</Label>
                      <div className="relative mt-1">
                        <Input
                          id="payoutFeePercentage"
                          name="payoutFeePercentage"
                          type="number"
                          step="0.01"
                          value={globalPricing.payoutFeePercentage}
                          onChange={handlePricingUpdate}
                          className="pr-8"
                        />
                        <Percent className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Current: 0.5%</p>
                    </div>

                    <div>
                      <Label htmlFor="payinFeePercentage">Pay-in Fee Percentage</Label>
                      <div className="relative mt-1">
                        <Input
                          id="payinFeePercentage"
                          name="payinFeePercentage"
                          type="number"
                          step="0.01"
                          value={globalPricing.payinFeePercentage}
                          onChange={handlePricingUpdate}
                          className="pr-8"
                        />
                        <Percent className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Default for new merchants</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fixedTransactionFee">Fixed Transaction Fee</Label>
                      <div className="relative mt-1">
                        <Input
                          id="fixedTransactionFee"
                          name="fixedTransactionFee"
                          type="number"
                          value={globalPricing.fixedTransactionFee}
                          onChange={handlePricingUpdate}
                          className="pr-8"
                        />
                        <IndianRupee className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Per transaction</p>
                    </div>

                    <div>
                      <Label htmlFor="monthlySubscriptionFee">Monthly Subscription Fee</Label>
                      <div className="relative mt-1">
                        <Input
                          id="monthlySubscriptionFee"
                          name="monthlySubscriptionFee"
                          type="number"
                          value={globalPricing.monthlySubscriptionFee}
                          onChange={handlePricingUpdate}
                          className="pr-8"
                        />
                        <IndianRupee className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Per merchant per month</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveGlobalPricing} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Global Pricing
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Pricing Overview</CardTitle>
                <CardDescription>Live pricing configuration across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {globalPricing.payoutFeePercentage}%
                    </div>
                    <p className="text-sm text-muted-foreground">Payout Fee</p>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {globalPricing.payinFeePercentage}%
                    </div>
                    <p className="text-sm text-muted-foreground">Pay-in Fee</p>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <IndianRupee className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      ₹{globalPricing.fixedTransactionFee}
                    </div>
                    <p className="text-sm text-muted-foreground">Fixed Fee</p>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <IndianRupee className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      ₹{globalPricing.monthlySubscriptionFee}
                    </div>
                    <p className="text-sm text-muted-foreground">Monthly Fee</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="merchant-pricing">
            <MerchantPricingControl />
          </TabsContent>

          <TabsContent value="revenue-calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Revenue Calculator
                </CardTitle>
                <CardDescription>
                  Calculate projected revenue based on transaction volumes and merchant count
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <Label htmlFor="transactionVolume">Monthly Transaction Volume</Label>
                    <div className="relative mt-1">
                      <Input
                        id="transactionVolume"
                        name="transactionVolume"
                        type="number"
                        placeholder="Enter amount in INR"
                        value={revenueCalculator.transactionVolume}
                        onChange={handleCalculatorInput}
                        className="pr-8"
                      />
                      <IndianRupee className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="payoutVolume">Monthly Payout Volume</Label>
                    <div className="relative mt-1">
                      <Input
                        id="payoutVolume"
                        name="payoutVolume"
                        type="number"
                        placeholder="Enter amount in INR"
                        value={revenueCalculator.payoutVolume}
                        onChange={handleCalculatorInput}
                        className="pr-8"
                      />
                      <IndianRupee className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="merchantCount">Active Merchant Count</Label>
                    <Input
                      id="merchantCount"
                      name="merchantCount"
                      type="number"
                      placeholder="Number of merchants"
                      value={revenueCalculator.merchantCount}
                      onChange={handleCalculatorInput}
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={calculateRevenue} className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Calculate Revenue
                  </Button>
                </div>

                {revenueCalculator.calculatedRevenue > 0 && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-800">Revenue Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-600">
                            ₹{((parseFloat(revenueCalculator.transactionVolume) || 0) * globalPricing.payinFeePercentage / 100).toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">Pay-in Revenue</p>
                        </div>

                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">
                            ₹{((parseFloat(revenueCalculator.payoutVolume) || 0) * globalPricing.payoutFeePercentage / 100).toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">Payout Revenue</p>
                        </div>

                        <div className="text-center">
                          <div className="text-xl font-bold text-purple-600">
                            ₹{((parseFloat(revenueCalculator.merchantCount) || 0) * globalPricing.monthlySubscriptionFee).toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">Subscription Revenue</p>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-800">
                            ₹{revenueCalculator.calculatedRevenue.toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">Total Monthly Revenue</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminPricing;
