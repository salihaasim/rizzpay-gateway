
import { supabase } from '../config/supabase';

export interface DashboardStats {
  totalMerchants: number;
  activeMerchants: number;
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
  avgTransactionAmount: number;
  topMerchants: any[];
  recentActivity: any[];
}

export interface PlatformStats {
  daily: {
    transactions: number;
    volume: number;
    merchants: number;
  };
  monthly: {
    transactions: number;
    volume: number;
    merchants: number;
  };
  yearly: {
    transactions: number;
    volume: number;
    merchants: number;
  };
}

export class AnalyticsService {
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get merchant stats
      const { data: merchantStats } = await supabase
        .from('merchants')
        .select('id, status')
        .in('status', ['active', 'inactive']);

      const totalMerchants = merchantStats?.length || 0;
      const activeMerchants = merchantStats?.filter(m => m.status === 'active').length || 0;

      // Get transaction stats for last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: transactionStats } = await supabase
        .from('transactions')
        .select('amount, status')
        .gte('date', thirtyDaysAgo.toISOString());

      const totalTransactions = transactionStats?.length || 0;
      const successfulTransactions = transactionStats?.filter(t => t.status === 'successful').length || 0;
      const totalVolume = transactionStats?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
      const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;
      const avgTransactionAmount = totalTransactions > 0 ? totalVolume / totalTransactions : 0;

      // Get top merchants by volume
      const { data: topMerchants } = await supabase
        .from('transactions')
        .select('merchant_id, amount')
        .eq('status', 'successful')
        .gte('date', thirtyDaysAgo.toISOString());

      const merchantVolumes = topMerchants?.reduce((acc: any, t: any) => {
        const merchantId = t.merchant_id;
        if (!acc[merchantId]) acc[merchantId] = 0;
        acc[merchantId] += Number(t.amount) || 0;
        return acc;
      }, {}) || {};

      const topMerchantsArray = Object.entries(merchantVolumes)
        .sort(([,a]: any, [,b]: any) => b - a)
        .slice(0, 5)
        .map(([merchantId, volume]) => ({ merchant_id: merchantId, volume }));

      // Get recent activity
      const { data: recentActivity } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);

      return {
        totalMerchants,
        activeMerchants,
        totalTransactions,
        totalVolume,
        successRate,
        avgTransactionAmount,
        topMerchants: topMerchantsArray,
        recentActivity: recentActivity || []
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  static async getPlatformStats(): Promise<PlatformStats> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    try {
      // Daily stats
      const { data: dailyTransactions } = await supabase
        .from('transactions')
        .select('amount')
        .gte('date', startOfDay.toISOString());

      const { data: dailyMerchants } = await supabase
        .from('merchants')
        .select('id')
        .gte('created_at', startOfDay.toISOString());

      // Monthly stats
      const { data: monthlyTransactions } = await supabase
        .from('transactions')
        .select('amount')
        .gte('date', startOfMonth.toISOString());

      const { data: monthlyMerchants } = await supabase
        .from('merchants')
        .select('id')
        .gte('created_at', startOfMonth.toISOString());

      // Yearly stats
      const { data: yearlyTransactions } = await supabase
        .from('transactions')
        .select('amount')
        .gte('date', startOfYear.toISOString());

      const { data: yearlyMerchants } = await supabase
        .from('merchants')
        .select('id')
        .gte('created_at', startOfYear.toISOString());

      return {
        daily: {
          transactions: dailyTransactions?.length || 0,
          volume: dailyTransactions?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0,
          merchants: dailyMerchants?.length || 0
        },
        monthly: {
          transactions: monthlyTransactions?.length || 0,
          volume: monthlyTransactions?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0,
          merchants: monthlyMerchants?.length || 0
        },
        yearly: {
          transactions: yearlyTransactions?.length || 0,
          volume: yearlyTransactions?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0,
          merchants: yearlyMerchants?.length || 0
        }
      };
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      throw new Error('Failed to fetch platform statistics');
    }
  }

  static async getMerchantRiskAnalysis(merchantId: string) {
    try {
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('merchant_id', merchantId)
        .order('date', { ascending: false })
        .limit(100);

      if (!transactions || transactions.length === 0) {
        return {
          riskScore: 0,
          riskLevel: 'low',
          factors: [],
          recommendations: []
        };
      }

      const totalTransactions = transactions.length;
      const failedTransactions = transactions.filter(t => t.status === 'failed').length;
      const failureRate = (failedTransactions / totalTransactions) * 100;

      const amounts = transactions.map(t => Number(t.amount) || 0);
      const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
      const maxAmount = Math.max(...amounts);
      const volumeVariation = (maxAmount - avgAmount) / avgAmount;

      let riskScore = 0;
      const factors = [];
      const recommendations = [];

      // Risk factors calculation
      if (failureRate > 20) {
        riskScore += 30;
        factors.push(`High failure rate: ${failureRate.toFixed(1)}%`);
        recommendations.push('Review transaction processing and customer verification');
      }

      if (volumeVariation > 5) {
        riskScore += 20;
        factors.push(`High volume variation detected`);
        recommendations.push('Monitor for unusual transaction patterns');
      }

      if (avgAmount > 50000) {
        riskScore += 15;
        factors.push('High average transaction amount');
        recommendations.push('Enhanced verification for high-value transactions');
      }

      const riskLevel = riskScore > 50 ? 'high' : riskScore > 25 ? 'medium' : 'low';

      return {
        riskScore,
        riskLevel,
        factors,
        recommendations,
        metrics: {
          totalTransactions,
          failureRate,
          avgAmount,
          volumeVariation
        }
      };
    } catch (error) {
      console.error('Error analyzing merchant risk:', error);
      throw new Error('Failed to analyze merchant risk');
    }
  }
}
