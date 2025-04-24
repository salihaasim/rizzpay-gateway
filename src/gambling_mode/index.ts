
/**
 * RizzPay Gambling Mode - Main Entry Point
 */

export * from './wallet';
export * from './upi_integration';
export * from './payout_queue';
export * from './risk_controls';
export * from './admin_controls';

export interface GamblingModeContext {
  merchantId: string;
  isEnabled: boolean;
  settings: Record<string, any>;
}

// Export common gambling mode types and utilities
export { GamblingModeContext } from './admin_controls';
