
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Activity,
  Zap,
  Database
} from 'lucide-react';

// Mock bank API data - in real implementation, this would come from actual API calls
const bankApiData = {
  hdfc: {
    name: "HDFC Bank API",
    status: "Operational",
    responseTime: "142ms",
    uptime: "99.97%",
    successRate: "99.8%",
    lastCheck: new Date(),
    endpoints: [
      { name: "NEFT Transfer", status: "Operational", responseTime: "138ms" },
      { name: "Account Validation", status: "Operational", responseTime: "95ms" },
      { name: "Transaction Status", status: "Operational", responseTime: "156ms" },
      { name: "Balance Inquiry", status: "Warning", responseTime: "245ms" }
    ],
    documentation: "https://developer.hdfcbank.com/api-category-landing/34",
    supportContact: "api.support@hdfcbank.com"
  },
  icici: {
    name: "ICICI Bank UPI API",
    status: "Operational",
    responseTime: "98ms",
    uptime: "99.95%",
    successRate: "99.9%",
    lastCheck: new Date(),
    endpoints: [
      { name: "UPI Validation", status: "Operational", responseTime: "85ms" },
      { name: "QR Generation", status: "Operational", responseTime: "112ms" },
      { name: "Payment Status", status: "Operational", responseTime: "103ms" },
      { name: "Settlement Report", status: "Operational", responseTime: "187ms" }
    ],
    documentation: "https://developer.icicibank.com/",
    supportContact: "developer.care@icicibank.com"
  },
  sbi: {
    name: "SBI Payment Gateway",
    status: "Degraded",
    responseTime: "285ms",
    uptime: "98.5%",
    successRate: "97.2%",
    lastCheck: new Date(),
    endpoints: [
      { name: "Card Processing", status: "Degraded", responseTime: "320ms" },
      { name: "Net Banking", status: "Operational", responseTime: "198ms" },
      { name: "Transaction Report", status: "Operational", responseTime: "234ms" },
      { name: "Refund Processing", status: "Down", responseTime: "timeout" }
    ],
    documentation: "https://developer.onlinesbi.com/",
    supportContact: "merchant@sbi.co.in"
  },
  axis: {
    name: "Axis Bank API",
    status: "Operational",
    responseTime: "156ms",
    uptime: "99.8%",
    successRate: "99.5%",
    lastCheck: new Date(),
    endpoints: [
      { name: "Fund Transfer", status: "Operational", responseTime: "145ms" },
      { name: "Account Services", status: "Operational", responseTime: "167ms" },
      { name: "Transaction History", status: "Operational", responseTime: "189ms" }
    ],
    documentation: "https://developer.axisbank.com/",
    supportContact: "api.support@axisbank.com"
  }
};

const BankApiMonitoring = () => {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastRefresh(new Date());
        console.log("Auto-refreshing bank API data...");
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleRefresh = () => {
    setLastRefresh(new Date());
    console.log("Manual refresh of bank API data");
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'bg-green-500/20 text-green-600';
      case 'degraded':
      case 'warning':
        return 'bg-orange-500/20 text-orange-600';
      case 'down':
        return 'bg-red-500/20 text-red-600';
      default:
        return 'bg-gray-500/20 text-gray-600';
    }
  };

  const getResponseTimeColor = (responseTime: string) => {
    const time = parseInt(responseTime);
    if (isNaN(time)) return 'text-red-500';
    if (time < 150) return 'text-green-500';
    if (time < 250) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bank API Integration Monitoring</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of all integrated bank APIs and payment gateways
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total APIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">3</div>
            <p className="text-xs text-muted-foreground">APIs running normally</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">170ms</div>
            <p className="text-xs text-muted-foreground">Across all APIs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.1%</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Bank API Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(bankApiData).map(([key, bank]) => (
          <Card key={key} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(bank.status)}
                  <CardTitle className="text-lg">{bank.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(bank.status)}>
                  {bank.status}
                </Badge>
              </div>
              <CardDescription>
                Last checked: {bank.lastCheck.toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Response Time</p>
                  <p className={`font-medium ${getResponseTimeColor(bank.responseTime)}`}>
                    {bank.responseTime}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Uptime</p>
                  <p className="font-medium text-green-600">{bank.uptime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Success Rate</p>
                  <p className="font-medium text-blue-600">{bank.successRate}</p>
                </div>
              </div>

              <Separator />

              {/* Endpoints Status */}
              <div>
                <h4 className="font-medium mb-2">Endpoint Status</h4>
                <div className="space-y-2">
                  {bank.endpoints.map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(endpoint.status)}
                        <span>{endpoint.name}</span>
                      </div>
                      <span className={`font-medium ${getResponseTimeColor(endpoint.responseTime)}`}>
                        {endpoint.responseTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={bank.documentation} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Documentation
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${bank.supportContact}`}>
                    <Activity className="h-4 w-4 mr-2" />
                    Support
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Bank API Integration Status</CardTitle>
          <CardDescription>
            Current integration status and next steps for production deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Production Ready
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• HDFC Bank NEFT API</li>
                  <li>• ICICI Bank UPI API</li>
                  <li>• Axis Bank API</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Requires Attention
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• SBI Gateway refund processing</li>
                  <li>• Load balancing configuration</li>
                  <li>• Failover mechanisms</li>
                </ul>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm">
                  <Database className="h-4 w-4 mr-2" />
                  View Transaction Logs
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Performance Analytics
                </Button>
                <Button variant="outline" size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  API Health Check
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankApiMonitoring;
