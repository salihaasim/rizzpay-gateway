
/**
 * SLAM Engine - UPI Handle Rotation Module
 */

import { UpiHandle } from './types';

// Sample UPI handle pool
const UPI_HANDLE_POOL: UpiHandle[] = [
  {
    handle: 'rizzretail@icici',
    bank: 'ICICI Bank',
    daily_limit: 100,
    used_today: 0,
    is_active: true,
    last_used_at: null
  },
  {
    handle: 'rpaypro@yesbank',
    bank: 'Yes Bank',
    daily_limit: 100,
    used_today: 0,
    is_active: true,
    last_used_at: null
  },
  {
    handle: 'rizzservices@axis',
    bank: 'Axis Bank',
    daily_limit: 150,
    used_today: 0,
    is_active: true,
    last_used_at: null
  },
  {
    handle: 'rzpayments@hdfc',
    bank: 'HDFC Bank',
    daily_limit: 200,
    used_today: 0,
    is_active: true,
    last_used_at: null
  }
];

/**
 * Get next available UPI handle based on load balancing
 */
export const getNextUpiHandle = (merchantId?: string): string => {
  // Filter only active handles
  const activeHandles = UPI_HANDLE_POOL.filter(h => h.is_active);
  
  if (activeHandles.length === 0) {
    console.error("No active UPI handles available for rotation");
    return "rizzpay@ybl"; // Fallback handle
  }
  
  // Sort handles by usage
  const sortedHandles = [...activeHandles].sort((a, b) => 
    (a.used_today / a.daily_limit) - (b.used_today / b.daily_limit)
  );
  
  // Get handle with lowest utilization
  const selectedHandle = sortedHandles[0];
  
  // Update usage - in real implementation this would persist to database
  selectedHandle.used_today += 1;
  selectedHandle.last_used_at = new Date().toISOString();
  
  console.log(`UPI handle selected: ${selectedHandle.handle} (${selectedHandle.used_today}/${selectedHandle.daily_limit})`);
  
  return selectedHandle.handle;
};

/**
 * Reset daily usage counters - would be called by a scheduled job
 */
export const resetDailyCounters = (): void => {
  UPI_HANDLE_POOL.forEach(handle => {
    handle.used_today = 0;
  });
  console.log("Daily UPI handle usage counters reset");
};

/**
 * Get UPI handle statistics for monitoring
 */
export const getUpiHandleStats = (): UpiHandle[] => {
  return UPI_HANDLE_POOL.map(handle => ({...handle}));
};
