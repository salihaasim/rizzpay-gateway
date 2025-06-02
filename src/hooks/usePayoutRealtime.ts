
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PayoutUpdate {
  id: string;
  status: string;
  utr_number?: string;
  failure_reason?: string;
  updated_at: string;
}

export const usePayoutRealtime = (merchantId?: string) => {
  const [realtimeUpdates, setRealtimeUpdates] = useState<PayoutUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!merchantId) return;

    console.log('Setting up real-time payout updates for merchant:', merchantId);

    const channel = supabase
      .channel('payout-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payout_requests',
          filter: `merchant_id=eq.${merchantId}`
        },
        (payload) => {
          console.log('Payout update received:', payload);
          
          const update: PayoutUpdate = {
            id: payload.new.id,
            status: payload.new.status,
            utr_number: payload.new.utr_number,
            failure_reason: payload.new.failure_reason,
            updated_at: payload.new.updated_at
          };
          
          setRealtimeUpdates(prev => [update, ...prev.slice(0, 9)]); // Keep last 10 updates
          
          // Show toast notification for status changes
          const statusMessages = {
            processing: '⏳ Payout is being processed',
            completed: '✅ Payout completed successfully',
            failed: '❌ Payout failed',
            cancelled: '🚫 Payout was cancelled'
          };
          
          const message = statusMessages[update.status as keyof typeof statusMessages];
          if (message) {
            toast.success('Payout Status Update', {
              description: `${message} - ${update.id.substring(0, 8)}...`,
              action: {
                label: 'View Details',
                onClick: () => window.open('/payout-enhanced', '_blank')
              }
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [merchantId]);

  return {
    realtimeUpdates,
    isConnected,
    clearUpdates: () => setRealtimeUpdates([])
  };
};
