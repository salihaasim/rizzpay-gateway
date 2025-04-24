
/**
 * RizzPay Gambling Mode - Admin Controls Module
 * Admin configuration to enable/disable gambling mode per merchant
 */

interface GamblingModeSettings {
  enabled: boolean;
  merchantId: string;
  restrictedCountries?: string[]; // ISO country codes
  maxDailyDepositLimit?: number;
  maxWithdrawalLimit?: number;
  obfuscateDescriptors: boolean;
  rotatePayoutEndpoints: boolean;
  hideSensitiveTransactions: boolean;
  updatedAt: Date;
  updatedBy: string;
}

// In-memory storage for demo purposes
// In production this would be stored in a database
const merchantSettings: Record<string, GamblingModeSettings> = {};

/**
 * Enable gambling mode for a merchant
 */
export const enableGamblingMode = (
  merchantId: string,
  adminId: string,
  settings: Partial<GamblingModeSettings> = {}
): GamblingModeSettings => {
  const currentSettings = merchantSettings[merchantId] || {
    enabled: false,
    merchantId,
    obfuscateDescriptors: true,
    rotatePayoutEndpoints: true,
    hideSensitiveTransactions: true,
    updatedAt: new Date(),
    updatedBy: adminId
  };
  
  // Update settings with new values
  const updatedSettings: GamblingModeSettings = {
    ...currentSettings,
    ...settings,
    enabled: true,
    updatedAt: new Date(),
    updatedBy: adminId
  };
  
  // Store updated settings
  merchantSettings[merchantId] = updatedSettings;
  
  return updatedSettings;
};

/**
 * Disable gambling mode for a merchant
 */
export const disableGamblingMode = (
  merchantId: string,
  adminId: string
): void => {
  const currentSettings = merchantSettings[merchantId];
  
  if (currentSettings) {
    merchantSettings[merchantId] = {
      ...currentSettings,
      enabled: false,
      updatedAt: new Date(),
      updatedBy: adminId
    };
  }
};

/**
 * Get gambling mode settings for a merchant
 */
export const getGamblingModeSettings = (
  merchantId: string
): GamblingModeSettings | undefined => {
  return merchantSettings[merchantId];
};

/**
 * Check if gambling mode is enabled for a merchant
 */
export const isGamblingModeEnabled = (merchantId: string): boolean => {
  return !!merchantSettings[merchantId]?.enabled;
};

/**
 * Update gambling mode settings for a merchant
 */
export const updateGamblingModeSettings = (
  merchantId: string,
  adminId: string,
  settings: Partial<GamblingModeSettings>
): GamblingModeSettings => {
  const currentSettings = merchantSettings[merchantId];
  
  if (!currentSettings) {
    // If no settings exist, create new entry with default values
    return enableGamblingMode(merchantId, adminId, settings);
  }
  
  // Update settings with new values
  const updatedSettings: GamblingModeSettings = {
    ...currentSettings,
    ...settings,
    updatedAt: new Date(),
    updatedBy: adminId
  };
  
  // Store updated settings
  merchantSettings[merchantId] = updatedSettings;
  
  return updatedSettings;
};

/**
 * Get all merchants with gambling mode enabled
 */
export const getGamblingEnabledMerchants = (): string[] => {
  return Object.entries(merchantSettings)
    .filter(([_, settings]) => settings.enabled)
    .map(([merchantId, _]) => merchantId);
};

/**
 * Log gambling mode setting changes
 */
export const logSettingsChange = (
  merchantId: string,
  adminId: string,
  change: 'enabled' | 'disabled' | 'settings_updated',
  details?: Record<string, any>
): void => {
  // In a production app, this would write to a secure audit log
  console.log(`[GAMBLING_MODE_AUDIT] ${new Date().toISOString()} | ${adminId} ${change} gambling mode for ${merchantId}`, details || '');
};
