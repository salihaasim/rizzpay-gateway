
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  getUpiHandleStats, 
  resetDailyCounters, 
  processSLAMTransaction 
} from '@/slam_engine';
import { UpiHandle, ObfuscationConfig } from '@/slam_engine/types';
import { RefreshCcw, Shield, Settings, Check, X } from 'lucide-react';

const SLAMAdmin: React.FC = () => {
  const [upiHandles, setUpiHandles] = useState<UpiHandle[]>([]);
  const [config, setConfig] = useState<ObfuscationConfig>({
    enable_upi_rotation: true,
    enable_label_rewriting: true,
    enable_merchant_obfuscation: true,
    enable_dashboard_cleaning: true,
    restricted_terms: [
      'gambling', 'casino', 'betting', 'fantasy', 'poker', 'rummy', 
      'teen patti', 'lottery', 'jackpot', 'winnings'
    ],
    allowed_payment_labels: [
      'Payment', 'Transfer', 'Services', 'Subscription',
      'Invoice', 'Retail', 'Purchase', 'Order'
    ],
    rotation_frequency: 'per_transaction'
  });
  
  const [testInput, setTestInput] = useState({
    description: 'Fantasy cricket winnings payment',
    merchantName: 'BetCricket Fantasy Gaming',
  });
  
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    // Load UPI handle statistics
    loadUpiHandleStats();
  }, []);

  const loadUpiHandleStats = () => {
    const stats = getUpiHandleStats();
    setUpiHandles(stats);
  };

  const handleResetCounters = () => {
    resetDailyCounters();
    loadUpiHandleStats();
  };

  const handleConfigChange = (key: keyof ObfuscationConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const testMasking = () => {
    const result = processSLAMTransaction(testInput);
    setTestResult(result);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">SLAM Engine Admin</h2>
        <div className="flex items-center space-x-4">
          <Button onClick={loadUpiHandleStats} variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleResetCounters} variant="outline" size="sm">
            Reset Counters
          </Button>
        </div>
      </div>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            SLAM Configuration
          </CardTitle>
          <CardDescription>
            Configure how the Smart Labeling & Masking Engine processes transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="upi-rotation" 
                checked={config.enable_upi_rotation}
                onCheckedChange={(checked) => handleConfigChange('enable_upi_rotation', checked)}
              />
              <Label htmlFor="upi-rotation">UPI Handle Rotation</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="label-rewriting" 
                checked={config.enable_label_rewriting}
                onCheckedChange={(checked) => handleConfigChange('enable_label_rewriting', checked)}
              />
              <Label htmlFor="label-rewriting">Transaction Label Rewriting</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="merchant-obfuscation" 
                checked={config.enable_merchant_obfuscation}
                onCheckedChange={(checked) => handleConfigChange('enable_merchant_obfuscation', checked)}
              />
              <Label htmlFor="merchant-obfuscation">Merchant Name Obfuscation</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="dashboard-cleaning" 
                checked={config.enable_dashboard_cleaning}
                onCheckedChange={(checked) => handleConfigChange('enable_dashboard_cleaning', checked)}
              />
              <Label htmlFor="dashboard-cleaning">Dashboard Data Cleaning</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UPI Handle Rotation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            UPI Handle Pool
          </CardTitle>
          <CardDescription>
            Clean UPI handles used for transaction rotation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>UPI Handle</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Usage Today</TableHead>
                <TableHead>Daily Limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upiHandles.map((handle, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{handle.handle}</TableCell>
                  <TableCell>{handle.bank}</TableCell>
                  <TableCell>{handle.used_today}</TableCell>
                  <TableCell>{handle.daily_limit}</TableCell>
                  <TableCell>
                    {handle.is_active ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        <Check className="h-3 w-3 mr-1" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                        <X className="h-3 w-3 mr-1" /> Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{handle.last_used_at ? new Date(handle.last_used_at).toLocaleString() : 'Never'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Test SLAM Engine */}
      <Card>
        <CardHeader>
          <CardTitle>Test SLAM Engine</CardTitle>
          <CardDescription>
            Test how SLAM Engine would process a transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-description">Transaction Description</Label>
                <Input 
                  id="test-description"
                  value={testInput.description}
                  onChange={(e) => setTestInput({...testInput, description: e.target.value})}
                  placeholder="Enter a transaction description"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test-merchant">Merchant Name</Label>
                <Input 
                  id="test-merchant"
                  value={testInput.merchantName}
                  onChange={(e) => setTestInput({...testInput, merchantName: e.target.value})}
                  placeholder="Enter a merchant name"
                />
              </div>
              
              <Button onClick={testMasking} className="w-full md:w-auto">
                Process Transaction
              </Button>
            </div>
            
            {testResult && (
              <div className="mt-4 p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">Results:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Original Values:</h4>
                    <p className="text-sm"><strong>Description:</strong> {testResult.originalValues.description}</p>
                    <p className="text-sm"><strong>Merchant Name:</strong> {testResult.originalValues.merchantName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Masked Values:</h4>
                    <p className="text-sm"><strong>Description:</strong> {testResult.maskedValues.description}</p>
                    <p className="text-sm"><strong>Merchant Name:</strong> {testResult.maskedValues.merchantName}</p>
                    <p className="text-sm"><strong>UPI ID:</strong> {testResult.maskedValues.upiId}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <strong>Masking Applied:</strong> {testResult.maskingApplied ? 'Yes' : 'No'}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SLAMAdmin;
