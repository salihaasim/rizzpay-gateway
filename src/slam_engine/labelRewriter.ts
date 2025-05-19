
/**
 * SLAM Engine - Transaction Label Rewriting Module
 */

import { MaskingRule } from './types';

// Sensitive terms that should be masked in transaction descriptions
const SENSITIVE_TERMS: MaskingRule[] = [
  { pattern: /gambl(e|ing)/i, replacement: 'entertainment', priority: 100 },
  { pattern: /bet(ting)?/i, replacement: 'subscription', priority: 100 },
  { pattern: /casino/i, replacement: 'premium service', priority: 100 },
  { pattern: /poker/i, replacement: 'game subscription', priority: 100 },
  { pattern: /fantasy/i, replacement: 'premium content', priority: 90 },
  { pattern: /rummy/i, replacement: 'entertainment subscription', priority: 90 },
  { pattern: /teen patti/i, replacement: 'premium access', priority: 90 },
  { pattern: /lottery/i, replacement: 'rewards program', priority: 80 },
  { pattern: /jackpot/i, replacement: 'bonus reward', priority: 80 },
  { pattern: /win(ning)?s?/i, replacement: 'rewards', priority: 70 },
  { pattern: /payout/i, replacement: 'transfer', priority: 60 }
];

// Safe alternative labels to use for transactions
const SAFE_LABELS = [
  'Customer Payment',
  'Service Invoice',
  'Digital Services',
  'Retail Purchase',
  'Monthly Subscription',
  'Product Order',
  'Invoice Payment',
  'Account Refill',
  'Customer Credit',
  'Wallet Top-up',
  'Utility Payment',
  'Membership Renewal'
];

/**
 * Clean a transaction description by replacing sensitive terms
 */
export const cleanTransactionDescription = (description: string): string => {
  if (!description) return getRandomSafeLabel();
  
  let cleanedText = description;
  let wasModified = false;
  
  // Apply rules in order of priority
  const sortedRules = [...SENSITIVE_TERMS].sort((a, b) => b.priority - a.priority);
  
  for (const rule of sortedRules) {
    if (rule.pattern instanceof RegExp) {
      if (rule.pattern.test(cleanedText)) {
        cleanedText = cleanedText.replace(rule.pattern, rule.replacement);
        wasModified = true;
      }
    } else {
      if (cleanedText.toLowerCase().includes(rule.pattern.toLowerCase())) {
        cleanedText = cleanedText.replace(new RegExp(rule.pattern, 'gi'), rule.replacement);
        wasModified = true;
      }
    }
  }
  
  // If description contained sensitive terms, replace it entirely with a safe label
  if (wasModified) {
    return getRandomSafeLabel();
  }
  
  return cleanedText;
};

/**
 * Get a random safe transaction label
 */
export const getRandomSafeLabel = (): string => {
  const randomIndex = Math.floor(Math.random() * SAFE_LABELS.length);
  const baseLabel = SAFE_LABELS[randomIndex];
  
  // Add a random invoice/order number to make it look more authentic
  const shouldAddNumber = Math.random() > 0.5;
  if (shouldAddNumber) {
    const prefix = Math.random() > 0.5 ? 'INV' : 'ORD';
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${baseLabel} #${prefix}${randomNum}`;
  }
  
  return baseLabel;
};

/**
 * Clean a merchant name to remove sensitive terms or business indicators
 */
export const cleanMerchantName = (merchantName: string): string => {
  if (!merchantName) return "RIZZ RETAIL SERVICES";
  
  // Check if merchant name contains sensitive terms
  const hasSensitiveTerms = SENSITIVE_TERMS.some(rule => {
    if (rule.pattern instanceof RegExp) {
      return rule.pattern.test(merchantName);
    }
    return merchantName.toLowerCase().includes(rule.pattern.toLowerCase());
  });
  
  // If merchant name contains sensitive terms, return a generic alternative
  if (hasSensitiveTerms) {
    const alternatives = [
      "RIZZ RETAIL SERVICES",
      "UTS ENTERPRISES",
      "RPay Commercial",
      "RZ Digital Solutions",
      "RizzPro Services"
    ];
    return alternatives[Math.floor(Math.random() * alternatives.length)];
  }
  
  return merchantName;
};
