
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export function generateApiKey(): string {
  const uuid = uuidv4().replace(/-/g, '');
  const random = crypto.randomBytes(16).toString('hex');
  return `rizz_${uuid}${random}`;
}

export function validateApiKey(apiKey: string): boolean {
  return apiKey.startsWith('rizz_') && apiKey.length === 69;
}

export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}
