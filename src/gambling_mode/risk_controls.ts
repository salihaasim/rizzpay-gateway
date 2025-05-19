
/**
 * RizzPay Gambling Mode - Risk Controls Module
 * Implements rate limiters, IP/geolocation blocks, anti-abuse logic
 */

interface IPBlockRule {
  ipOrRange: string;
  reason: string;
  expiresAt?: Date;
}

interface RateLimit {
  key: string;
  maxRequests: number;
  windowMs: number;
  currentRequests: number;
  windowStart: number;
}

// In-memory storage for demo purposes
// In production this would be stored in a database or Redis
const ipBlockList: IPBlockRule[] = [];
const rateLimits: RateLimit[] = [];
const suspiciousActivities: Array<{
  userId: string;
  activity: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}> = [];

/**
 * Check if an IP address is blocked
 */
export const isIPBlocked = (ipAddress: string): { blocked: boolean, reason?: string } => {
  const blockedRule = ipBlockList.find(rule => {
    // Check if the rule is expired
    if (rule.expiresAt && rule.expiresAt < new Date()) {
      return false;
    }
    
    // Check exact match
    if (rule.ipOrRange === ipAddress) {
      return true;
    }
    
    // Check range match (basic implementation)
    if (rule.ipOrRange.includes('/')) {
      const [rangeBase, mask] = rule.ipOrRange.split('/');
      // A proper CIDR implementation would check if IP is in range
      // This is simplified for demo purposes
      if (ipAddress.startsWith(rangeBase.split('.').slice(0, parseInt(mask) / 8).join('.'))) {
        return true;
      }
    }
    
    return false;
  });
  
  return {
    blocked: !!blockedRule,
    reason: blockedRule?.reason
  };
};

/**
 * Add IP address to block list
 */
export const blockIP = (ipOrRange: string, reason: string, durationHours?: number): void => {
  let expiresAt: Date | undefined;
  
  if (durationHours) {
    expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + durationHours);
  }
  
  ipBlockList.push({
    ipOrRange,
    reason,
    expiresAt
  });
};

/**
 * Check rate limit for a key (could be IP, userId, etc)
 */
export const checkRateLimit = (
  key: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute window
): boolean => {
  const now = Date.now();
  
  // Find existing rate limit entry or create new one
  let rateLimit = rateLimits.find(r => r.key === key);
  
  if (!rateLimit) {
    rateLimit = {
      key,
      maxRequests,
      windowMs,
      currentRequests: 0,
      windowStart: now
    };
    rateLimits.push(rateLimit);
  }
  
  // Reset if window has expired
  if (now - rateLimit.windowStart > rateLimit.windowMs) {
    rateLimit.currentRequests = 0;
    rateLimit.windowStart = now;
  }
  
  // Check if limit exceeded
  if (rateLimit.currentRequests >= rateLimit.maxRequests) {
    return false; // Rate limit exceeded
  }
  
  // Increment request count
  rateLimit.currentRequests += 1;
  
  return true; // Request allowed
};

/**
 * Flag suspicious activity for review
 */
export const flagSuspiciousActivity = (
  userId: string,
  activity: string,
  severity: 'low' | 'medium' | 'high' = 'medium'
): void => {
  suspiciousActivities.push({
    userId,
    activity,
    timestamp: new Date(),
    severity
  });
  
  // In a production system, this would trigger alerts or automated responses
  // based on the severity and patterns
  if (severity === 'high') {
    console.warn(`HIGH SEVERITY suspicious activity detected for user ${userId}: ${activity}`);
    // This could trigger immediate actions like account freeze
  }
};

/**
 * Check for suspicious deposit/withdrawal patterns
 */
export const checkTransactionPatterns = (
  userId: string,
  transactionHistory: Array<{
    type: 'deposit' | 'withdrawal';
    amount: number;
    timestamp: Date;
  }>
): boolean => {
  // Example pattern: Multiple deposits followed by immediate withdrawal
  if (transactionHistory.length >= 3) {
    const recentTransactions = transactionHistory.slice(-3);
    
    // Check for deposit-deposit-withdrawal pattern with short time gaps
    const isDepositDepositWithdrawal = 
      recentTransactions[0].type === 'deposit' &&
      recentTransactions[1].type === 'deposit' &&
      recentTransactions[2].type === 'withdrawal';
      
    if (isDepositDepositWithdrawal) {
      // Check if withdrawal amount is close to sum of deposits
      const depositSum = recentTransactions[0].amount + recentTransactions[1].amount;
      const withdrawalAmount = recentTransactions[2].amount;
      
      if (withdrawalAmount > depositSum * 0.8) {
        // Check if time between first deposit and withdrawal is short
        const timeGapHours = (recentTransactions[2].timestamp.getTime() - 
                            recentTransactions[0].timestamp.getTime()) / (1000 * 60 * 60);
        
        if (timeGapHours < 2) {
          flagSuspiciousActivity(
            userId,
            'Rapid deposit-withdrawal cycle detected',
            'medium'
          );
          return true; // Suspicious pattern detected
        }
      }
    }
  }
  
  return false; // No suspicious patterns detected
};

/**
 * Get suspicious activities for review
 */
export const getSuspiciousActivities = (
  minSeverity: 'low' | 'medium' | 'high' = 'low',
  limit: number = 100
): Array<{
  userId: string;
  activity: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}> => {
  const severityValues = {
    low: 0,
    medium: 1,
    high: 2
  };
  
  return suspiciousActivities
    .filter(activity => severityValues[activity.severity] >= severityValues[minSeverity])
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
};

/**
 * Clear expired IP blocks
 */
export const clearExpiredIPBlocks = (): void => {
  const now = new Date();
  const initialCount = ipBlockList.length;
  
  // Filter out expired blocks
  const newBlockList = ipBlockList.filter(rule => 
    !rule.expiresAt || rule.expiresAt > now
  );
  
  const clearedCount = initialCount - newBlockList.length;
  if (clearedCount > 0) {
    console.log(`Cleared ${clearedCount} expired IP blocks`);
  }
  
  // Update the block list
  ipBlockList.length = 0;
  ipBlockList.push(...newBlockList);
};
