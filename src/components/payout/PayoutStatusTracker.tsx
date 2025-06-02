
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  AlertTriangle,
  ExternalLink,
  Wifi,
  WifiOff
} from 'lucide-react';
import { usePayoutRealtime } from '@/hooks/usePayoutRealtime';
import { useMerchantAuth } from '@/stores/merchantAuthStore';
import { format } from 'date-fns';

const PayoutStatusTracker: React.FC = () => {
  const { currentMerchant } = useMerchantAuth();
  const { realtimeUpdates, isConnected, clearUpdates } = usePayoutRealtime(currentMerchant?.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span>Live Payout Updates</span>
            </div>
          </CardTitle>
          <div className="flex gap-2">
            {realtimeUpdates.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearUpdates}>
                Clear
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <a href="/payout-enhanced" className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                View All
              </a>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          {isConnected ? 'Connected to real-time updates' : 'Disconnected - trying to reconnect...'}
        </div>
      </CardHeader>
      <CardContent>
        {realtimeUpdates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent payout updates</p>
            <p className="text-xs mt-1">Status changes will appear here in real-time</p>
          </div>
        ) : (
          <div className="space-y-3">
            {realtimeUpdates.map((update, index) => (
              <div 
                key={`${update.id}-${update.updated_at}`}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                  index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(update.status)}
                  <div>
                    <p className="font-medium text-sm">
                      Payout {update.id.substring(0, 8)}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(update.updated_at), 'HH:mm:ss')}
                    </p>
                    {update.failure_reason && (
                      <p className="text-xs text-red-600 mt-1">
                        {update.failure_reason}
                      </p>
                    )}
                    {update.utr_number && (
                      <p className="text-xs text-green-600 mt-1">
                        UTR: {update.utr_number}
                      </p>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(update.status)}>
                  {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PayoutStatusTracker;
