
import { supabase } from '../config/supabase';

export class RealTimeService {
  private static clients = new Map<string, WebSocket[]>();

  static addClient(merchantId: string, ws: WebSocket) {
    if (!this.clients.has(merchantId)) {
      this.clients.set(merchantId, []);
    }
    this.clients.get(merchantId)!.push(ws);
    console.log(`Added WebSocket client for merchant: ${merchantId}`);
  }

  static removeClient(merchantId: string, ws: WebSocket) {
    const clients = this.clients.get(merchantId);
    if (clients) {
      const index = clients.indexOf(ws);
      if (index > -1) {
        clients.splice(index, 1);
        if (clients.length === 0) {
          this.clients.delete(merchantId);
        }
      }
    }
    console.log(`Removed WebSocket client for merchant: ${merchantId}`);
  }

  static async broadcastPayoutUpdate(payoutId: string, status: string, additionalData?: any) {
    try {
      // Get merchant ID for this payout
      const { data: payout } = await supabase
        .from('payout_requests')
        .select('merchant_id')
        .eq('id', payoutId)
        .single();

      if (!payout) return;

      const clients = this.clients.get(payout.merchant_id);
      if (!clients || clients.length === 0) return;

      const message = JSON.stringify({
        type: 'payout_update',
        payout_id: payoutId,
        status,
        timestamp: new Date().toISOString(),
        ...additionalData
      });

      // Send to all connected clients for this merchant
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });

      console.log(`Broadcasted payout update to ${clients.length} clients`);

    } catch (error) {
      console.error('Error broadcasting payout update:', error);
    }
  }

  static broadcastSystemMessage(message: string, type: 'info' | 'warning' | 'error' = 'info') {
    const payload = JSON.stringify({
      type: 'system_message',
      message,
      level: type,
      timestamp: new Date().toISOString()
    });

    // Broadcast to all connected clients
    this.clients.forEach((clients) => {
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
    });
  }

  static getConnectedClients(): { [merchantId: string]: number } {
    const stats: { [merchantId: string]: number } = {};
    this.clients.forEach((clients, merchantId) => {
      stats[merchantId] = clients.length;
    });
    return stats;
  }
}
